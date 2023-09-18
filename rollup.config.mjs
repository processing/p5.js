import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';

export default {
  input: 'src/app.js',
  output: {
    file: './lib/p5.rollup.js',
    format: 'iife',
    name: 'p5'
  },
  plugins: [
    nodeResolve(),
    json(),
    string({
      include: 'src/webgl/shaders/**/*'
    })
  ]
};
