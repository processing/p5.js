<template>
  <div id="sketch"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import p5 from 'p5';

onMounted(() => {
  new p5(p => {
    p.setup = () => {
      p.createCanvas(100, 100);
    };
  }, document.getElementById('sketch')!);
});
</script>
