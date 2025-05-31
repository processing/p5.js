import { fileURLToPath } from 'node:url';

import { defineConfig, globalIgnores } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';

import globals from 'globals';
import js from '@eslint/js';

const gitignore = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignore),
  globalIgnores([
    'node_modules/**',
    'contributor_docs/**',
    'lib/**'
  ]),
  {
    name: 'eslint recommended',
    ...js.configs.recommended
  },
  {
    name: 'common rules',
    ignores: [
      'src/core/reference.js'
    ],
    // plugins: {

    // },
    languageOptions: {
      ecmaVersion: 2022
    },
    rules: {
      'arrow-parens': ['error', 'as-needed'],
      'comma-dangle': ['error', 'never'],
      eqeqeq: ['error', 'smart'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true
        }
      ],
      'new-cap': 0,
      'no-async-promise-executor': 'off',
      'no-caller': 2,
      'no-cond-assign': [2, 'except-parens'],
      'no-console': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-prototype-builtins': 'off',
      'no-trailing-spaces': ['error'],
      'no-undef': 0,
      'no-unused-vars': ['error', { args: 'none' }],
      'no-use-before-define': [2, { functions: false }],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always']
    }
  },
  {
    name: 'p5 source files',
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022
      }
    }
  },
  {
    name: 'p5 node env',
    files: [
      'test/**/*',
      'utils/**/*',
      '**/*.config.mjs',
      'vitest.workspace.mjs'
    ],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin
      }
    }
  },
  {
    name: 'p5 test files',
    files: [
      'test/**/*'
    ],
    languageOptions: {
      globals: {
        // legacy ./test/eslintrc.json
        ...globals.mocha,
        'assert': false,
        'expect': false,
        'promisedSketch': true,
        'testSketchWithPromise': true,
        'parallelSketches': true,
        'createP5Iframe': true,
        'P5_SCRIPT_URL': true,
        'P5_SCRIPT_TAG': true
      }
    }
  }
]);