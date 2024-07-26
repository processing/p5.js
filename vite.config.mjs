import { defineConfig } from 'vitest/config';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    vitePluginString({
      include: [
        'src/webgl/shaders/**/*'
      ]
    })
  ],
  test: {
    include: [
      './test/unit/**/*.js'
    ],
    exclude: [
      './test/unit/spec.js',
      './test/unit/assets/*',
      './test/unit/visual/*'
    ],
    testTimeout: 5000,
    globals: true,
    browser: {
      enabled: true,
      // headless: true,
      name: 'chrome',
      provider: 'webdriverio'
    }
  }
});
