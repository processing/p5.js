import { defineConfig } from 'vitest/config';
import vitePluginString from 'vite-plugin-string';
import path from 'node:path';

const libPath = path.resolve(__dirname, '../../lib');

export default defineConfig({
  root: '.',
  publicDir: libPath,
  plugins: [
    vitePluginString({
      include: [
        'src/webgl/shaders/**/*'
      ]
    }),
    {
      name: 'reload',
      configureServer(server) {
        const { ws, watcher } = server;
        const buildLibPath = path.resolve(libPath, './p5.js');
        watcher.add(buildLibPath);
        watcher.on('change', file => {
          if(file === buildLibPath){
            ws.send({
              type: 'full-reload'
            });
          }
        });
      }
    }
  ]
});
