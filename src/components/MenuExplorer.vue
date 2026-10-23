<script setup>
import {computed,ref,watch,nextTick} from 'vue';
const props=defineProps({menu:Object,language:String,error:Boolean});
const es=computed(()=>props.language==='es');
const tr=(a,b)=>es.value?a:b;
const category=ref('ecuador'),search=ref(''),page=ref(1),saved=ref([]),savedOnly=ref(false);
const categories=computed(()=>props.menu?.categories||[]);
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const all=computed(()=>categories.value.flatMap(c=>c.items.map(i=>({...i,category:c.id,category_name:es.value?c.name_es:c.name_en}))));
const filtered=computed(()=>all.value.filter(i=>(savedOnly.value?saved.value.includes(i.id):(search.value||category.value==='all'||i.category===category.value))&&fold(i.name_es+' '+i.name_en).includes(fold(search.value))));
const pages=computed(()=>Math.max(1,Math.ceil(filtered.value.length/6)));
const visible=computed(()=>filtered.value.slice((page.value-1)*6,page.value*6));
const title=computed(()=>savedOnly.value?tr('Mis antojos','My shortlist'):search.value?tr('Lo que buscas','Your search'):category.value==='all'?tr('Toda la carta','The whole menu'):(categories.value.find(c=>c.id===category.value)?.[es.value?'name_es':'name_en']||''));
const name=i=>es.value?i.name_es:i.name_en;
const currency=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const sizes={Small:['Pequeño','Small'],Medium:['Mediano','Medium'],Large:['Grande','Large'],Water:['Agua','Water'],Milk:['Leche','Milk']};
const price=p=>(p.size?(sizes[p.size]?.[es.value?0:1]||p.size)+' · ':'')+currency(p.amount);
watch([category,search,savedOnly],()=>{page.value=1;});
watch(saved,()=>{if(page.value>pages.value)page.value=pages.value;});
function toggle(id){saved.value=saved.value.includes(id)?saved.value.filter(x=>x!==id):[...saved.value,id];}
function turn(delta){page.value+=delta;document.getElementById('dish-grid')?.focus({preventScroll:true});}
const chatOpen=ref(false),question=ref(''),busy=ref(false),chatError=ref(''),messages=ref([]),chatInput=ref(null),chatLog=ref(null);
const starters=computed(()=>es.value?['Algo ecuatoriano por menos de $20','¿Qué puedo desayunar?','Me apetece mariscos']:['Ecuadorian food under $20','What can I have for breakfast?','I feel like seafood']);
async function openChat(){chatOpen.value=true;await nextTick();chatInput.value?.focus();}
function closeChat(){chatOpen.value=false;document.getElementById('chat-launcher')?.focus();}
async function ask(text=question.value){
 text=text.trim();if(!text||busy.value)return;
 question.value='';chatError.value='';busy.value=true;
 const history=messages.value.filter(m=>m.role==='user').slice(-3).map(m=>m.text);
 messages.value.push({role:'user',text});
 try{
  const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,history,language:props.language})});
  if(!r.ok)throw Error(r.status===503?'offline':r.status===429?'limit':'error');
  const data=await r.json();messages.value.push({role:'assistant',text:data.message,items:data.items});
 }catch(e){chatError.value=e.message==='offline'?tr('El asistente todavía no está disponible. Explora la carta o llámanos.','The assistant is not available yet. Explore the menu or call us.'):e.message==='limit'?tr('Llegamos al límite de consultas. Inténtalo más tarde o llámanos.','The question limit has been reached. Try again later or call us.'):tr('No pudimos conectar. Vuelve a intentarlo.','We could not connect. Please try again.');}
 finally{busy.value=false;await nextTick();if(chatLog.value)chatLog.value.scrollTop=chatLog.value.scrollHeight;chatInput.value?.focus();}
}
</script>
<template>
<div class="menu-explorer">
 <div class="menu-toolbar"><label class="search"><span aria-hidden="true">⌕</span><input v-model="search" type="search" :placeholder="tr('Busca un plato o un ingrediente…','Search a dish or ingredient…')" :aria-label="tr('Buscar en el menú','Search the menu')"><span>{{all.length}}</span></label><button class="shortlist-toggle" :aria-pressed="savedOnly" @click="savedOnly=!savedOnly">♡ {{tr('Mis antojos','My shortlist')}} <b>{{saved.length}}</b></button><button class="button menu-ai" @click="openChat">✳ {{tr('Ayúdame a elegir','Help me choose')}}</button></div>
 <div class="category-picker"><label for="menu-category">{{tr('Explora por categoría','Explore by category')}}</label><select id="menu-category" v-model="category" @change="savedOnly=false;search=''" :disabled="!menu"><option value="all">{{tr('Toda la carta','Full menu')}}</option><option v-for="c in categories" :key="c.id" :value="c.id">{{es?c.name_es:c.name_en}} ({{c.items.length}})</option></select><div class="category-tabs" role="group" :aria-label="tr('Accesos rápidos','Quick categories')"><button v-for="id in ['ecuador','colombia','seafood','breakfast-ec','drinks']" :key="id" :aria-pressed="category===id&&!savedOnly&&!search" :class="{active:category===id&&!savedOnly&&!search}" @click="category=id;savedOnly=false;search=''">{{categories.find(c=>c.id===id)?.[es?'name_es':'name_en']}}</button></div></div>
 <p v-if="!menu&&!error" role="status">{{tr('Preparando la carta…','Loading the menu…')}}</p><p v-if="error" role="alert">{{tr('No pudimos cargar la carta. Llámanos al 718.847.4697.','We could not load the menu. Call 718.847.4697.')}}</p>
 <div class="explorer-heading"><h3>{{title}}</h3><span role="status" aria-live="polite">{{filtered.length}} {{tr('opciones','options')}} · {{tr('Página','Page')}} {{page}} / {{pages}}</span></div>
 <div id="dish-grid" class="dish-grid" tabindex="-1">
  <article v-for="item in visible" :key="item.id" class="menu-item dish-card" :id="'dish-'+item.id"><div class="dish-card-top"><span>{{item.number?'Nº '+item.number:item.category_name}}</span><button :aria-label="(saved.includes(item.id)?tr('Quitar de mis antojos: ','Remove from shortlist: '):tr('Guardar: ','Save: '))+name(item)" :aria-pressed="saved.includes(item.id)" @click="toggle(item.id)">{{saved.includes(item.id)?'♥':'♡'}}</button></div><div class="dish-copy"><h4>{{name(item)}}</h4><p>{{es?item.name_en:item.name_es}}</p><small v-if="item.note_es">{{es?item.note_es:item.note_en}}</small></div><div class="dish-price"><span v-for="p in item.prices" :key="p.size">{{price(p)}}</span><span v-if="!item.prices.length" class="ask-price">{{tr('Consultar precio','Ask for price')}}</span></div></article>
 </div>
 <div v-if="menu&&!filtered.length" class="empty-result"><h4>{{tr('Todavía no hay platos aquí.','No dishes here yet.')}}</h4><p>{{savedOnly?tr('Toca el corazón de un plato para guardarlo durante tu visita.','Tap a dish’s heart to save it during your visit.'):tr('Prueba otro nombre o explora una categoría.','Try another name or explore a category.')}}</p><button @click="search='';savedOnly=false;category='all'">{{tr('Explorar la carta','Explore the menu')}}</button></div>
 <nav v-if="filtered.length" class="menu-pagination" :aria-label="tr('Páginas del menú','Menu pages')"><button @click="turn(-1)" :disabled="page===1">← {{tr('Anterior','Previous')}}</button><span>{{tr('Viendo','Showing')}} {{(page-1)*6+1}}–{{Math.min(page*6,filtered.length)}} / {{filtered.length}}</span><button @click="turn(1)" :disabled="page===pages">{{tr('Siguiente','Next')}} →</button></nav>
 <div class="menu-bottom"><span>{{tr('Elige a tu ritmo. Guarda tus favoritos con ♡.','Take your time. Save your favorites with ♡.')}}</span><a href="tel:+17188474697">{{tr('Confirmar disponibilidad','Confirm availability')}} ↗</a></div>
</div>
<button id="chat-launcher" class="chat-launcher" @click="chatOpen?closeChat():openChat()" :aria-expanded="chatOpen" aria-controls="menu-chat">✳ {{tr('¿Qué se te antoja?','What are you craving?')}}</button>
<section v-if="chatOpen" id="menu-chat" class="menu-chat" role="dialog" :aria-label="tr('Asistente de la carta','Menu assistant')" @keydown.esc="closeChat"><header><div><span>CUENCA · AI</span><h3>{{tr('Encuentra tu antojo.','Find your next favorite.')}}</h3></div><button @click="closeChat" :aria-label="tr('Cerrar asistente','Close assistant')">×</button></header><div class="chat-log" ref="chatLog" role="log" aria-live="polite" :aria-busy="busy"><p class="chat-welcome">{{tr('Soy el asistente de la carta. Cuéntame qué te gusta y te propongo platos de nuestro menú.','I’m your menu assistant. Tell me what you like and I’ll suggest dishes from our menu.')}}</p><div v-if="!messages.length" class="chat-starters"><button v-for="s in starters" :key="s" @click="ask(s)">{{s}} ↗</button></div><article v-for="(m,index) in messages" :key="index" :class="['chat-message',m.role]"><p>{{m.text}}</p><button v-for="i in m.items" :key="i.id" class="chat-dish" @click="category='all';search=name(i);savedOnly=false;closeChat();nextTick(()=>document.getElementById('menu-controls')?.scrollIntoView({block:'start'}))"><strong>{{name(i)}}</strong><span>{{i.prices.length?i.prices.map(price).join(' / '):tr('Consultar precio','Ask for price')}}</span><small>{{tr('Ver en la carta','View on menu')}} ↗</small></button></article><p v-if="busy" role="status">{{tr('Buscando en nuestra carta…','Looking through our menu…')}}</p><p v-if="chatError" class="form-error" role="alert">{{chatError}}</p></div><form @submit.prevent="ask()"><label class="sr-only" for="chat-question">{{tr('Tu pregunta sobre la carta','Your menu question')}}</label><input id="chat-question" ref="chatInput" v-model="question" maxlength="500" :placeholder="tr('Me apetece…','I feel like…')" :disabled="busy" required autocomplete="off"><button :disabled="busy||!question.trim()" :aria-label="tr('Enviar pregunta','Send question')">↑</button></form><p class="chat-privacy">{{tr('IA de OpenAI · Solo recomendaciones. No compartas datos personales. No confirma alérgenos, pedidos ni reservas.','OpenAI AI · Recommendations only. Don’t share personal data. Cannot confirm allergens, orders or reservations.')}}</p></section>
</template>
