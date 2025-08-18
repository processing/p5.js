import { visualSuite, visualTest } from '../visualTest';

visualSuite('Noise', function() {
  visualTest('Drawn as values', function(p5, screenshot) {
    p5.createCanvas(50, 50);
    p5.background(255);
    p5.strokeWeight(2);
    p5.noFill();
    p5.noiseSeed(0);
    p5.beginShape();
    for (let x = 0; x <= p5.width; x += 2) {
      p5.vertex(x, p5.noise(x * 0.1) * p5.height);
    }
    p5.endShape();
    screenshot();
  });

  visualTest('Drawn in a shader', function(p5, screenshot) {
    p5.createCanvas(50, 50, p5.WEBGL);
    const shader = p5.baseFilterShader().modify(() => {
      p5.getColor((inputs) => {
        const value = p5.clamp(p5.noise(inputs.texCoord * 4) * 2, 0, 1);
        return [value, value, value, 1];
      });
    }, { p5 });
    p5.filter(shader);
    screenshot();
  });
});
