<script setup>
import {computed,onMounted,watch,nextTick,ref} from 'vue';
const props=defineProps({page:String,language:String});
const heading=ref(null);
const es=computed(()=>props.language==='es');
const tr=(a,b)=>es.value?a:b;
const title=computed(()=>props.page==='terms'?tr('Condiciones del Servicio','Terms of service'):tr('Política de privacidad','Privacy policy'));
const sections=computed(()=>props.page==='terms'?[
 [tr('Uso del sitio','Using this website'),tr('Este sitio de Cuenca Coffee Shop ofrece información sobre el restaurante, su carta y consultas para eventos. Utilízalo de forma lícita y no envíes contenido dañino, engañoso ni datos de terceros sin autorización.','This Cuenca Coffee Shop website provides restaurant information, its menu and event inquiries. Use it lawfully and do not submit harmful or misleading content or information about others without permission.')],
 [tr('Carta, precios y disponibilidad','Menu, prices and availability'),tr('Los platos, precios y disponibilidad pueden cambiar. Confirma con el restaurante los precios vigentes, horarios, ingredientes y alérgenos antes de hacer un pedido. Si tienes alergias, habla directamente con el personal.','Dishes, prices and availability may change. Confirm current prices, hours, ingredients and allergens with the restaurant before ordering. If you have allergies, speak directly with staff.')],
 [tr('Consultas para eventos','Event inquiries'),tr('Enviar el formulario registra una consulta y permite que te contactemos para coordinar detalles. No confirma una reserva, un pedido, una cotización ni un pago. Las condiciones de cada evento se acuerdan directamente con el restaurante.','Submitting the form records an inquiry and allows us to contact you about the details. It does not confirm a booking, order, quote or payment. Terms for each event are agreed directly with the restaurant.')],
 [tr('Asistente de inteligencia artificial','AI assistant'),tr('El asistente usa IA de OpenAI para sugerir platos y puede cometer errores. No confirma alérgenos, pedidos ni reservas. No incluyas información personal o sensible en tus mensajes.','The assistant uses OpenAI AI to suggest dishes and may make mistakes. It cannot confirm allergens, orders or bookings. Do not include personal or sensitive information in messages.')],
 [tr('Enlaces y disponibilidad del servicio','Links and service availability'),tr('Los enlaces a mapas y otros sitios llevan a servicios externos con sus propias condiciones. El sitio puede tener interrupciones o información desactualizada; llama al restaurante para confirmar cualquier detalle.','Links to maps and other websites lead to external services with their own terms. This website may experience interruptions or contain outdated information; call the restaurant to confirm details.')]
]:[
 [tr('Información que proporcionas','Information you provide'),tr('El formulario de eventos envía tu nombre, teléfono, correo opcional, fecha del evento, número de invitados, platos de interés, notas y consentimiento de contacto, junto con el idioma elegido. Usamos esta información para atender y coordinar tu consulta. Evita incluir datos sensibles en las notas.','The event form sends your name, phone number, optional email, event date, guest count, dishes of interest, notes and contact consent, along with your chosen language. We use this information to handle and coordinate your inquiry. Avoid including sensitive information in notes.')],
 [tr('Mensajes al asistente','Assistant messages'),tr('Al usar el asistente, se envían al servidor tu pregunta, hasta tres preguntas anteriores de la conversación y el idioma elegido. El servicio utiliza OpenAI para generar recomendaciones. No compartas datos personales o sensibles en este chat.','When you use the assistant, your question, up to three earlier questions from the conversation and your chosen language are sent to the server. The service uses OpenAI to generate recommendations. Do not share personal or sensitive information in this chat.')],
 [tr('Preferencias en tu dispositivo','Preferences on your device'),tr('El sitio guarda el idioma y el modo claro u oscuro en el almacenamiento local de tu navegador. Puedes borrarlos desde la configuración del navegador. Los platos que marcas como favoritos se mantienen en memoria durante la visita.','The website saves your language and light or dark mode in your browser’s local storage. You can clear them through your browser settings. Dishes you mark as favorites are held in memory during your visit.')],
 [tr('Servicios externos y datos técnicos','External services and technical data'),tr('El alojamiento y los servicios que procesan las solicitudes pueden recibir datos técnicos, como la dirección IP y la información del navegador, para servir y proteger el sitio. Al abrir Google Maps, Apple Maps u otros enlaces externos, se aplican las políticas de esos proveedores.','Hosting and services processing requests may receive technical data, such as IP addresses and browser information, to serve and protect the website. When you open Google Maps, Apple Maps or other external links, those providers’ policies apply.')],
 [tr('Consultas sobre tus datos','Questions about your information'),tr('Para preguntar por la información de tu consulta, solicitar su corrección o eliminación, o retirar tu autorización de contacto, comunícate con Cuenca Coffee Shop al teléfono indicado abajo o en el restaurante. La atención de la solicitud puede requerir verificar tu identidad.','To ask about your inquiry information, request its correction or deletion, or withdraw your contact permission, contact Cuenca Coffee Shop at the number below or at the restaurant. Handling your request may require verifying your identity.')]
]);
async function focusTitle(){await nextTick();heading.value?.focus({preventScroll:true});heading.value?.scrollIntoView({block:'start'});}
onMounted(focusTitle);
watch(()=>props.page,focusTitle);
</script>
<template>
<main class="legal-page section">
 <a class="text-link" href="#home">← {{tr('Volver a Cuenca','Back to Cuenca')}}</a>
 <h1 ref="heading" tabindex="-1">{{title}}</h1>
 <p class="legal-updated">{{tr('Última actualización: 2 de noviembre de 2026','Last updated: November 2, 2026')}}</p>
 <section v-for="[label,text] in sections" :key="label"><h2>{{label}}</h2><p>{{text}}</p></section>
 <section><h2>{{tr('Contacto','Contact')}}</h2><p>Cuenca Coffee Shop<br>9529 Jamaica Ave., Woodhaven, NY 11421<br><a href="tel:+17188474697">718.847.4697</a></p></section>
 <p>{{tr('Las actualizaciones de este documento se publicarán en esta página con su fecha de revisión.','Updates to this document will be published on this page with their revision date.')}}</p>
</main>
</template>
<style>
.legal-page{max-width:960px;margin:auto;min-height:65vh}.legal-page h1{font-size:clamp(34px,6vw,62px);margin-bottom:18px;scroll-margin-top:120px}.legal-page h2{font-size:25px;letter-spacing:normal;margin:32px 0 12px}.legal-page p{font-size:16px;line-height:1.85;color:var(--muted)}.legal-page .legal-updated{font-size:13px}.legal-page p a{text-decoration:underline}
</style>
