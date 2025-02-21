import { describe, it, expect } from 'vitest';

// Importing p5 
import '../../../lib/p5.js';

describe('noSmooth() should preserve canvas position in WEBGL', () => {
  it('should maintain the canvas position after calling noSmooth()', () => {
    
    let myP5 = new window.p5((p) => {
      p.setup = function () {
        let cnv = p.createCanvas(300, 300, p.WEBGL);
        cnv.position(150, 50);

        const originalTop = cnv.elt.style.top;
        const originalLeft = cnv.elt.style.left;

        // Call noSmooth()
        p.noSmooth();

        // Checking if position remains or not
        expect(cnv.elt.style.top).toBe(originalTop);
        expect(cnv.elt.style.left).toBe(originalLeft);
      };
    });
  });
});
