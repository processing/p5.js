import { defineConfig } from 'rolldown';
import { replacePlugin } from 'rolldown/plugins';
import { string } from 'rollup-plugin-string';
import pkg from './package.json' with { type: 'json' };
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import alias from '@rollup/plugin-alias';
// import { bundleAnalyzerPlugin } from 'rolldown/experimental';

const plugins = [
  string({
    include: 'src/webgl/shaders/**/*'
  }),
  replacePlugin(
    {
      'VERSION_WILL_BE_REPLACED_BY_BUILD': pkg.version
    },
    {
      preventAssignment: true
    }
  )
];
const banner = `/*! p5.js v${pkg.version} ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())} */`;
export default defineConfig([
  {
    input: 'src/app.js',
    output: [
      {
        file: './lib/p5.js',
        format: 'iife',
        name: 'p5',
        banner
      },
      {
        file: './lib/p5.esm.js',
        format: 'esm',
        banner
      },
      {
        file: './lib/p5.esm.min.js',
        format: 'esm',
        banner,
        minify: true
      }
    ],
    plugins
  },
  {
    input: 'src/app.js',
    output: {
      file: './lib/p5.min.js',
      format: 'iife',
      name: 'p5',
      banner,
      minify: true
    },
    plugins: [
      ...plugins,
      alias({
        entries: [
          { find: './core/friendly_errors', replacement: './core/noop' }
        ]
      }),
      replacePlugin({
        IS_MINIFIED: true
      }),
      // bundleAnalyzerPlugin({
      //   format: 'md'
      // })
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
  }
]);
