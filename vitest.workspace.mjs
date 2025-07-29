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
      name: 'unit',
      root: './',
      include: [
        './test/unit/**/*.js',
      ],
      exclude: [
        './test/unit/spec.js',
        './test/unit/assets/**/*',
        './test/unit/visual/visualTest.js',
      ],
      testTimeout: 1000,
      globals: true,
      browser: {
        enabled: true,
        name: 'chrome',
        provider: 'webdriverio',
        screenshotFailures: false,
        providerOptions: {
          capabilities: process.env.CI ? {
            'goog:chromeOptions': {
              binary: '/usr/bin/google-chrome',
              args: [
                '--enable-unsafe-webgpu',
                '--disable-dawn-features=disallow_unsafe_apis',
                '--use-angle=default',
                '--enable-features=Vulkan',
                '--no-sandbox',
                '--disable-dev-shm-usage',
              ]
            }
          } : undefined
        }
      }
    }
  }
]);