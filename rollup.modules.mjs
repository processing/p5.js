import { readdirSync, mkdirSync, rmSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';
import pkg from './package.json' with { type: 'json' };
import terser from '@rollup/plugin-terser';

const coreModules = ['accessibility', 'color', 'friendly_errors'];
const modules =
  readdirSync('./src', { withFileTypes: true })
    .filter(dirent => {
      return dirent.isDirectory() &&
      !coreModules.includes(dirent.name);
    })
    .map(dirent => dirent.name);

await buildModules(modules);

// Build modules given by array of module name strings
export async function buildModules(modules){
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

  const builds = modules.map(mod => {
    const inputOptions = {
      input: `src/${mod}/index.js`,
      plugins
    };

    const outputOptions = [
      {
        file: `./lib/modules/p5.${mod}.js`,
        format: 'iife',
        name: mod === 'core' ? 'p5' : undefined
      },
      {
        file: `./lib/modules/p5.${mod}.min.js`,
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

    rmSync('./lib/modules', { recursive: true, force: true });
    mkdirSync('./lib/modules', { recursive: true });
    return build(inputOptions, outputOptions);
  });

  await Promise.all(builds);
}

// Rollup build simple pipeline
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
