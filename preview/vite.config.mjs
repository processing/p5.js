import { defineConfig } from 'vitest/config';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  root: './',
  appType: 'mpa',
  plugins: [
    vitePluginString({
      include: [
        'src/webgl/shaders/**/*'
      ]
    })
  ]
});
