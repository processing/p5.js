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
    'lib/**',
    'src/core/reference.js',
    'src/type/lib/Typr.js', // wat?
    'utils/sample-linter.mjs'
  ]),
  {
    name: 'eslint recommended',
    ...js.configs.recommended
  },
  {
    name: 'common rules',
    plugins: {
      '@stylistic': stylistic
    },
    linterOptions: {
      reportUnusedDisableDirectives: false
    },
    rules: {
      // '@stylistic/arrow-parens': ['error', 'as-needed'],
      // '@stylistic/comma-dangle': ['error', 'never'],
      // eqeqeq: ['error', 'smart'],
      eqeqeq: 0,
      // '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      // '@stylistic/linebreak-style': ['error', 'unix'],
      // '@stylistic/max-len': [
      //   'error',
      //   {
      //     code: 80,
      //     ignoreComments: true,
      //     ignoreStrings: true,
      //     ignoreTemplateLiterals: true,
      //     ignoreRegExpLiterals: true
      //   }
      // ],
      'new-cap': 0,
      'no-async-promise-executor': 0,
      // 'no-caller': 2,
      'no-caller': 0,
      'no-case-declarations': 0, // @eslint recommended
      // 'no-cond-assign': [2, 'except-parens'],
      'no-cond-assign': 0,
      'no-console': 0,
      'no-constant-binary-expression': 0, // @eslint recommended
      'no-constant-condition': 0, // @eslint recommended
      'no-dupe-class-members': 0, // @eslint recommended
      'no-dupe-keys': 0, // @eslint recommended
      // 'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty': 0,
      'no-fallthrough': 0, // @eslint recommended
      'no-prototype-builtins': 0,
      'no-redeclare': 0, // @eslint recommended
      'no-shadow-restricted-names': 0, // @eslint recommended
      // '@stylistic/no-trailing-spaces': ['error'],
      'no-unexpected-multiline': 0, // @eslint recommended
      'no-undef': 0,
      'no-unreachable': 0, // @eslint recommended
      'no-unused-private-class-members': 0, // @eslint recommended
      // 'no-unused-vars': ['error', { args: 'none' }],
      'no-unused-vars': 0,
      // 'no-use-before-define': [2, { functions: false }],
      'no-use-before-define': 0,
      'no-useless-escape': 0, // @eslint recommended
      // '@stylistic/object-curly-spacing': ['error', 'always'],
      // '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      // '@stylistic/semi': ['error', 'always']
    }
  },
  {
    name: 'p5 source files',
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
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
      ecmaVersion: 'latest',
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