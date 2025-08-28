import { readdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { rollup } from 'rollup';

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';
import pkg from './package.json' with { type: 'json' };
import terser from '@rollup/plugin-terser';

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

const modules =
  readdirSync('./src', { withFileTypes: true })
    .filter(dirent => {
      return dirent.isDirectory() &&
      !['color'].includes(dirent.name);
    })
    .map(dirent => dirent.name);

const builds = modules.map(mod => {
  const inputOptions = {
    input: `src/${mod}/index.js`,
    plugins
  };

  const outputOptions = [
    {
      file: `./lib/p5.${mod}.js`,
      format: 'iife',
      name: mod === 'core' ? 'p5' : undefined
    },
    {
      file: `./lib/p5.${mod}.min.js`,
      format: 'iife',
      name: mod === 'core' ? 'p5' : undefined,
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
        })
      ]
    }
  ];

  return build(inputOptions, outputOptions);
});

await Promise.all(builds);

async function build(inputOptions, outputOptionsList){
  let bundle;
  try {
    bundle = await rollup(inputOptions);

    for(const outputOptions of outputOptionsList){
      const { output } = await bundle.generate(outputOptions);
      await writeFile(outputOptions.file, output[0].code);
    }
  } catch(err) {
    console.error(err);
  }

  if(bundle){
    await bundle.close();
  }
}
