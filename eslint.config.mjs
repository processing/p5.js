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
const error = 2;

/**  @type {import('eslint').Linter.RulesRecord} */
const commonRules = {
  // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
  ...js.configs.recommended.rules,

  // https://eslint.org/docs/latest/rules/eqeqeq
  eqeqeq: [error, 'smart'],

  // https://eslint.org/docs/latest/rules/new-cap
  'new-cap': off,

  // https://eslint.org/docs/latest/rules/no-async-promise-executor
  'no-async-promise-executor': off,

  // https://eslint.org/docs/latest/rules/no-caller
  'no-caller': error,

  // https://eslint.org/docs/latest/rules/no-cond-assign
  'no-cond-assign': [error, 'except-parens'],

  // https://eslint.org/docs/latest/rules/no-console
  'no-console': off,

  // https://eslint.org/docs/latest/rules/no-empty
  'no-empty': [error, { allowEmptyCatch: true }],

  // https://eslint.org/docs/latest/rules/no-prototype-builtins
  'no-prototype-builtins': off,

  // https://eslint.org/docs/latest/rules/no-undef
  'no-undef': off,

  // https://eslint.org/docs/latest/rules/no-unused-vars
  'no-unused-vars': [
    error,
    {
      args: 'none'
    }
  ],

  // https://eslint.org/docs/latest/rules/no-use-before-define
  'no-use-before-define': [error, { functions: false }],

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

// https://github.com/gajus/eslint-plugin-jsdoc?tab=readme-ov-file#rules
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

// https://github.com/eslint/markdown?tab=readme-ov-file#rules
/**  @type {import('eslint').Linter.RulesRecord} */
const markdownRules = {
  'markdown/fenced-code-language': off,
  'markdown/heading-increment': off,
  'markdown/no-duplicate-definitions': warn,
  'markdown/no-duplicate-headings': [warn, { checkSiblingsOnly: true }],
  'markdown/no-empty-definitions': warn,
  'markdown/no-empty-images': warn,
  'markdown/no-empty-links': warn,
  'markdown/no-html': off,
  'markdown/no-invalid-label-refs': off,
  'markdown/no-missing-atx-heading-space': warn,
  'markdown/no-missing-label-refs': off, // @todo
  'markdown/no-missing-link-fragments': off,
  'markdown/no-multiple-h1': off,
  'markdown/require-alt-text': warn,
  'markdown/table-column-count': warn
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
    name: 'p5/common-rules',
    files: ['**/*.js', '**/*.mjs'],
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      ...commonRules
    }
  },
  {
    name: 'p5/source-files',
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
  // https://github.com/processing/p5.js/actions/runs/15584716142/job/43887979759#step:5:5160
  // @todo failed as **expected** due to `Parsing Error`s
  // * src/io/p5.Table.js - 256:6
  // * src/math/Matrices/Matrix.js - 532:12
  // @todo failed **unexpected** due to `Parsing Error`
  // * src/webgl/p5.Geometry.js - 49:42
  // {
  //   name: 'p5/jsdoc-examples-processor',
  //   files: ['src/**/*.js'],
  //   plugins: {
  //     examples: getJsdocProcessorPlugin({
  //       allowedLanguagesToProcess: ['js', 'javascript'],
  //       exampleCodeRegex: /<code>\s([\s\S]*?)<\/code>/
  //     })
  //   },
  //   processor: 'examples/examples'
  // },
  // {
  //   // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/docs/processors.md#processors
  //   // https://github.com/gajus/eslint-plugin-jsdoc/blob/99cb131ee40fa10f943aadfd73a6d18da082882f/src/index.js#L414
  //   name: 'p5/jsdoc-example-rules',
  //   files: ['src/**/*.md/*.js'],
  //   rules: {
  //     ...commonRules,
  //     'no-undef': off,
  //     'no-unused-vars': off
  //   }
  // },
  {
    name: 'p5/node-env',
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
    name: 'p5/test-files',
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
  //   name: 'p5/manual-test-examples',
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
    // https://github.com/eslint/markdown?tab=readme-ov-file#rules
    name: 'p5/contributor-docs',
    files: ['**/*.md'],
    plugins: {
      markdown
    },
    language: 'markdown/commonmark',
    rules: markdownRules
  },
  // https://github.com/eslint/markdown?tab=readme-ov-file#file-name-details
  // @todo
  // works out of the box but results in some `Parsing error`s
  // which will make github workflows & actions fail e.g.
  // * contributor_docs/fes_contribution_guide.md 354:1  error  Parsing error: Unexpected character '🌸'
  // * contributor_docs/zh-Hans/unit_testing.md 35:1  error  Parsing error: Unexpected token
  // * rfc_p5js_2.md 205:50  error  Parsing error: Binding arguments in strict mode
  ...markdown.configs.processor
]);