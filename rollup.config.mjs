import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import swc from 'unplugin-swc';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/app.js',
  output: {
    file: './lib/p5.rollup.js',
    format: 'iife',
    name: 'p5'
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    json(),
    string({
      include: 'src/webgl/shaders/**/*'
    }),
    swc.rollup()
  ]
};
