<script setup>
import {ref,onMounted,onUnmounted} from 'vue';
const props=defineProps({progress:{type:Number,default:0}});
const host=ref(null),ready=ref(false);
let stopped=false,renderer,scene,camera,resizeObserver,visibilityObserver,model,visible=false;
onMounted(async()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 try {
  const T=await import('three');
  if(stopped)return;
  renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  renderer.setClearColor(0x132f43,0);host.value.appendChild(renderer.domElement);
  scene=new T.Scene();camera=new T.PerspectiveCamera(33,1,.1,100);camera.position.set(7,6.4,9);camera.lookAt(0,.8,0);
  scene.add(new T.HemisphereLight(0xfff4db,0x395763,3.5));
  const sunLight=new T.DirectionalLight(0xffe0a1,4);sunLight.position.set(3,8,4);scene.add(sunLight);
  model=new T.Group();scene.add(model);
  const mat=(color,roughness=.75)=>new T.MeshStandardMaterial({color,roughness});
  const ivory=mat(0xf1ddba),blue=mat(0x288391,.3),gold=mat(0xc9973b,.35),dark=mat(0x17384b),terra=mat(0xa84d38);
  const mesh=(geo,material,x,y,z,group=model)=>{const m=new T.Mesh(geo,material);m.position.set(x,y,z);group.add(m);return m;};
  mesh(new T.CylinderGeometry(3.35,3.7,.34,64),dark,0,-.45,0);
  mesh(new T.CylinderGeometry(3.36,3.36,.045,64),gold,0,-.26,0);
  mesh(new T.BoxGeometry(3.9,1.35,2.3),ivory,0,.45,0);
  mesh(new T.BoxGeometry(4.12,.14,2.5),gold,0,1.17,0);
  for(const x of [-1.32,0,1.32]){
    const h=x===0?1.65:1.4;
    mesh(new T.CylinderGeometry(.62,.64,h,16),ivory,x,1.1+h/2,0);
    mesh(new T.CylinderGeometry(.72,.72,.12,32),gold,x,1.1+h,0);
    mesh(new T.SphereGeometry(.69,32,24,0,Math.PI*2,0,Math.PI/2),blue,x,1.1+h+.06,0);
    const finial=mesh(new T.CylinderGeometry(.025,.025,.34,8),gold,x,1.1+h+.9,0);
    mesh(new T.BoxGeometry(.22,.025,.025),gold,x,finial.position.y+.06,0);
    for(let n=0;n<8;n++){
      const a=n/8*Math.PI*2;
      mesh(new T.BoxGeometry(.17,.48,.04),dark,x+Math.sin(a)*.63,1.1+h*.65,Math.cos(a)*.63);
    }
  }
  for(const x of [-1.3,0,1.3]){
   mesh(new T.BoxGeometry(.45,.84,.045),dark,x,.25,1.17);
   mesh(new T.SphereGeometry(.225,20,10,0,Math.PI*2,0,Math.PI/2),dark,x,.68,1.18).rotation.x=Math.PI/2;
  }
  for(const x of [-2.5,2.5]){
   mesh(new T.BoxGeometry(.8,.75,1.5),terra,x,.13,-.2);
   mesh(new T.ConeGeometry(.78,.6,4),ivory,x,.78,-.2).rotation.y=Math.PI/4;
  }
  const sun=mesh(new T.SphereGeometry(.75,32,24),gold,2.1,3.3,-1.6);
  const orbit=mesh(new T.TorusGeometry(3.7,.015,8,100),gold,0,.5,0);orbit.rotation.x=Math.PI/2.6;
  const resize=()=>{if(!host.value)return;const {width,height}=host.value.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();};
  resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host.value);resize();
  visibilityObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{rootMargin:'80px'});visibilityObserver.observe(host.value);
  renderer.setAnimationLoop((time)=>{
    if(stopped||!visible||document.hidden)return;
    model.rotation.y=reduced?-.25:-.45+props.progress*Math.PI*1.4;
    model.position.y=reduced?0:Math.sin(time*.0005)*.06;
    renderer.render(scene,camera);
    ready.value=true;
  });
 }catch{ready.value=false;renderer?.dispose();}
});
onUnmounted(()=>{
 stopped=true;resizeObserver?.disconnect();visibilityObserver?.disconnect();
 renderer?.setAnimationLoop(null);
 scene?.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});
 renderer?.dispose();
});
</script>
<template><div class="cuenca-scene" ref="host" role="img" aria-label="Interpretación tridimensional de las cúpulas de Cuenca"><img v-if="!ready" class="scene-fallback" src="/images/logo.webp" alt="Cuenca Coffee Shop"></div></template>
<style scoped>.cuenca-scene{width:100%;height:330px;position:relative}.cuenca-scene :deep(canvas){display:block;width:100%;height:100%;position:absolute;inset:0}.scene-fallback{width:180px;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%}@media(max-width:850px){.cuenca-scene{height:210px}}</style>
