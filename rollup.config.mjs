import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };
import dayjs from 'dayjs';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';

const plugins = [
  commonjs(),
  nodeResolve(),
  json(),
  string({
    include: 'src/webgl/shaders/**/*'
  }),
  replace({
    values: {
      'VERSION_WILL_BE_REPLACED_BY_BUILD': pkg.version
    },
    preventAssignment: true
  })
];
const banner = `/*! p5.js v${pkg.version} ${dayjs().format('MMMM D, YYYY')} */`;
const bundleSize = (name, sourcemap) => {
  return visualizer({
    filename: `analyzer/${name}.html`,
    gzipSize: true,
    brotliSize: true,
    sourcemap
  });
};

const modules = ['math'];
const generateModuleBuild = () => {
  return modules.map((module) => {
    return {
      input: `src/${module}/index.js`,
      output: [
        {
          file: `./lib/p5.${module}.js`,
          format: 'iife',
          plugins: [
            bundleSize(`p5.${module}.js`)
          ]
        },
        {
          file: `./lib/p5.${module}.min.js`,
          format: 'iife',
          sourcemap: 'hidden',
          plugins: [
            terser({
              compress: {
                global_defs: {
                  IS_MINIFIED: true
                }
              },
              format: {
                comments: false
              }
            }),
            bundleSize(`p5.${module}.min.js`)
          ]
        },
        {
          file: `./lib/p5.${module}.esm.js`,
          format: 'esm',
          plugins: [
            bundleSize(`p5.${module}.esm.js`)
          ]
        }
      ],
      external: ['../core/main'],
      plugins: [
        ...plugins
      ]
    }
  });
};

export default [
  {
    input: 'src/app.js',
    output: [
      {
        file: './lib/p5.js',
        format: 'iife',
        name: 'p5',
        banner,
        plugins: [
          bundleSize('p5.js')
        ]
      },
      {
        file: './lib/p5.esm.js',
        format: 'esm',
        banner,
        plugins: [
          bundleSize('p5.esm.js')
        ]
      }
    ],
    treeshake: {
      preset: 'smallest'
    },
    plugins: [
      ...plugins
    ]
  },
  //// Minified build ////
  {
    input: 'src/app.js',
    output: [
      {
        file: './lib/p5.min.js',
        format: 'iife',
        name: 'p5',
        banner,
        sourcemap: 'hidden',
        plugins: [
          terser({
            compress: {
              global_defs: {
                IS_MINIFIED: true
              }
            },
            format: {
              comments: false
            }
          }),
          bundleSize('p5.min.js', true)
        ]
      }
    ],
    treeshake: {
      preset: 'smallest'
    },
    plugins: [
      alias({
        entries: [
          { find: './core/friendly_errors', replacement: './core/noop' }
        ]
      }),
      ...plugins
    ]
  }
  // NOTE: comment to NOT build standalone math module
  // ...generateModuleBuild()
];
