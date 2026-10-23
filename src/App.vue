<script setup>
import {ref,computed,onMounted,watch} from 'vue';
import Arrow from './components/Arrow.vue';
import MenuExplorer from './components/MenuExplorer.vue';
import {logoPng,interiorPhoto} from './brandAssets.js';
let savedTheme=null;
try{savedTheme=localStorage.getItem('cuenca-theme');}catch{}
const theme=ref(savedTheme==='dark'||savedTheme==='light'?savedTheme:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
function applyTheme(value){document.documentElement.dataset.theme=value;document.documentElement.style.colorScheme=value;}
function toggleTheme(){theme.value=theme.value==='dark'?'light':'dark';}
watch(theme,value=>{applyTheme(value);try{localStorage.setItem('cuenca-theme',value);}catch{}});
applyTheme(theme.value);
let initialLanguage='es';
try{initialLanguage=localStorage.getItem('cuenca-language')==='en'?'en':'es';}catch{}
const language=ref(initialLanguage);
const es=computed(()=>language.value==='es');
const tr=(a,b)=>es.value?a:b;
const menu=ref(null),menuError=ref(false),navOpen=ref(false);
const inquiry=ref(null),form=ref({name:'',phone:'',email:'',event_date:'',guests:20,dishes:'',notes:'',consent:false}),sending=ref(false),formError=ref(''),sent=ref('');
const earliest=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const mapsGoogle='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Cuenca Coffee Shop 9529 Jamaica Ave Woodhaven NY 11421');
const mapsApple='https://maps.apple.com/?q='+encodeURIComponent('Cuenca Coffee Shop')+'&daddr='+encodeURIComponent('9529 Jamaica Ave, Woodhaven, NY 11421');
async function loadMenu(){
 try{const response=await fetch('/api/menu');if(!response.ok)throw Error();menu.value=await response.json();}
 catch{try{const response=await fetch('/menu.json');if(!response.ok)throw Error();menu.value=await response.json();}catch{menuError.value=true;}}
}
async function submit(){
 sending.value=true;formError.value='';
 try{
  const response=await fetch('/api/catering',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form.value,language:language.value,guests:Number(form.value.guests)})});
  if(!response.ok)throw Error(response.status===429?'rate':'unavailable');
  const data=await response.json();sent.value=data.id.slice(0,8).toUpperCase();
 }catch{formError.value=tr('No pudimos registrar tu consulta. Llámanos al 718.847.4697 para coordinar tu evento.','We could not save your inquiry. Call 718.847.4697 to discuss your event.');}
 finally{sending.value=false;}
}
watch(language,value=>{try{localStorage.setItem('cuenca-language',value);}catch{}document.documentElement.lang=value;});
onMounted(()=>{document.documentElement.lang=language.value;loadMenu();});
</script>

<template>
<a class="skip-link" href="#menu">{{tr('Saltar al menú','Skip to menu')}}</a>
<div class="announcement"><span class="flag-stripe" aria-hidden="true"></span>{{tr('Un pedacito de Ecuador y Colombia en Queens','A little piece of Ecuador & Colombia in Queens')}}<a href="tel:+17188474697">718.847.4697 <Arrow/></a></div>
<header class="header">
 <a class="brand" href="#home" aria-label="Cuenca Coffee Shop home"><img :src="logoPng" width="120" height="96" alt="Cuenca Coffee Shop"><span class="sr-only">CUENCA COFFEE SHOP · WOODHAVEN</span></a>
 <button class="mobile-menu" @click="navOpen=!navOpen" :aria-expanded="navOpen" aria-controls="main-nav">{{tr('Menú','Explore')}} <span>{{navOpen?'−':'+'}}</span></button>
 <nav id="main-nav" :class="{open:navOpen}" :aria-label="tr('Navegación principal','Main navigation')" @click="navOpen=false"><a href="#story">{{tr('Nuestra casa','Our story')}}</a><a href="#menu">{{tr('La carta','The menu')}}</a><a href="#catering">{{tr('Celebraciones','Catering')}}</a><a href="#visit">{{tr('Visítanos','Find us')}}</a></nav>
 <div class="header-actions"><button class="theme-toggle" @click="toggleTheme" :aria-label="theme==='dark'?tr('Activar modo claro','Switch to light mode'):tr('Activar modo oscuro','Switch to dark mode')" :title="theme==='dark'?tr('Modo claro','Light mode'):tr('Modo oscuro','Dark mode')" :aria-pressed="theme==='dark'"><svg v-if="theme==='dark'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><svg v-else width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg></button><button class="language" @click="language=es?'en':'es'" :aria-label="es?'Switch to English':'Cambiar a español'">{{es?'EN':'ES'}}</button><a class="button small" href="tel:+17188474697">{{tr('Llámanos','Call us')}} <Arrow/></a></div>
</header>
<main>
<section class="hero" id="home">
 <div class="hero-copy"><div class="eyebrow"><span></span> ECUADOR · COLOMBIA · NUEVA YORK</div><h1>{{tr('Cocina de Ecuador','Ecuadorian cooking')}}<br>{{tr('y Colombia,','& Colombian favorites,')}}<br><em>{{tr('aquí en Queens.','here in Queens.')}}</em></h1><p>{{tr('Bolones, encebollado, bandejas colombianas y café. Ven a comer en Woodhaven o llámanos para hacer tu pedido.','Bolones, encebollado, Colombian platters and coffee. Join us in Woodhaven or call to place your order.')}}</p><div class="hero-actions"><a class="button" href="#menu">{{tr('Explorar la carta','Explore the menu')}} <Arrow/></a><a class="text-link" href="#visit">{{tr('Cómo llegar','Find your way')}} <Arrow/></a></div><div class="hero-location"><span class="location-dot"></span> 9529 Jamaica Ave. · Woodhaven, Queens</div></div>
 <div class="hero-art"><div class="sunburst" aria-hidden="true">✳</div><span class="art-caption">{{tr('HECHO CON RAÍCES. SERVIDO CON ALMA.','ROOTED IN TRADITION. SERVED WITH SOUL.')}}</span><div class="hero-arch"><img src="/images/chicken-v2.svg" width="1254" height="1254" fetchpriority="high" :alt="tr('Pollo asado con arroz blanco y frijoles','Roast chicken with white rice and beans')"></div><div class="origin-stamp"><span>DESDE</span><strong>EL<br>ECUADOR</strong><span>CON CARIÑO</span></div><div class="drink-inset"><img src="/images/colada-v2.svg" width="640" height="338" :alt="tr('Colada morada con trozos de fruta','Colada morada with fruit pieces')"><span>Colada morada <Arrow/></span></div><div class="hero-art-footer"><span>{{tr('SABORES QUE CRUZAN FRONTERAS','FLAVORS WITHOUT BORDERS')}}</span><span>01 / 04</span></div></div>
</section>
<div class="heritage-ribbon" aria-hidden="true"><span>ECUADOR</span> <i>✦</i> <span>COLOMBIA</span> <i>✦</i> <span>WOODHAVEN</span> <i>✦</i> <span>{{tr('BIENVENIDOS A CASA','WELCOME TO OUR TABLE')}}</span></div>
<section class="story section" id="story">
 <div class="section-index">01 — {{tr('NUESTRAS RAÍCES','OUR ROOTS')}}</div>
 <div class="story-title"><h2>{{tr('De nuestra tierra,','From our roots,')}}<br><em>{{tr('para todo el mundo.','for the whole world.')}}</em></h2><div><p>{{tr('En Cuenca Coffee Shop compartimos los sabores de Ecuador y Colombia en Woodhaven, Nueva York. Desde un bolón por la mañana hasta un encebollado o una bandeja colombiana: aquí siempre hay una nueva historia que probar.','At Cuenca Coffee Shop, we share the flavors of Ecuador and Colombia in Woodhaven, New York. From a morning bolón to encebollado or a Colombian platter, there is always a new story to taste.')}}</p><a class="text-link" href="#menu">{{tr('Encuentra tu próximo favorito','Find your next favorite')}} <Arrow/></a></div></div>
 <div class="taste-grid"><article class="taste-card first"><img src="/images/chicken-v2.svg" width="640" height="640" loading="lazy" :alt="tr('Pollo asado, arroz y frijoles','Roast chicken, rice and beans')"><div><span>01 / {{tr('TRADICIÓN','TRADITION')}}</span><h3>{{tr('Pollo, arroz y frijoles.','Chicken, rice & beans.')}}</h3></div></article><article class="taste-card second"><img src="/images/seafood-v2.svg" width="640" height="338" loading="lazy" :alt="tr('Plato de mariscos con hierbas y arroz blanco aparte','Seafood with herbs and a side of white rice')"><div><span>02 / {{tr('COSTA','COAST')}}</span><h3>{{tr('Mariscos de la casa.','Seafood from our kitchen.')}}</h3></div></article><article class="taste-card third"><img src="/images/colada-v2.svg" width="640" height="338" loading="lazy" :alt="tr('Colada morada ecuatoriana','Ecuadorian colada morada')"><div><span>03 / {{tr('MEMORIA','MEMORIES')}}</span><h3>{{tr('Colada morada.','Colada morada.')}}</h3></div></article></div>
 <p class="photo-note">{{tr('Fotografías del dossier del restaurante; algunas imágenes de platos incluyen mejoras generativas. Consulta la presentación y disponibilidad actual.','Photos from the restaurant dossier; some food images include generative enhancements. Ask about current presentation and availability.')}}</p>
</section>
<section class="menu-section section" id="menu">
 <div class="section-index">02 — {{tr('UN RECORRIDO POR NUESTRA CARTA','A JOURNEY THROUGH OUR MENU')}}</div>
 <div class="menu-heading"><h2>{{tr('Nuestra','Our')}}<br><em>{{tr('carta.','menu.')}}</em></h2><p>{{tr('Del desayuno al último antojo. Explora nuestra carta completa, en español e inglés.','From breakfast to that last little craving. Explore our complete menu in Spanish and English.')}}<small>{{tr('Precios en USD. Confirma precios y disponibilidad al llamar.','Prices in USD. Call to confirm current prices and availability.')}}</small></p></div>
 <div id="menu-controls"><MenuExplorer :menu="menu" :language="language" :error="menuError"/></div>
</section>
<section class="catering section" id="catering"><div class="catering-copy"><div class="section-index">03 — {{tr('HAY MUCHO QUE CELEBRAR','MORE REASONS TO CELEBRATE')}}</div><h2>{{tr('Una mesa grande.','A bigger table.')}}<br><em>{{tr('Un gran recuerdo.','A lasting memory.')}}</em></h2><p>{{tr('Lleva los sabores de Ecuador y Colombia a tu celebración. Buffet, bandejas, pedidos de pan y comida para ocasiones especiales, preparados para compartir.','Bring Ecuadorian and Colombian flavors to your celebration. Buffets, party trays, bread orders and special occasion food, made to share.')}}</p><ul><li>{{tr('Buffet y bandejas para fiestas','Party buffets & trays')}}</li><li>{{tr('Pan y pedidos especiales','Bread & special food orders')}}</li><li>{{tr('Pavo y pollo horneados','Roast turkey & chicken')}}</li></ul><a href="tel:+17188474697" class="button ivory">{{tr('Hablemos de tu evento','Let’s plan your gathering')}} <Arrow/></a><p class="catering-note">{{tr('Precios y alcance sujetos a cotización. Entrega, montaje y personal no están incluidos sin confirmación.','Pricing and scope quoted individually. Delivery, setup and staffing require separate confirmation.')}}</p></div>
 <div class="inquiry-card" ref="inquiry"><div v-if="sent" class="sent" role="status"><span>✓</span><h3>{{tr('Tu consulta quedó registrada.','Your inquiry is saved.')}}</h3><p>{{tr('Referencia','Reference')}}: {{sent}}</p><p>{{tr('Llámanos para confirmar disponibilidad y cotización. Esto no confirma una reserva ni un pedido.','Please call to confirm availability and a quote. This is not a confirmed booking or order.')}}</p><a class="button" href="tel:+17188474697">718.847.4697 <Arrow/></a></div><form v-else @submit.prevent="submit"><h3>{{tr('Cuéntanos tu idea.','Tell us what you have in mind.')}}</h3><p>{{tr('Guardamos tu consulta para coordinarla contigo por teléfono.','We save your inquiry so we can discuss it with you by phone.')}}</p><div class="form-grid"><label>{{tr('Nombre','Name')}}<input v-model="form.name" required minlength="2" maxlength="100" autocomplete="name"></label><label>{{tr('Teléfono','Phone')}}<input v-model="form.phone" required type="tel" minlength="7" maxlength="30" autocomplete="tel"></label><label class="full">{{tr('Correo (opcional)','Email (optional)')}}<input v-model="form.email" type="email" maxlength="160" autocomplete="email"></label><label>{{tr('Fecha del evento','Event date')}}<input v-model="form.event_date" required type="date" :min="earliest"></label><label>{{tr('Invitados','Guest count')}}<input v-model="form.guests" required type="number" min="1" max="10000"></label><label class="full">{{tr('Platos que te interesan','Dishes you have in mind')}}<input v-model="form.dishes" required minlength="2" maxlength="1000"></label><label class="full">{{tr('Cuéntanos un poco más (opcional)','Anything else? (optional)')}}<textarea v-model="form.notes" rows="2" maxlength="2000"></textarea></label></div><label class="consent"><input v-model="form.consent" required type="checkbox"><span>{{tr('Acepto que Cuenca Coffee Shop me contacte sobre esta consulta.','I agree to be contacted by Cuenca Coffee Shop about this inquiry.')}}</span></label><p v-if="formError" class="form-error" role="alert">{{formError}}</p><button class="button" :disabled="sending">{{sending?tr('Guardando…','Saving…'):tr('Enviar consulta','Send inquiry')}} <Arrow/></button><small class="privacy-note">{{tr('Usamos estos datos solo para gestionar tu consulta. No es una reserva confirmada.','Your information is used to handle this inquiry. This is not a confirmed reservation.')}}</small></form></div>
</section>
<section class="visit section" id="visit"><div class="section-index">04 — {{tr('TU PRÓXIMA PARADA','YOUR NEXT STOP')}}</div><div class="visit-layout"><div><h2>{{tr('Estamos en','Find us in')}}<br><em>{{tr('Woodhaven.','Woodhaven.')}}</em></h2><p>{{tr('¿Entre vuelos o explorando Nueva York? Haz una parada para descubrir los sabores de Ecuador y Colombia. Te esperamos en Woodhaven.','Between flights or exploring New York? Make a stop for the flavors of Ecuador and Colombia. Find us in Woodhaven.')}}</p><address>9529 Jamaica Ave.<br>Woodhaven, NY 11421</address><div class="map-links"><a class="button" :href="mapsGoogle" target="_blank" rel="noopener">Google Maps <Arrow/></a><a class="text-link" :href="mapsApple" target="_blank" rel="noopener">Apple Maps <Arrow/></a></div><div class="visit-details"><div><span>{{tr('PARA PEDIDOS Y CONSULTAS','ORDERS & QUESTIONS')}}</span><a href="tel:+17188474697">718.847.4697</a><a href="tel:+17188474642">718.847.4642</a></div><div><span>{{tr('PLANIFICA TU VISITA','PLAN YOUR VISIT')}}</span><p>{{tr('Llámanos para confirmar el horario y la disponibilidad de los platos.','Call to confirm opening hours and dish availability.')}}</p></div></div></div><figure class="interior"><img :src="interiorPhoto" width="665" height="1182" loading="lazy" :alt="tr('Interior de Cuenca Coffee Shop, fotografía retocada','Cuenca Coffee Shop interior, retouched photo')"><figcaption><span>{{tr('ESTA ES TU CASA','MAKE YOURSELF AT HOME')}}</span><strong>Woodhaven,<br>New York.</strong></figcaption></figure></div></section>
</main>
<footer><div class="footer-top"><a href="#home" class="footer-brand">CUENCA<span>COFFEE SHOP</span></a><p>{{tr('De nuestra tierra.','Rooted in our homeland.')}}<br><em>{{tr('A tu mesa.','Shared at your table.')}}</em></p><a class="footer-call" href="tel:+17188474697">{{tr('Siempre empieza con un hola.','It starts with a hello.')}} <Arrow/></a></div><div class="footer-bottom"><span>© {{new Date().getFullYear()}} Cuenca Coffee Shop</span><span>9529 Jamaica Ave. · Woodhaven, NY</span><a href="#home">{{tr('Volver al inicio','Back to top')}} ↑</a></div></footer>
<div class="mobile-dock"><a href="#menu">{{tr('Ver carta','View menu')}}</a><a href="tel:+17188474697">{{tr('Llamar','Call us')}} <Arrow/></a><a href="#visit">{{tr('Cómo llegar','Directions')}}</a></div>
</template>
<style scoped>
.sunburst,.origin-stamp,.art-caption,.hero-art-footer,.heritage-ribbon{display:none}
.hero{align-items:center;gap:clamp(32px,5vw,80px);padding-top:56px;padding-bottom:64px}
.hero h1{font-size:clamp(42px,5.3vw,78px);line-height:1.06;letter-spacing:-.035em}
.hero-copy>p{font-size:17px;line-height:1.75;max-width:470px}
.hero-arch{border-radius:8px;transform:none;box-shadow:none}
.hero-arch img{border-radius:8px}
.drink-inset{transform:none;border-radius:4px;box-shadow:0 8px 24px #182d3b18}
.taste-card{transform:none!important;border-radius:4px}
.story-title h2,.menu-heading h2,.catering h2,.visit h2{font-size:clamp(36px,4vw,58px);line-height:1.12}
@media(max-width:700px){.hero{padding-top:32px;padding-bottom:40px;gap:36px}.hero h1{font-size:clamp(38px,9vw,58px)}.hero-copy>p{font-size:16px}.drink-inset{max-width:145px}.hero-art{margin-bottom:24px}}
</style>
<style>
:root{--muted:#5a625e;--surface:#ece7dc;--footer:#e8e0d0;--header:#f7f1e5f5;color:var(--ink);background:var(--ivory);color-scheme:light}
:root[data-theme="dark"]{--ink:#f0e8d8;--ivory:#15252d;--gold:#d3ac5d;--terra:#e49a7e;--line:#d6e4df30;--muted:#bdc8c7;--surface:#1b303a;--footer:#102029;--header:#15252df5;color-scheme:dark}
body{background:var(--ivory);color:var(--ink)}
:root .announcement{background:#132f43;color:#e4d8bc}:root .header{background:var(--header)}.theme-toggle{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:42px;height:42px;padding:0;border:1px solid var(--line);border-radius:50%;background:transparent;color:var(--ink)}.theme-toggle:hover{background:var(--surface)}
.header .brand img{width:112px;height:80px;object-fit:contain;mix-blend-mode:normal;background:transparent}.header .brand{gap:0}
:root .menu-section{background:var(--surface)}:root footer{background:var(--footer)}
[data-theme="dark"] .brand img{filter:brightness(0) saturate(100%) invert(93%) sepia(12%) saturate(330%) hue-rotate(350deg)}
[data-theme="dark"] .hero-copy>p,[data-theme="dark"] .hero-location,[data-theme="dark"] .section-index,[data-theme="dark"] .story-title>div>p,[data-theme="dark"] .photo-note,[data-theme="dark"] .menu-heading>p,[data-theme="dark"] .visit-layout>div>p,[data-theme="dark"] .visit-details p,[data-theme="dark"] .visit-details>div>span,[data-theme="dark"] .footer-bottom,[data-theme="dark"] .dish-copy>p,[data-theme="dark"] .dish-copy>small,[data-theme="dark"] .dish-card-top>span,[data-theme="dark"] .explorer-heading>span,[data-theme="dark"] .menu-bottom,[data-theme="dark"] .empty-result,[data-theme="dark"] .taste-card>div>span{color:var(--muted)}
[data-theme="dark"] .search,[data-theme="dark"] .category-picker select,[data-theme="dark"] .menu-item.dish-card,[data-theme="dark"] .menu-chat,[data-theme="dark"] .inquiry-card,[data-theme="dark"] .mobile-dock{background:var(--ivory);border-color:var(--line)}
[data-theme="dark"] .category-tabs button{color:var(--muted);border-color:var(--line)}[data-theme="dark"] .category-tabs button.active{background:var(--ink);color:var(--ivory)}
[data-theme="dark"] .button:hover,[data-theme="dark"] .menu-pagination button:hover{background:#d4c39f;color:#142632}
[data-theme="dark"] .text-link,[data-theme="dark"] .footer-call{border-color:var(--line)}
[data-theme="dark"] .catering{background:#0e1d25;color:#f0e8d8}[data-theme="dark"] .catering .section-index{color:var(--gold)}[data-theme="dark"] .button.ivory{background:#f0e8d8;color:#142632;border-color:#f0e8d8}
[data-theme="dark"] .inquiry-card form>p,[data-theme="dark"] .form-grid>label,[data-theme="dark"] .consent,[data-theme="dark"] .privacy-note,[data-theme="dark"] .chat-welcome,[data-theme="dark"] .chat-privacy{color:var(--muted)}
[data-theme="dark"] .form-grid input,[data-theme="dark"] .form-grid textarea{border-color:var(--line)}
[data-theme="dark"] .chat-message.user,[data-theme="dark"] .shortlist-toggle[aria-pressed=true]{background:#304854}
[data-theme="dark"] .chat-dish,[data-theme="dark"] .menu-chat>form input{background:#233944;color:var(--ink)}[data-theme="dark"] input::placeholder,[data-theme="dark"] textarea::placeholder{color:#aebdbf}
[data-theme="dark"] .interior figcaption{color:#f7f1e5}
@media(max-width:850px){.header .brand img{width:92px;height:65px}.header-actions{gap:8px}.header{gap:12px}}
@media(max-width:600px){.header .brand img{width:82px;height:59px}.theme-toggle{width:36px;height:36px}.mobile-menu{gap:12px}.header-actions{gap:5px}}
</style>
