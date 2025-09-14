import { defineWorkspace } from 'vitest/config';
import vitePluginString from 'vite-plugin-string';
console.log(`CI: ${process.env.CI}`)

const plugins = [
  vitePluginString({
    include: [
      'src/webgl/shaders/**/*'
    ],
    compress: false,
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
      ],
    },
    test: {
      name: 'unit-tests-chrome',
      root: './',
      include: [
        './test/unit/**/*.js',
      ],
      exclude: [
        './test/unit/spec.js',
        './test/unit/assets/**/*',
        './test/unit/visual/visualTest.js',
        './test/unit/visual/cases/webgpu.js',
      ],
      testTimeout: 10000,
      globals: true,
      browser: {
        enabled: true,
        name: 'chrome',
        provider: 'webdriverio',
        screenshotFailures: false,
        providerOptions: {
          capabilities: process.env.CI ? {
            'goog:chromeOptions': {
              args: [
                '--no-sandbox',
                '--headless=new',
                '--use-angle=vulkan',
                '--enable-features=Vulkan',
                '--disable-vulkan-surface',
                '--enable-unsafe-webgpu',
              ]
            }
          } : undefined
        }
      }
    }
  },
  {
    plugins,
    publicDir: './test',
    bench: {
      name: 'bench',
      root: './',
      include: [
        './test/bench/**/*.js'
      ],
    },
    test: {
      name: 'unit-tests-firefox',
      root: './',
      include: [
        './test/unit/visual/cases/webgpu.js',
        // './test/unit/**/*.js',
      ],
      exclude: [
        './test/unit/spec.js',
        './test/unit/assets/**/*',
        './test/unit/visual/visualTest.js',
      ],
      testTimeout: 10000,
      globals: true,
      browser: {
        enabled: true,
        name: 'firefox',
        provider: 'webdriverio',
        screenshotFailures: false,
        providerOptions: {
          capabilities: process.env.CI ? {
            'moz:firefoxOptions': {
              args: [
                '--headless',
                '--enable-webgpu',
              ],
              prefs: {
                'dom.webgpu.enabled': true,
                'gfx.webgpu.force-enabled': true,
                'dom.webgpu.testing.assert-on-warnings': false,
                'gfx.webgpu.ignore-blocklist': true,
              }
            }
          } : undefined
        }
      }
    }
  }
]);