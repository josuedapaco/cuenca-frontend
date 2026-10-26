<script setup>
defineProps({name:String,filled:Boolean});
const paths={search:'M21 21l-5-5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15',heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8',spark:'M12 2v20M2 12h20M5 5l14 14M5 19 19 5',left:'M19 12H5m7-7-7 7 7 7',right:'M5 12h14m-7-7 7 7-7 7',up:'M12 19V5m-7 7 7-7 7 7',external:'M5 19 19 5M5 5h14v14',close:'M6 6l12 12M6 18 18 6',plus:'M5 12h14M12 5v14',minus:'M5 12h14'};
</script>
<template><svg class="ui-icon" viewBox="0 0 24 24" :fill="filled?'currentColor':'none'" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path :d="paths[name]"/></svg></template>
<style scoped>.ui-icon{display:inline-block;width:1.2em;height:1.2em;flex-shrink:0;vertical-align:middle}</style>
