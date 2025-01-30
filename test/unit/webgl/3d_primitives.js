import p5 from '../../../src/app.js';

suite('3D Primitives', function() {
  var myp5;

  beforeAll(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  suite('p5.prototype.plane', function() {
    test('should be a function', function() {
      assert.ok(myp5.plane);
      assert.typeOf(myp5.plane, 'function');
    });
  });

  suite('p5.prototype.box', function() {
    test('should be a function', function() {
      assert.ok(myp5.box);
      assert.typeOf(myp5.box, 'function');
    });
  });

  suite('p5.prototype.sphere', function() {
    test('should be a function', function() {
      assert.ok(myp5.sphere);
      assert.typeOf(myp5.sphere, 'function');
    });
  });

  suite('p5.prototype.cylinder', function() {
    test('should be a function', function() {
      assert.ok(myp5.cylinder);
      assert.typeOf(myp5.cylinder, 'function');
    });
  });

  suite('p5.prototype.cone', function() {
    test('should be a function', function() {
      assert.ok(myp5.cone);
      assert.typeOf(myp5.cone, 'function');
    });
  });

  suite('p5.prototype.ellipsoid', function() {
    test('should be a function', function() {
      assert.ok(myp5.ellipsoid);
      assert.typeOf(myp5.ellipsoid, 'function');
    });
  });

  suite('p5.prototype.torus', function() {
    test('should be a function', function() {
      assert.ok(myp5.torus);
      assert.typeOf(myp5.torus, 'function');
    });
  });
});
