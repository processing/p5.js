import { fileURLToPath } from 'node:url';

import { defineConfig, globalIgnores } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';
// import { getJsdocProcessorPlugin } from 'eslint-plugin-jsdoc/getJsdocProcessorPlugin.js';

import globals from 'globals';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import markdown from '@eslint/markdown';
import stylistic from '@stylistic/eslint-plugin';

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

  // https://eslint.style/rules/js/arrow-parens#arrow-parens
  '@stylistic/arrow-parens': [warn, 'as-needed'],

  // https://eslint.style/rules/default/comma-dangle
  '@stylistic/comma-dangle': [warn, 'never'],

  // https://eslint.style/rules/js/indent#indent
  '@stylistic/indent': [warn, 2, { SwitchCase: 1 }],

  // https://eslint.style/rules/js/linebreak-style#linebreak-style
  '@stylistic/linebreak-style': [warn, 'unix'],

  // https://eslint.style/rules/js/max-len#max-len
  '@stylistic/max-len': [
    warn,
    {
      code: 80,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }
  ],

  // https://eslint.style/rules/js/no-trailing-spaces#no-trailing-spaces
  '@stylistic/no-trailing-spaces': warn,

  // https://eslint.style/rules/js/object-curly-spacing#object-curly-spacing
  '@stylistic/object-curly-spacing': [warn, 'always'],

  // https://eslint.style/rules/js/quotes#quotes
  '@stylistic/quotes': [warn, 'single', { avoidEscape: true }],

  // https://eslint.style/rules/js/semi#semi
  '@stylistic/semi': [warn, 'always']
};

/**  @type {import('eslint').Linter.RulesRecord} */
const jsdocRules = {
  // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/docs/rules/check-alignment.md
  'jsdoc/check-alignment': warn,

  // @todo
  // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/docs/rules/check-line-alignment.md#readme
  // 'jsdoc/check-line-alignment': [warn, 'always'],

  // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/docs/rules/no-multi-asterisks.md#readme
  'jsdoc/no-multi-asterisks': [warn, { allowWhitespace: true }],

  // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/docs/rules/require-asterisk-prefix.md#readme
  'jsdoc/require-asterisk-prefix': warn
};

export default defineConfig([
  includeIgnoreFile(gitignore),
  globalIgnores([
    'node_modules/**',
    '.github/**',
    '.vscode/**',
    'contributor_docs/archive/**',
    'contributor_docs/images/**',
    'dist/**',
    'lib/**',
    'src/core/reference.js',
    'src/type/lib/Typr.js',
    'test/**/*',
    '!test/unit/',
    '!test/unit/**/*',
    'translations/**',
    'types/**',
    'utils/sample-linter.mjs'
  ]),
  {
    name: 'common p5 rules',
    files: ['**/*.js', '**/*.mjs'],
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      ...commonRules
    }
  },
  {
    name: 'p5 source files',
    files: ['src/**/*.js'],
    plugins: {
      jsdoc
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        ...globals.es2024
      }
    },
    rules: {
      ...jsdocRules
    }
  },
  // @todo no errors are reported in IDE/CLI
  // {
  //   name: 'jsdoc example processor',
  //   files: ['src/**/*.js'],
  //   plugins: {
  //     examples: getJsdocProcessorPlugin({
  //       // allowedLanguagesToProcess: ['js', 'javascript'],
  //       // @todo
  //       // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/docs/rules/check-examples.md#examplecoderegex-and-rejectexamplecoderegex
  //       // without the regex jsdoc fails to parse the examples
  //       // the processor expects js but gets html
  //       // "343:6   error    @example error: Fatal: Parsing error: Unexpected token <"
  //       exampleCodeRegex: '^<code>.*</code>$'
  //     })
  //   },
  //   processor: 'examples/examples'
  // },
  // {
  //   // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/docs/processors.md#processors
  //   // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/src/index.js#L414
  //   name: 'jsdoc example rules',
  //   files: ['src/**/*.md/*.js'],
  //   rules: {
  //     ...commonRules,
  //     'no-undef': off
  //   }
  // },
  {
    name: 'p5 node env',
    files: [
      'test/**/*.js',
      'utils/**/*.js',
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
      'test/unit/**/*.js'
    ],
    languageOptions: {
      globals: {
        ...globals.vitest,
        // @todo test/js/helpers.js
        'assert': false,
        'expect': false
      }
    }
  },
  // @todo adjust globally ignored files
  // @todo depends on globals.d.ts
  // {
  //   name: 'p5 manuals test examples',
  //   files: [
  //     'test/manual-test-examples/**/*.js'
  //   ],
  //   languageOptions: {
  //     globals: {
  //       ...globals.browser,
  //       ...globals.es2024
  //     }
  //   },
  //   rules: {
  //     'no-undef': off,
  //     'no-unused-vars': off
  //   }
  // },
  {
    name: 'p5 contributor docs',
    files: ['**/*.md'],
    plugins: {
      markdown
    },
    language: 'markdown/commonmark',
    rules: {
      'margkdown/fenced-code-language': off,
      'markdown/heading-invrement': off,
      'markdown/no-duplicate-definitions': warn,
      // 'markdown/no-duplicate-headings': ["error", { checkSiblingsOnly: true }], // @todo waiting for @eslint/markdown@6.6.0
      'markdown/no-empty-definitions': warn,
      'markdown/no-empty-images': warn,
      'markdown/no-empty-links': warn,
      'markdown/no-html': off,
      'markdown/no-invalid-label-refs': off,
      'markdown/no-missing-atx-heading-space': warn,
      'markdown/no-missing-label-refs': off, // @todo
      'markdown/no-multiple-h1': off,
      'markdown/require-alt-text': warn,
      'markdown/table-column-count': warn
    }
  }
]);