import p5 from '../../../src/app.js';

suite('Attributes', function() {
  var myp5;

  beforeAll(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  suite('p5.prototype.ellipseMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.ellipseMode);
      assert.typeOf(myp5.ellipseMode, 'function');
    });
  });

  suite('p5.prototype.rectMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.rectMode);
      assert.typeOf(myp5.rectMode, 'function');
    });
  });

  suite('p5.prototype.noSmooth', function() {
    test('should be a function', function() {
      assert.ok(myp5.noSmooth);
      assert.typeOf(myp5.noSmooth, 'function');
    });
  });

  suite('p5.prototype.smooth', function() {
    test('should be a function', function() {
      assert.ok(myp5.smooth);
      assert.typeOf(myp5.smooth, 'function');
    });
  });

  suite('p5.prototype.strokeCap', function() {
    test('should be a function', function() {
      assert.ok(myp5.strokeCap);
      assert.typeOf(myp5.strokeCap, 'function');
    });
  });

  suite('p5.prototype.strokeJoin', function() {
    test('should be a function', function() {
      assert.ok(myp5.strokeJoin);
      assert.typeOf(myp5.strokeJoin, 'function');
    });
  });

  suite('p5.prototype.strokeWeight', function() {
    test('should be a function', function() {
      assert.ok(myp5.strokeWeight);
      assert.typeOf(myp5.strokeWeight, 'function');
    });
  });
});
