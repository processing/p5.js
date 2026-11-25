import { defineConfig } from 'vite';
import { string } from 'rollup-plugin-string';

export default defineConfig({
  root: './',
	appType: 'mpa',
  plugins: [
    string({
      include: [
        'src/webgl/shaders/**/*'
      ],
      compress: false
    })
  ]
});
