import { fileURLToPath } from 'node:url';

import { defineConfig, globalIgnores } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';

import js from '@eslint/js';

const gitignore = fileURLToPath(new URL('.gitignore', import.meta.url));

const off = 0;
const warn = 1;
// const error = 2;

/**  @type {import('eslint').Linter.RulesRecord} */
const commonRules = {
  // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
  ...js.configs.recommended.rules,

  // https://eslint.org/docs/latest/rules/eqeqeq
  eqeqeq: [warn, 'smart'],

  // https://eslint.org/docs/latest/rules/new-cap
  'new-cap': off,

  // https://eslint.org/docs/latest/rules/no-async-promise-executor
  'no-async-promise-executor': off,

  // https://eslint.org/docs/latest/rules/no-caller
  'no-caller': warn,

  // https://eslint.org/docs/latest/rules/no-case-declarations
  // @eslint recommended
  'no-case-declarations': warn,

  // https://eslint.org/docs/latest/rules/no-cond-assign
  'no-cond-assign': [warn, 'except-parens'],

  // https://eslint.org/docs/latest/rules/no-console
  'no-console': off,

  // https://eslint.org/docs/latest/rules/no-constant-binary-expression
  // @eslint recommended
  'no-constant-binary-expression': warn,

  // https://eslint.org/docs/latest/rules/no-constant-condition
  // @eslint recommended
  'no-constant-condition': warn,

  // https://eslint.org/docs/latest/rules/no-dupe-class-members
  // @eslint recommended
  'no-dupe-class-members': warn,

  // https://eslint.org/docs/latest/rules/no-dupe-keys
  // @eslint recommended
  'no-dupe-keys': warn,

  // https://eslint.org/docs/latest/rules/no-empty
  'no-empty': [warn, { allowEmptyCatch: true }],

  // https://eslint.org/docs/latest/rules/no-fallthrough
  // @eslint recommended
  'no-fallthrough': warn,

  // https://eslint.org/docs/latest/rules/no-prototype-builtins
  'no-prototype-builtins': off,

  // https://eslint.org/docs/latest/rules/no-redeclare
  // @eslint recommended
  'no-redeclare': warn,

  // https://eslint.org/docs/latest/rules/no-shadow-restricted-names
  // @eslint recommended
  'no-shadow-restricted-names': warn,

  // https://eslint.org/docs/latest/rules/no-unexpected-multiline
  // @eslint recommended
  'no-unexpected-multiline': warn,

  // https://eslint.org/docs/latest/rules/no-undef
  'no-undef': off,

  // https://eslint.org/docs/latest/rules/no-unreachable
  // @eslint recommended
  'no-unreachable': warn,

  // https://eslint.org/docs/latest/rules/no-unused-private-class-members
  // @eslint recommended
  'no-unused-private-class-members': warn,

  // https://eslint.org/docs/latest/rules/no-unused-vars
  'no-unused-vars': [
    warn,
    {
      args: 'none'
    }
  ],

  // https://eslint.org/docs/latest/rules/no-use-before-define
  'no-use-before-define': [warn, { functions: false }],

  // https://eslint.org/docs/latest/rules/no-useless-escape
  // @eslint recommended
  'no-useless-escape': warn,
};

export default defineConfig([
  includeIgnoreFile(gitignore),
  globalIgnores([
    'node_modules/**',
    '.github/**',
    '.vscode/**',
    'contributor_docs/images/**',
    'dist/**',
    'lib/**',
    'src/core/reference.js',
    'src/type/lib/Typr.js',
    'test/**',
    'translations/**',
    'types/**',
    'utils/sample-linter.mjs'
  ]),
  {
    name: 'common p5 rules',
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      ...commonRules
    }
  },
  {
    name: 'p5 source files',
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024
    }
  },
]);