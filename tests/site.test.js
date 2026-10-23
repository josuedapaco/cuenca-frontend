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
it('renders all 191 dishes and filters accents in either language',async()=>{
 wrapper=mountSite();await flushPromises();
 expect(wrapper.findAll('.menu-item')).toHaveLength(191);
 await wrapper.find('input[type=search]').setValue('bolon');
 expect(wrapper.findAll('.menu-item')).toHaveLength(5);
 await wrapper.find('input[type=search]').setValue('shrimp');
 expect(wrapper.findAll('.menu-item').length).toBeGreaterThan(5);
 await wrapper.find('.language').trigger('click');
 expect(wrapper.find('h1').text()).toContain('Some journeys');
 expect(document.documentElement.lang).toBe('en');
});
it('shows category-specific menu and keeps unknown prices uninvented',async()=>{
 wrapper=mountSite();await flushPromises();
 const seafood=wrapper.findAll('.category-tabs button').find(b=>b.text()==='Mariscos');
 await seafood.trigger('click');
 expect(wrapper.findAll('.menu-item')).toHaveLength(26);
 expect(wrapper.findAll('.ask-price')).toHaveLength(2);
});
it('uses the bundled full catalog when the API is temporarily unavailable',async()=>{
 fetch.mockImplementation(url=>url==='/api/menu'?response({},503):response(menu));
 wrapper=mountSite();await flushPromises();
 expect(wrapper.findAll('.menu-item')).toHaveLength(191);
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
