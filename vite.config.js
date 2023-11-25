import { defineConfig } from 'vitest/config';
import glsl from 'vite-plugin-glsl';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { string } from 'rollup-plugin-string';
import swc from 'unplugin-swc';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };
import dayjs from 'dayjs';

export default defineConfig({
  build: {
    outDir: './lib',
    emptyOutDir: false,
    minify: false,
    esbuild: false,
    appType: 'custom',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: './src/app.js',
      name: 'p5',
      formats: ['iife'],
      // the proper extensions will be added
      fileName: () => 'p5.vite.js'
    },
    rollupOptions: {
      input: './src/app.js',
      output: [
        {
          dir: './lib',
          entryFileNames: 'p5.vite.js',
          format: 'iife',
          name: 'p5',
          banner: `/*! p5.js v${pkg.version} ${dayjs().format('MMMM D, YYYY')} */`
        },
        {
          dir: './lib',
          entryFileNames: 'p5.vite.min.js',
          format: 'iife',
          name: 'p5',
          banner: `/*! p5.js v${pkg.version} ${dayjs().format('MMMM D, YYYY')} */`,
          plugins: [terser({
            compress: {
              global_defs: {
                IS_MINIFIED: true
              }
            },
            format: {
              comments: false
            }
          })]
        }
      ],
      plugins: [
        commonjs(),
        nodeResolve(),
        string({
          include: 'src/webgl/shaders/**/*'
        }),
        swc.rollup()
      ]
    }
  },
  test: {
    include: [
      './test/unit/**/*.js'
    ],
    exclude: [
      './test/unit/spec.js',
      './test/unit/assets/*'
    ],
    globals: true,
    browser: {
      enabled: true,
      // headless: true,
      name: 'chrome'
    }
  },
  plugins: [glsl()]
});
