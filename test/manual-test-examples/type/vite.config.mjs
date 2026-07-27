import { defineConfig } from 'vitest/config';
import { string } from 'rollup-plugin-string';

export default defineConfig({
  root: './',
  plugins: [
    string({
      include: [
        'src/webgl/shaders/**/*'
      ]
    })
  ]
});
