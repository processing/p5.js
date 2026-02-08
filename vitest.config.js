import { defineConfig, configDefaults } from 'vitest/config';
import vitePluginString from 'vite-plugin-string';
import { webdriverio } from '@vitest/browser-webdriverio';

const plugins = [
  vitePluginString({
    include: [
      'src/webgl/shaders/**/*'
    ],
    compress: false
  })
];

export default defineConfig({
  test: {
    projects: [
      {
        plugins,
        bench: {
          name: 'bench',
          root: './',
          include: [
            './test/bench/**/*.js'
          ]
        },
        test: {
          name: 'unit-tests',
          publicDir: './test',
          root: './',
          include: [
            './test/unit/**/*.js'
          ],
          exclude: [
            './test/unit/spec.js',
            './test/unit/assets/**/*',
            './test/unit/visual/visualTest.js',
            './test/unit/visual/cases/webgpu.js',
            './test/unit/webgpu/*.js',
            './test/types/**/*'
          ],
          testTimeout: 3000,
          globals: true,
          browser: {
            enabled: true,
            provider: webdriverio({
              capabilities: process.env.CI ? {
                'goog:chromeOptions': {
                  args: [
                    '--headless=new',
                    '--no-sandbox',
                    '--enable-webgl',
                    '--use-gl=angle',
                    '--use-angle=swiftshader-webgl',
                    '--enable-unsafe-swiftshader'
                  ]
                }
              } : undefined
            }),
            instances: [
              { browser: 'chrome' }
            ],
            screenshotFailures: false
          },
          fakeTimers: {
            toFake: [...(configDefaults.fakeTimers.toFake ?? []), 'performance']
          }
        }
      },
      {
        plugins,
        bench: {
          name: 'bench',
          root: './',
          include: [
            './test/bench/**/*.js'
          ]
        },
        test: {
          name: 'unit-tests-webgpu',
          root: './',
          include: [
            // './test/unit/**/*.js',
            './test/unit/visual/cases/webgpu.js',
            './test/unit/webgpu/*.js'
          ],
          exclude: [
            './test/unit/spec.js',
            './test/unit/assets/**/*',
            './test/unit/visual/visualTest.js',
            // './test/unit/visual/cases/webgpu.js',
            './test/types/**/*'
          ],
          testTimeout: 5000,
          globals: true,
          browser: {
            enabled: true,
            provider: webdriverio({
              capabilities: process.env.CI ? {
                'goog:chromeOptions': {
                  args: [
                    '--no-sandbox',
                    '--headless=new',
                    '--enable-unsafe-webgpu',
                    '--use-vulkan=swiftshader',
                    '--use-webgpu-adapter=swiftshader',
                    '--use-angle=vulkan'
                  ]
                }
              } : undefined
            }),
            instances: [
              { browser: 'chrome' }
            ],
            screenshotFailures: false
          },
          fakeTimers: {
            toFake: [...(configDefaults.fakeTimers.toFake ?? []), 'performance']
          }
        }
      }
    ]
  }
});
