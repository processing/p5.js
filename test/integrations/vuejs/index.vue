<script lang="ts" setup>
import { onMounted } from 'vue';
import p5 from 'p5';

onMounted(() => {
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(200, 200);
    };
    p.draw = () => {
      p.background(200);
      p.rect(50, 50, 100, 100);
    };
  };

  new p5(sketch);
});
</script>

<template>
  <div id="p5-canvas"></div>
</template>
