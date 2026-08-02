import { defineConfig, configDefaults } from 'vitest/config';
import { string } from 'rollup-plugin-string';
import { playwright } from '@vitest/browser-playwright';

const plugins = [
  string({
    include: ['src/webgl/shaders/**/*']
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
          include: ['./test/bench/**/*.js']
        },
        test: {
          name: 'unit-tests',
          publicDir: './test',
          root: './',
          include: ['./test/unit/**/*.js'],
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
            provider: playwright({
              launchOptions: {
                channel: 'chromium'
              }
            }),
            instances: [{ browser: 'chromium' }],
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
          include: ['./test/bench/**/*.js']
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
            provider: playwright({
              launchOptions: process.env.CI
                ? {
                  channel: 'chromium',
                  args: [
                    '--no-sandbox',
                    '--headless=new',
                    '--enable-unsafe-webgpu',
                    '--use-vulkan=swiftshader',
                    '--use-webgpu-adapter=swiftshader',
                    '--use-angle=vulkan'
                  ]
                }
                : { channel: 'chromium' }
            }),
            instances: [{ browser: 'chromium' }],
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
