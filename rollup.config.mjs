import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' with { type: 'json' };
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync } from 'node:fs';

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
const banner = `/*! p5.js v${pkg.version} ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())} */`;
const bundleSize = (name, sourcemap) => {
  return visualizer({
    filename: `analyzer/${name}.html`,
    gzipSize: true,
    brotliSize: true,
    sourcemap
  });
};

const modules = ['webgpu']; // TODO: also generate math build
const generateModuleBuild = () => {
  return modules.map(module => {
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
    };
  });
};

rmSync('./dist', {
  force: true,
  recursive: true
});

export default [
  //// Library builds (IIFE and ESM) ////
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
      },
      {
        file: './lib/p5.esm.min.js',
        format: 'esm',
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
          bundleSize('p5.esm.min.js', true)
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
  },
  //// ESM source build ////
  {
    input: Object.fromEntries(
      globSync('src/**/*.js').map(file => [
        // This removes `src/` as well as the file extension from each
        // file, so e.g. src/nested/foo.js becomes nested/foo
        path.relative(
          'src',
          file.slice(0, file.length - path.extname(file).length)
        ),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
      ])
    ),
    output: {
      format: 'es',
      dir: 'dist'
    },
    external: /node_modules\/(?!gifenc)/,
    plugins
  },
  ...generateModuleBuild()
];
