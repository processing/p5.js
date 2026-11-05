import { bench, describe } from 'vitest';
import p5 from '../../src/app';

// Mirrors the minified build, where FES is excluded from the bundle.
// Set inside the timed callback so the flag does not leak into other
// benchmark files sharing this process.
describe('p5.Graphics.set() performance (FES off)', () => {
  const options = { iterations: 10, time: 2000 };
  const W = 100;
  const H = 100;
  const FRAMES = 50;

  bench(
    'set() hot loop',
    async () => {
      const previousFES = p5.disableFriendlyErrors;
      p5.disableFriendlyErrors = true;

      try {
        let myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) throw new Error('not ready');
        });

        const buf = myp5.createGraphics(W, H);
        const col = myp5.color(255, 0, 0);

        for (let f = 0; f < FRAMES; f++) {
          for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
              buf.set(x, y, col);
            }
          }
        }

        myp5.remove();
      } finally {
        p5.disableFriendlyErrors = previousFES;
      }
    },
    options
  );
});