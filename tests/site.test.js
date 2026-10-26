import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {mount,flushPromises} from '@vue/test-utils';
import {readFileSync} from 'node:fs';
import App from '../src/App.vue';
const menu=JSON.parse(readFileSync('public/menu.json','utf8'));
let wrapper;
const response=(data,status=200)=>Promise.resolve({ok:status<400,status,json:async()=>data});
beforeEach(()=>{
 vi.stubGlobal('localStorage',{getItem:()=>null,setItem:vi.fn()});
 vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener(){},removeEventListener(){}}));
 vi.stubGlobal('fetch',vi.fn(url=>response(menu)));
 Element.prototype.scrollIntoView=vi.fn();
});
afterEach(()=>{wrapper?.unmount();vi.unstubAllGlobals();});
const mountSite=()=>mount(App,{global:{stubs:{CuencaScene:true}}});
it('paginates the catalog and searches accents in either language',async()=>{
 wrapper=mountSite();await flushPromises();
 expect(wrapper.findAll('.menu-item')).toHaveLength(6);
 await wrapper.find('input[type=search]').setValue('bolon');
 expect(wrapper.findAll('.menu-item')).toHaveLength(5);
 await wrapper.find('input[type=search]').setValue('shrimp');
 expect(wrapper.findAll('.menu-item')).toHaveLength(6);
 await wrapper.find('.language').trigger('click');
 expect(wrapper.find('h1').text()).toContain('Ecuadorian cooking');
 expect(document.documentElement.lang).toBe('en');
});
it('shows category-specific menu and keeps unknown prices uninvented',async()=>{
 wrapper=mountSite();await flushPromises();
 await wrapper.find('#menu-category').setValue('seafood');
 expect(wrapper.findAll('.menu-item')).toHaveLength(6);
 for(let i=0;i<4;i++) await wrapper.findAll('.menu-pagination button')[1].trigger('click');
 expect(wrapper.findAll('.menu-item')).toHaveLength(2);
 expect(wrapper.findAll('.ask-price')).toHaveLength(2);
});
it('uses the bundled full catalog when the API is temporarily unavailable',async()=>{
 fetch.mockImplementation(url=>url==='/api/menu'?response({},503):response(menu));
 wrapper=mountSite();await flushPromises();
 expect(wrapper.findAll('.menu-item')).toHaveLength(6);
 expect(fetch).toHaveBeenCalledWith('/menu.json');
});
it('submits an inquiry to FastAPI and shows its reference, not an order confirmation',async()=>{
 fetch.mockImplementation(url=>url==='/api/catering'?response({id:'abcd1234-9876'},201):response(menu));
 wrapper=mountSite();await flushPromises();
 const form=wrapper.find('.inquiry-card form');
 const inputs=form.findAll('input');
 for(const [index,value]of [[0,'Demo User'],[1,'7185550100'],[2,'demo@example.com'],[3,'2099-12-20'],[4,'30'],[5,'Hornado']])await inputs[index].setValue(value);
 await form.find('input[type=checkbox]').setValue(true);
 await form.trigger('submit');await flushPromises();
 expect(wrapper.find('.sent').text()).toContain('ABCD1234');
 expect(wrapper.find('.sent').text()).toContain('Esto no confirma una reserva ni un pedido.');
});

it('keeps every item reachable without rendering the full catalog',async()=>{
 wrapper=mountSite();await flushPromises();
 await wrapper.find('#menu-category').setValue('all');
 const ids=new Set();
 for(let n=0;n<32;n++){
  for(const i of wrapper.findAll('.dish-card'))ids.add(i.attributes('id'));
  if(n<31) await wrapper.findAll('.menu-pagination button')[1].trigger('click');
 }
 expect(ids.size).toBe(191);
 expect(wrapper.findAll('.menu-pagination button')[1].attributes('disabled')).toBeDefined();
 await wrapper.find('input[type=search]').setValue('bolon');
 expect(wrapper.findAll('.menu-item')).toHaveLength(5);
});
it('saves a shortlist and renders only server-confirmed chat dish cards',async()=>{
 fetch.mockImplementation(url=>url==='/api/chat'?response({message:'Estas opciones están en nuestra carta.',items:[menu.categories[0].items[0]]}):response(menu));
 wrapper=mountSite();await flushPromises();
 await wrapper.find('.dish-card-top button').trigger('click');
 await wrapper.find('.shortlist-toggle').trigger('click');
 expect(wrapper.findAll('.dish-card')).toHaveLength(1);
 await wrapper.find('.menu-ai').trigger('click');
 await wrapper.find('#chat-question').setValue('Algo para desayunar');
 await wrapper.find('.menu-chat form').trigger('submit');await flushPromises();
 expect(wrapper.find('.chat-dish').text()).toContain('Bolón mixto');
 expect(fetch).toHaveBeenCalledWith('/api/chat',expect.objectContaining({method:'POST'}));
});
it('shows an honest unavailable message without fabricating an AI response',async()=>{
 fetch.mockImplementation(url=>url==='/api/chat'?response({},503):response(menu));
 wrapper=mountSite();await flushPromises();await wrapper.find('.menu-ai').trigger('click');
 await wrapper.find('#chat-question').setValue('Recomienda pollo');await wrapper.find('.menu-chat form').trigger('submit');await flushPromises();
 expect(wrapper.find('.menu-chat [role=alert]').text()).toContain('todavía no está disponible');
 expect(wrapper.findAll('.chat-dish')).toHaveLength(0);
});

it('opens each featured food in the menu after clearing other filters',async()=>{
 wrapper=mountSite();await flushPromises();
 for(const link of wrapper.findAll('.food-link')){
  await wrapper.find('input[type=search]').setValue('no-match');
  await wrapper.find('.shortlist-toggle').trigger('click');
  const hash=link.attributes('href');
  window.location.hash=hash;
  window.dispatchEvent(new Event('hashchange'));
  await flushPromises();
  expect(wrapper.find(hash).exists()).toBe(true);
  expect(wrapper.find('input[type=search]').element.value).toBe('');
  expect(wrapper.find('.shortlist-toggle').attributes('aria-pressed')).toBe('false');
 }
 window.location.hash='';
});
it('opens a linked dish when the catalog finishes loading',async()=>{
 window.location.hash='#dish-favorites-9';
 wrapper=mountSite();await flushPromises();
 expect(wrapper.find('#dish-favorites-9').text()).toContain('Colada morada');
 window.location.hash='';
});

it('links the footer credit to GOZSYL',async()=>{
 wrapper=mountSite();await flushPromises();
 const credit=wrapper.find('footer .powered-by');
 expect(credit.text()).toBe('Powered by GOZSYL');
 expect(credit.attributes('href')).toBe('https://gozsyl.cloud');
});
