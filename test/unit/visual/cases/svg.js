import { visualSuite, visualTest } from '../visualTest.js';

function setupDefault(p) {
  p.createCanvas(200, 200);
  p.background(200);
  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1);
}

async function screenshotSVG(p, screenshot, svgString) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('Failed to load SVG into Image'));
    i.src = url;
  });
  URL.revokeObjectURL(url);

  p.resetMatrix();
  p.clear();
  p.drawingContext.drawImage(img, 0, 0, p.width, p.height);
  await screenshot();
}

async function loadFixture(p, name) {
  return p.loadSVG(`test/unit/assets/svg/${name}.svg`);
}

visualSuite('svg', function () {
  visualSuite('SVG Shapes', function () {
    visualTest('circle', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.circle(100, 110, 120);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('ellipse', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.ellipse(90, 105, 140, 80);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('rect', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.rect(40, 50, 120, 80);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('square', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.square(45, 45, 110);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('line', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.line(30, 40, 170, 160);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('point', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.point(105, 95);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('triangle', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.triangle(105, 40, 45, 160, 155, 160);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('quad', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.quad(35, 35, 165, 55, 145, 165, 55, 145);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('arc', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.arc(95, 95, 130, 130, 0, p.PI + p.HALF_PI);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('multiple shapes', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.circle(60, 60, 50);
        p.rect(110, 40, 60, 50);
        p.triangle(50, 160, 100, 110, 150, 160);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('overlapping shapes', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.rect(40, 40, 100, 100);
        p.circle(110, 110, 80);
        p.line(20, 50, 180, 150);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('custom path - vertices', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.beginShape();
        p.vertex(30, 20);
        p.vertex(85, 20);
        p.vertex(85, 75);
        p.vertex(30, 75);
        p.endShape(p.CLOSE);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('custom path - bezier curve', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.bezierOrder(3);
        p.beginShape();
        p.vertex(30, 20);
        p.bezierVertex(80, 0);
        p.bezierVertex(80, 75);
        p.bezierVertex(30, 75);
        p.bezierVertex(50, 80);
        p.bezierVertex(60, 25);
        p.bezierVertex(30, 20);
        p.endShape();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('custom path - curves', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.beginShape();
        p.splineVertex(40, 40);
        p.splineVertex(40, 40);
        p.splineVertex(80, 60);
        p.splineVertex(120, 100);
        p.splineVertex(160, 40);
        p.splineVertex(160, 40);
        p.endShape();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('triangle fan', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.beginShape(p.TRIANGLE_FAN);
        p.vertex(100, 100);
        p.vertex(100, 40);
        p.vertex(150, 60);
        p.vertex(160, 110);
        p.vertex(130, 150);
        p.vertex(80, 140);
        p.vertex(50, 90);
        p.endShape();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('triangle strip', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.beginShape(p.TRIANGLE_STRIP);
        p.vertex(30, 75);
        p.vertex(40, 20);
        p.vertex(50, 75);
        p.vertex(60, 20);
        p.vertex(70, 75);
        p.vertex(80, 20);
        p.vertex(90, 75);
        p.endShape();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('quad strip', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.beginShape(p.QUAD_STRIP);
        p.vertex(30, 80);
        p.vertex(30, 20);
        p.vertex(70, 80);
        p.vertex(70, 20);
        p.vertex(110, 80);
        p.vertex(110, 20);
        p.vertex(150, 80);
        p.vertex(150, 20);
        p.endShape();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('reusable shape', async (p, screenshot) => {
      p.createCanvas(400, 400);
      p.background(220);
      p.fill(255);
      p.stroke(0);
      p.strokeWeight(1);

      const leaf = p.buildShape(() => {
        p.fill(0, 200, 100);
        p.noStroke();
        p.ellipse(0, 0, 30, 60);
      });

      const flower = p.buildShape(() => {
        p.background(200);
        p.push();
        p.translate(100, 100);
        p.fill(255, 150, 0);
        p.circle(0, 0, 40);
        for (let i = 0; i < 4; i++) {
          p.push();
          p.rotate(p.TWO_PI * i / 4);
          p.translate(0, -40);
          p.scale(0.8 + i * 0.1);
          p.shape(leaf);
          p.pop();
        }
        p.pop();
      });

      p.background(255);
      p.shape(flower);
      await screenshot();
      await screenshotSVG(p, screenshot, p.getSVG(flower));
    });
  });

  visualSuite('Transformations', function () {
    visualTest('translate ellipse', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.translate(50, 50);
        p.ellipse(50, 50, 80, 50);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('rotate rect', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.translate(100, 100);
        p.rotate(p.QUARTER_PI);
        p.rect(-40, -25, 80, 50);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('scale circle', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.translate(100, 100);
        p.scale(1.5, 0.7);
        p.circle(0, 0, 80);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('mixture of transforms', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.translate(100, 100);
        p.rotate(p.PI / 6);
        p.scale(1.2, 0.8);
        p.rect(-30, -30, 60, 60);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('transforms with multiple shapes', async (p, screenshot) => {
      setupDefault(p);
      const record = p.buildShape(() => {
        p.translate(60, 60);
        p.rect(0, 0, 50, 50);

        p.rotate(p.QUARTER_PI);
        p.scale(0.8, 1.4);
        p.circle(50, 0, 40);

        p.translate(0, -40);
        p.line(-30, 0, 30, 0);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });
  });

  visualSuite('Backgrounds and Clears', function () {
    visualTest('background on the top', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.background(255, 200, 100);
        p.fill(0, 0, 255);
        p.rect(40, 60, 120, 80);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('only background', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.background(100, 150, 200);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('transform and background', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.translate(90, 110);
        p.scale(2);
        p.background(200, 100, 100);
        p.fill(255);
        p.circle(0, 0, 20);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('background in between the shapes with alpha', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.rect(20, 30, 120, 80);
        p.background(0, 255, 0, 128);
        p.fill(0, 0, 255);
        p.rect(70, 90, 110, 70);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('background in between the shapes and transform', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.rect(20, 30, 120, 80);
        p.translate(40, 60);
        p.background(0, 255, 255);
        p.fill(0, 0, 255);
        p.rect(0, 0, 110, 70);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('clear on the top', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.noStroke();
        p.rect(40, 60, 120, 80);
        p.clear();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('clear in between the shapes with alpha', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.noStroke();
        p.rect(20, 30, 120, 80);
        p.clear();
        p.fill(0, 0, 255, 128);
        p.rect(70, 90, 110, 70);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('clear in between the shapes and transform', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.noStroke();
        p.rect(20, 30, 120, 80);
        p.translate(40, 60);
        p.clear();
        p.fill(0, 0, 255);
        p.rect(0, 0, 110, 70);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('clear and background together', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.noStroke();
        p.rect(20, 30, 120, 80);
        p.clear();
        p.background(255, 200, 100);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('transform and background with clear', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.background(255, 0, 0);
        p.translate(40, 60);
        p.fill(0, 255, 0);
        p.rect(0, 0, 110, 70);
        p.clear();
        p.background(0, 0, 255);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('only clear', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.clear();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });
  });

  visualSuite('Push Pop State', function () {
    visualTest('nothing', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.push();
        p.pop();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('transforms and combinations', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.translate(50, 50);

        p.push();
        p.rotate(p.QUARTER_PI);
        p.fill(0);
        p.rect(0, 0, 40, 40);
        p.pop();

        p.fill(128);
        p.rect(0, 0, 40, 40);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('sequential transforms', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.noStroke();

        p.push();
        p.translate(50, 20);
        p.fill(255, 0, 0);
        p.rect(0, 0, 30, 30);
        p.pop();

        p.push();
        p.translate(20, 100);
        p.fill(0, 255, 0);
        p.rect(0, 0, 30, 30);
        p.pop();

        p.push();
        p.translate(120, 80);
        p.fill(0, 0, 255);
        p.rect(0, 0, 30, 30);
        p.pop();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('nested transforms', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.noStroke();

        p.push();
        p.translate(40, 20);
        p.fill(255, 0, 0);
        p.rect(0, 0, 25, 25);

        p.push();
        p.translate(0, 50);
        p.fill(0, 255, 0);
        p.rect(0, 0, 25, 25);
        p.pop();

        p.fill(0, 0, 255);
        p.rect(0, 100, 25, 25);
        p.pop();

        p.fill(255, 255, 0);
        p.rect(0, 0, 25, 25);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('background', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.push();
        p.background(255, 200, 100);
        p.pop();
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('transform background shape fill and combinations', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.stroke(0);
        p.strokeWeight(2);

        p.push();
        p.translate(60, 60);
        p.fill(0, 255, 0);
        p.stroke(0, 0, 255);
        p.strokeWeight(5);
        p.rect(0, 0, 50, 50);

        p.background(200, 100, 100);
        p.pop();

        p.rect(120, 120, 50, 50);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('clear', async (p, screenshot) => {
      p.createCanvas(200, 200);
      const record = p.buildShape(() => {
        p.fill(255, 0, 0);
        p.noStroke();
        p.rect(20, 20, 50, 50);

        p.push();
        p.fill(0, 255, 0);
        p.rect(80, 80, 50, 50);

        p.clear();
        p.pop();

        p.fill(0, 0, 255);
        p.rect(120, 120, 50, 50);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });
  });

  visualSuite('Colors and Strokes', function () {
    visualTest('fill with and without alpha', async (p, screenshot) => {
      p.createCanvas(200, 200);
      p.background(255);
      p.noStroke();

      const record = p.buildShape(() => {
        p.fill('#ff0000');
        p.circle(60, 100, 70);

        p.fill(0, 0, 255, 127);
        p.circle(140, 100, 70);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('stroke variations', async (p, screenshot) => {
      p.createCanvas(200, 200);
      p.background(255);

      const record = p.buildShape(() => {
        p.fill(255, 255, 0);
        p.stroke(0);
        p.strokeWeight(4);
        p.circle(60, 60, 70);

        p.fill('#00ff00');
        p.stroke('#0000ff');
        p.strokeWeight(2);
        p.rect(110, 30, 60, 60);

        p.fill(255, 0, 255);
        p.noStroke();
        p.circle(100, 150, 70);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('strokeWeights', async (p, screenshot) => {
      p.createCanvas(200, 200);
      p.background(255);
      p.noFill();

      const record = p.buildShape(() => {
        p.stroke(0);
        p.strokeWeight(1);
        p.line(20, 40, 180, 40);

        p.stroke(0);
        p.strokeWeight(5);
        p.line(20, 100, 180, 100);

        p.stroke(0);
        p.strokeWeight(15);
        p.line(20, 160, 180, 160);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('overlapping shapes alpha', async (p, screenshot) => {
      p.createCanvas(200, 200);
      p.background(255);
      p.noStroke();

      const record = p.buildShape(() => {
        p.fill(255, 0, 0, 150);
        p.circle(80, 80, 90);

        p.fill(0, 255, 0, 150);
        p.circle(120, 80, 90);

        p.fill(0, 0, 255, 150);
        p.circle(100, 120, 90);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });

    visualTest('combination of everything', async (p, screenshot) => {
      p.createCanvas(200, 200);
      p.background(255);

      const record = p.buildShape(() => {
        p.fill('#eaeaea');
        p.stroke('#333333');
        p.strokeWeight(3);
        p.rect(20, 20, 160, 160);

        p.fill('rgba(255, 0, 0, 0.5)');
        p.noStroke();
        p.circle(70, 70, 60);

        p.fill('rgba(0, 0, 255, 0.5)');
        p.stroke(0, 255, 0);
        p.strokeWeight(5);
        p.rect(90, 90, 60, 60);

        p.stroke('rgba(0, 0, 0, 0.7)');
        p.strokeWeight(8);
        p.line(30, 170, 170, 30);
      });
      await screenshotSVG(p, screenshot, p.getSVG(record));
    });
  });

  visualSuite('SVG Import - defs and use', function () {
    visualTest('basic use', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'defs-use-circle');
      p.shape(shape);
      await screenshot();
    });

    visualTest('group use', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'defs-use-group');
      p.shape(shape);
      await screenshot();
    });

    visualTest('nested use', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'defs-use-nested');
      p.shape(shape);
      await screenshot();
    });

    visualTest('symbol', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'defs-symbol');
      p.shape(shape);
      await screenshot();
    });

    visualTest('viewBox', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'defs-symbol-viewbox');
      p.shape(shape);
      await screenshot();
    });

    visualTest('x and y', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'defs-use-xy');
      p.shape(shape);
      await screenshot();
    });
  });

  visualSuite('SVG Import - Shapes', function () {
    visualTest('circle', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'circle');
      p.shape(shape);
      await screenshot();
    });

    visualTest('rect', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'rect');
      p.shape(shape);
      await screenshot();
    });

    visualTest('ellipse', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'ellipse');
      p.shape(shape);
      await screenshot();
    });

    visualTest('polygon', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'polygon');
      p.shape(shape);
      await screenshot();
    });

    visualTest('polyline', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'polyline');
      p.shape(shape);
      await screenshot();
    });

    visualTest('path', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'path-bezier');
      p.shape(shape);
      await screenshot();
    });

    visualTest('arc', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'arc');
      p.shape(shape);
      await screenshot();
    });

    visualTest('rounded rect', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'rounded-rect');
      p.shape(shape);
      await screenshot();
    });

    visualTest('overlapping shapes', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'overlapping-shapes');
      p.shape(shape);
      await screenshot();
    });

    visualTest('line', async (p, screenshot) => {
      setupDefault(p);
      const shape = await loadFixture(p, 'line');
      p.shape(shape);
      await screenshot();
    });
  });
});
