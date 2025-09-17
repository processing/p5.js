import { visualTest, visualSuite } from '../../visual/visualTest.js';

visualSuite('math', () => {
  visualTest('atan_outside_strands', async (p5, screenshot) => {
    // Ensure no WebGL/strands context is used; call atan directly and draw text
    p5.createCanvas(120, 60);
    p5.background(255);
    p5.fill(0);
    const v = p5.atan(0.5);
    // Draw the numeric value so visual regression will catch undefined/NaN
    p5.textSize(14);
    p5.textFont('monospace');
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`atan(0.5)=${p5.nf(v, 1, 3)}`, 5, 5);
    screenshot();
  });
});
