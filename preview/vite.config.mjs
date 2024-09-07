import { defineConfig } from 'vitest/config';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  root: './',
  plugins: [
    vitePluginString({
      include: [
        'src/webgl/shaders/**/*'
      ]
    })
  ]
});
