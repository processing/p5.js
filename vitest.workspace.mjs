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
      name: 'unit-tests',
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
                '--enable-unsafe-webgpu',
                '--use-vulkan=swiftshader',
                '--use-webgpu-adapter=swiftshader',
                '--use-angle=vulkan',
                '--no-sandbox',
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
      name: 'unit-tests-webgpu',
      root: './',
      include: [
        // './test/unit/**/*.js',
        './test/unit/visual/cases/webgpu.js',
      ],
      exclude: [
        './test/unit/spec.js',
        './test/unit/assets/**/*',
        './test/unit/visual/visualTest.js',
        // './test/unit/visual/cases/webgpu.js',
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
                '--enable-unsafe-webgpu',
                '--use-vulkan=swiftshader',
                '--use-webgpu-adapter=swiftshader',
                '--use-angle=vulkan',
                '--no-sandbox',
              ]
            }
          } : undefined
        }
      }
    }
  },
]);