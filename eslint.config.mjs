import { fileURLToPath } from 'node:url';

import { defineConfig, globalIgnores } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';

import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

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
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      ecmaVersion: 2022
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/comma-dangle': ['error', 'never'],
      eqeqeq: ['error', 'smart'],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/max-len': [
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
      '@stylistic/no-trailing-spaces': ['error'],
      'no-undef': 0,
      'no-unused-vars': ['error', { args: 'none' }],
      'no-use-before-define': [2, { functions: false }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always']
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