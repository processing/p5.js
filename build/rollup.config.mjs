import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/app.js', // or whatever path you found in Step 1
  output: {
    file: 'dist/app.js', // This is the generated ESM output
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })
  ]
};
