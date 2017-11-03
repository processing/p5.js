suite('stroke WebGL', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  teardown(function() {
    myp5.clear();
  });

  suite('default stroke shader', function() {
    test('check default shader creation', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      assert(
        myp5._renderer.curStrokeShader === myp5._renderer._getLineShader(),
        'default stroke shader was not initialized with GL canvas');
      assert(
        myp5._renderer.curFillShader === myp5._renderer._getColorShader(),
        'default fill shader was not initialized with GL canvas');
      done();
    });

    test('check activate and deactivating fill and stroke', function(done) {
      myp5.noStroke();
      assert(
        myp5._renderer.curStrokeShader.active === false,
        'stroke shader still active after noStroke()');
      assert.isTrue(
        myp5._renderer.curFillShader.active === true,
        'fill shader deactivated by noStroke()');
      myp5.stroke(0);
      myp5.noFill();
      assert(
        myp5._renderer.curStrokeShader.active === true,
        'stroke shader not active after stroke()');
      assert.isTrue(
        myp5._renderer.curFillShader.active === false,
        'fill shader still active after noFill()');
      done();
    });
  });
});
