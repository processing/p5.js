import { bench, describe } from 'vitest';
import p5 from '../../src/app';

describe('p5.Graphics.set() performance', () => {
  const options = { iterations: 3, time: 2000 };
  const W = 100;
  const H = 100;
  const FRAMES = 50;

  bench(
    'set() hot loop',
    async () => {
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
    },
    options
  );
});
