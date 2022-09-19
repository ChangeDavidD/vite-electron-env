<script setup lang="ts">
  import { ref } from 'vue';
  // @ts-ignore
  import invoke  from '../electron/preload';
  const viteToken = import.meta.env.VITE_RENDERER_TOKEN
  const nodeEnv =  ref("")
  const mainToken = ref("")
  invoke("get_node_env").then((res:any)=> { nodeEnv.value=res })
  invoke("get_main_token").then((res:any)=> { mainToken.value=res })
</script>

<template>
<h1>vite token: {{viteToken}}</h1>
<h1>process.node_env: {{nodeEnv}}</h1>
<h1>main token: {{mainToken}}</h1>
</template>