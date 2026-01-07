import p5 from '../../../src/app.js';

suite('set() with p5.Graphics', function() {
  let myp5;

  beforeEach(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100);
        p.pixelDensity(1);
      };
    });
  });

  afterEach(function() {
    myp5.remove();
  });

  test('set() works with p5.Graphics on main canvas', function() {
    myp5.background(0, 255, 0);
    const gfx = myp5.createGraphics(20, 20);
    gfx.background(255, 0, 0);
    myp5.set(10, 10, gfx);
    myp5.updatePixels();
    assert.deepEqual(myp5.get(15, 15), [255, 0, 0, 255]);
    assert.deepEqual(myp5.get(5, 5), [0, 255, 0, 255]);
  });

  test('set() works with p5.Graphics on p5.Graphics', function() {
    const mainGfx = myp5.createGraphics(100, 100);
    mainGfx.background(255);
    const smallGfx = myp5.createGraphics(20, 20);
    smallGfx.background(0, 0, 255);
    mainGfx.set(10, 10, smallGfx);
    mainGfx.updatePixels();
    myp5.image(mainGfx, 0, 0);
    assert.deepEqual(myp5.get(15, 15), [0, 0, 255, 255]);
  });

  test('set() clears area under p5.Graphics', function() {
    myp5.background(255);
    myp5.stroke(255, 0, 0);
    myp5.strokeWeight(2);
    for (let i = 0; i < 100; i += 10) {
      myp5.line(i, 0, i, 100);
    }
    const gfx = myp5.createGraphics(40, 40);
    gfx.background(0, 255, 0);
    myp5.set(30, 30, gfx);
    myp5.updatePixels();
    assert.deepEqual(myp5.get(35, 35), [0, 255, 0, 255]);
  });

  test('set() works at edge (0,0)', function() {
    myp5.background(255);
    const gfx = myp5.createGraphics(30, 30);
    gfx.background(0, 0, 255);
    myp5.set(0, 0, gfx);
    myp5.updatePixels();
    assert.deepEqual(myp5.get(15, 15), [0, 0, 255, 255]);
    assert.deepEqual(myp5.get(35, 35), [255, 255, 255, 255]);
  });

  test('set() behaves same for p5.Graphics and p5.Image', function() {
    const gfx = myp5.createGraphics(20, 20);
    gfx.background(255, 0, 0);
    const img = gfx.get();
    myp5.background(255);
    myp5.set(10, 10, gfx);
    myp5.updatePixels();
    const pixelFromGfx = myp5.get(15, 15);
    myp5.background(255);
    myp5.set(10, 10, img);
    myp5.updatePixels();
    const pixelFromImg = myp5.get(15, 15);
    assert.deepEqual(pixelFromGfx, pixelFromImg);
  });
});