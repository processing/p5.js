import { defineWorkspace, configDefaults } from 'vitest/config';
import vitePluginString from 'vite-plugin-string';

const plugins = [
  vitePluginString({
    include: [
      'src/webgl/shaders/**/*'
    ]
  })
];

export default defineWorkspace([
  {
    plugins,
    publicDir: './test',
    bench: {
      name: 'bench',
      root: './',
      include: [
        './test/bench/**/*.js'
      ]
    },
    test: {
      name: 'unit',
      root: './',
      include: [
        './test/unit/**/*.js'
      ],
      exclude: [
        './test/unit/spec.js',
        './test/unit/assets/**/*',
        './test/types/**/*'
      ],
      // Increase timeout for visual and slow browser tests (was 1000ms)
      testTimeout: 20000,
      globals: true,
      browser: {
        enabled: true,
        name: 'chrome',
        provider: 'webdriverio',
        screenshotFailures: false
      },
      fakeTimers: {
        toFake: [...(configDefaults.fakeTimers.toFake ?? []), 'performance']
      }
    }
  }
]);