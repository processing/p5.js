import p5 from '../../../src/app.js';

suite('SVG currentColor End-to-End Rendering', function () {
  let myp5;

  beforeEach(function () {
    return new Promise((resolve) => {
      myp5 = new p5((p) => {
        p.setup = () => {
          resolve();
        };
      });
    });
  });

  afterEach(function () {
    if (myp5) {
      myp5.remove();
      myp5 = null;
    }
  });

  test('reproduction: fill="currentColor" inherits active p5 fill(255, 0, 0) and renders red', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(255, 255, 255);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg>
    `);

    p.noStroke();
    p.fill(255, 0, 0);
    p.shape(svgIcon);

    const pixel = p.get(50, 50);
    assert.strictEqual(pixel[0], 255, 'red channel must be 255');
    assert.strictEqual(pixel[1], 0, 'green channel must be 0');
    assert.strictEqual(pixel[2], 0, 'blue channel must be 0');
    assert.strictEqual(pixel[3], 255, 'alpha channel must be 255');
  });

  test('stroke="currentColor" inherits active p5 stroke(0, 0, 255) and renders blue', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(255, 255, 255);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="10" />
      </svg>
    `);

    p.noFill();
    p.stroke(0, 0, 255);
    p.shape(svgIcon);

    const pixel = p.get(50, 50);
    assert.strictEqual(pixel[0], 0, 'red channel must be 0');
    assert.strictEqual(pixel[1], 0, 'green channel must be 0');
    assert.strictEqual(pixel[2], 255, 'blue channel must be 255');
    assert.strictEqual(pixel[3], 255, 'alpha channel must be 255');
  });

  test('fill="currentColor" respects active p5 noFill()', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(120, 130, 140);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg>
    `);

    p.noFill();
    p.noStroke();
    p.shape(svgIcon);

    // Canvas background should remain untouched because noFill was active
    const pixel = p.get(50, 50);
    assert.strictEqual(pixel[0], 120);
    assert.strictEqual(pixel[1], 130);
    assert.strictEqual(pixel[2], 140);
  });

  test('independent styles: fill="currentColor" with explicit stroke in SVG', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(255, 255, 255);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="currentColor" stroke="rgb(0, 255, 0)" stroke-width="6" />
      </svg>
    `);

    p.fill(255, 0, 0);
    p.stroke(0, 0, 255); // active p5 stroke is blue, but SVG specifies green stroke
    p.shape(svgIcon);

    // Center should have inherited active red fill
    const fillPixel = p.get(50, 50);
    assert.strictEqual(fillPixel[0], 255);
    assert.strictEqual(fillPixel[1], 0);
    assert.strictEqual(fillPixel[2], 0);

    // Stroke edge at (50, 10) should have explicit green SVG stroke
    const strokePixel = p.get(50, 10);
    assert.strictEqual(strokePixel[0], 0);
    assert.strictEqual(strokePixel[1], 255);
    assert.strictEqual(strokePixel[2], 0);
  });

  test('consecutive shapes: state does not leak between shapes', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(255, 255, 255);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect x="0" y="0" width="50" height="100" fill="rgb(0, 0, 255)" />
        <rect x="50" y="0" width="50" height="100" fill="currentColor" />
      </svg>
    `);

    p.noStroke();
    p.fill(255, 0, 0);
    p.shape(svgIcon);

    // Left rect must be explicit blue
    const leftPixel = p.get(25, 50);
    assert.strictEqual(leftPixel[0], 0);
    assert.strictEqual(leftPixel[1], 0);
    assert.strictEqual(leftPixel[2], 255);

    // Right rect must be active p5 red
    const rightPixel = p.get(75, 50);
    assert.strictEqual(rightPixel[0], 255);
    assert.strictEqual(rightPixel[1], 0);
    assert.strictEqual(rightPixel[2], 0);
  });

  test('explicit color attribute takes precedence over active p5 fill', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(255, 255, 255);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" color="rgb(0, 255, 0)" fill="currentColor" />
      </svg>
    `);

    // Active fill in p5 is red, but SVG has explicit color="rgb(0, 255, 0)"
    p.noStroke();
    p.fill(255, 0, 0);
    p.shape(svgIcon);

    const pixel = p.get(50, 50);
    assert.strictEqual(pixel[0], 0, 'red channel must be 0');
    assert.strictEqual(pixel[1], 255, 'green channel must be 255');
    assert.strictEqual(pixel[2], 0, 'blue channel must be 0');
  });

  test('stroke="currentColor" respects active p5 noStroke()', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(100, 150, 200);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="10" />
      </svg>
    `);

    p.noFill();
    p.noStroke();
    p.shape(svgIcon);

    const pixel = p.get(50, 50);
    assert.strictEqual(pixel[0], 100);
    assert.strictEqual(pixel[1], 150);
    assert.strictEqual(pixel[2], 200);
  });

  test('re-exporting imported SVG with currentColor traverses AST and preserves attribute in getSVG', function () {
    const p = myp5;
    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="currentColor" stroke="currentColor" />
      </svg>
    `);

    // Delete sourceSVG to guarantee getSVG() traverses and serializes the AST rather than returning cached markup
    delete svgIcon.sourceSVG;

    const exportedSVG = p.getSVG(svgIcon);
    assert.include(exportedSVG, 'fill="currentColor"');
    assert.include(exportedSVG, 'stroke="currentColor"');
  });

  test('inverse mixed styles: explicit SVG fill with stroke="currentColor"', function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(255, 255, 255);

    const svgIcon = p.createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="rgb(0, 255, 0)" stroke="currentColor" stroke-width="6" />
      </svg>
    `);

    p.fill(255, 0, 0);   // active p5 fill is red, but SVG has explicit green fill
    p.stroke(0, 0, 255); // active p5 stroke is blue, which stroke="currentColor" should inherit
    p.shape(svgIcon);

    // Center should retain explicit green SVG fill
    const fillPixel = p.get(50, 50);
    assert.strictEqual(fillPixel[0], 0);
    assert.strictEqual(fillPixel[1], 255);
    assert.strictEqual(fillPixel[2], 0);

    // Stroke edge at (50, 10) should have inherited active blue p5 stroke
    const strokePixel = p.get(50, 10);
    assert.strictEqual(strokePixel[0], 0);
    assert.strictEqual(strokePixel[1], 0);
    assert.strictEqual(strokePixel[2], 255);
  });

  test('loadSVG() path: loads SVG asynchronously and inherits active p5 styles', async function () {
    const p = myp5;
    p.createCanvas(100, 100);
    p.background(255, 255, 255);

    const svgUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="currentColor" stroke="currentColor" stroke-width="6" />
      </svg>
    `);

    const loadedShape = await p.loadSVG(svgUrl);
    p.fill(255, 0, 0);
    p.stroke(0, 0, 255);
    p.shape(loadedShape);

    // Center should be active red
    const fillPixel = p.get(50, 50);
    assert.strictEqual(fillPixel[0], 255);
    assert.strictEqual(fillPixel[1], 0);
    assert.strictEqual(fillPixel[2], 0);

    // Stroke at (50, 10) should be active blue
    const strokePixel = p.get(50, 10);
    assert.strictEqual(strokePixel[0], 0);
    assert.strictEqual(strokePixel[1], 0);
    assert.strictEqual(strokePixel[2], 255);
  });

  test('full buildShape recording exports concrete hex colors', function () {
    const p = myp5;
    p.createCanvas(100, 100);

    p.fill(255, 0, 0);
    p.stroke(0, 0, 255);
    const recorded = p.buildShape(() => {
      p.rect(10, 10, 50, 50);
    });

    const exportedSVG = p.getSVG(recorded);
    assert.include(exportedSVG, 'fill="#ff0000"');
    assert.include(exportedSVG, 'stroke="#0000ff"');
  });
});

