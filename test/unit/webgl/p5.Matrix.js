// prettier-ignore
var mat4 = [
   1,  2,  3,  4,
   5,  6,  7,  8,
   9, 10, 11, 12,
  13, 14, 15, 16,
];

// prettier-ignore
var other = [
  1,  5,  9, 13,
  2,  6, 10, 14,
  3,  7, 11, 15,
  4,  8, 12, 16,
];

// prettier-ignore
var mat3 = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
];

suite('p5.Matrix', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('construction', function() {
    test('new p5.Matrix()', function() {
      var m = new p5.Matrix();
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat3);
      // prettier-ignore
      assert.deepEqual([].slice.call(m.mat4), [
				1, 0, 0, 0, 
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			]);
    });

    test('new p5.Matrix(array)', function() {
      var m = new p5.Matrix(mat4);
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat3);
      assert.deepEqual([].slice.call(m.mat4), mat4);
    });

    test('new p5.Matrix(mat3)', function() {
      var m = new p5.Matrix('mat3', mat3);
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat4);
      assert.deepEqual([].slice.call(m.mat3), mat3);
    });

    test('identity()', function() {
      var m = p5.Matrix.identity();
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat3);
      // prettier-ignore
      assert.deepEqual([].slice.call(m.mat4), [
				1, 0, 0, 0, 
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			]);
    });
  });

  suite('set', function() {
    test('p5.Matrix', function() {
      var m = new p5.Matrix();
      m.set(new p5.Matrix(mat4));
      assert.deepEqual([].slice.call(m.mat4), mat4);
    });

    test('array', function() {
      var m = new p5.Matrix();
      m.set(mat4);
      assert.deepEqual([].slice.call(m.mat4), mat4);
    });

    test('arguments', function() {
      var m = new p5.Matrix();
      m.set.apply(m, mat4);
      assert.notEqual(m.mat4, mat4);
      assert.deepEqual([].slice.call(m.mat4), mat4);
    });
  });

  suite('get / copy', function() {
    test('get', function() {
      var m = new p5.Matrix(mat4);
      var m2 = m.get();
      assert.notEqual(m, m2);
      assert.equal(m.mat4, m2.mat4);
    });
    test('copy', function() {
      var m = new p5.Matrix(mat4);
      var m2 = m.copy();
      assert.notEqual(m, m2);
      assert.notEqual(m.mat4, m2.mat4);
      assert.deepEqual([].slice.call(m.mat4), [].slice.call(m2.mat4));
    });
  });

  suite('mult', function() {
    // prettier-ignore
    var mm = [
       30,  70, 110, 150,
       70, 174, 278, 382,
      110, 278, 446, 614,
      150, 382, 614, 846,
    ];

    test('self', function() {
      var m = new p5.Matrix(mat4.slice());
      m.mult(m);
      // prettier-ignore
      assert.deepEqual([].slice.call(m.mat4), [
        90, 100, 110, 120,
       202, 228, 254, 280,
       314, 356, 398, 440,
       426, 484, 542, 600,
     ]);
    });

    test('p5.Matrix', function() {
      var m1 = new p5.Matrix(mat4.slice());
      var m2 = new p5.Matrix(other);
      m1.mult(m2);
      assert.deepEqual([].slice.call(m1.mat4), mm);
    });

    test('array', function() {
      var m = new p5.Matrix(mat4.slice());
      m.mult(other);
      assert.deepEqual([].slice.call(m.mat4), mm);
    });

    test('arguments', function() {
      var m = new p5.Matrix(mat4.slice());
      m.mult.apply(m, other);
      assert.deepEqual([].slice.call(m.mat4), mm);
    });
  });

  suite('apply', function() {
    // prettier-ignore
    var am = [
      276, 304, 332, 360,
      304, 336, 368, 400,
      332, 368, 404, 440,
      360, 400, 440, 480,
    ];

    test('self', function() {
      var m = new p5.Matrix(mat4.slice());
      m.apply(m);
      // prettier-ignore
      assert.deepEqual([].slice.call(m.mat4), [
        90, 100, 110, 120,
       202, 228, 254, 280,
       314, 356, 398, 440,
       426, 484, 542, 600,
     ]);
    });

    test('p5.Matrix', function() {
      var m1 = new p5.Matrix(mat4.slice());
      var m2 = new p5.Matrix(other);
      m1.apply(m2);
      assert.deepEqual([].slice.call(m1.mat4), am);
    });

    test('array', function() {
      var m = new p5.Matrix(mat4.slice());
      m.apply(other);
      assert.deepEqual([].slice.call(m.mat4), am);
    });

    test('arguments', function() {
      var m = new p5.Matrix(mat4.slice());
      m.apply.apply(m, other);
      assert.deepEqual([].slice.call(m.mat4), am);
    });
  });

  suite('scale', function() {
    // prettier-ignore
    var sm = [
       2,  4,  6,  8,
      15, 18, 21, 24,
      45, 50, 55, 60,
      13, 14, 15, 16,
    ];

    test('p5.Vector', function() {
      var m = new p5.Matrix(mat4.slice());
      var v = myp5.createVector(2, 3, 5);
      m.scale(v);
      assert.notEqual(m.mat4, mat4);
      assert.deepEqual([].slice.call(m.mat4), sm);
    });

    test('array', function() {
      var m = new p5.Matrix(mat4.slice());
      m.scale([2, 3, 5]);
      assert.notEqual(m.mat4, mat4);
      assert.deepEqual([].slice.call(m.mat4), sm);
    });

    test('arguments', function() {
      var m = new p5.Matrix(mat4.slice());
      m.scale(2, 3, 5);
      assert.notEqual(m.mat4, mat4);
      assert.deepEqual([].slice.call(m.mat4), sm);
    });
  });

  suite('rotate', function() {
    // prettier-ignore
    var rm = [
      1.433447866601989, 2.5241247073503885, 3.6148015480987885, 4.7054783888471885, 
      6.460371405020393, 7.054586073938033,  7.648800742855675,  8.243015411773316, 
      7.950398010346969, 9.157598472697025, 10.36479893504708,  11.571999397397136, 
      13, 14, 15, 16, 
    ];

    test('p5.Vector', function() {
      var m = new p5.Matrix(mat4.slice());
      var v = myp5.createVector(2, 3, 5);
      m.rotate(45 * myp5.DEG_TO_RAD, v);
      assert.deepEqual([].slice.call(m.mat4), rm);
    });

    test('array', function() {
      var m = new p5.Matrix(mat4.slice());
      m.rotate(45 * myp5.DEG_TO_RAD, [2, 3, 5]);
      assert.deepEqual([].slice.call(m.mat4), rm);
    });

    test('arguments', function() {
      var m = new p5.Matrix(mat4.slice());
      m.rotate(45 * myp5.DEG_TO_RAD, 2, 3, 5);
      assert.deepEqual([].slice.call(m.mat4), rm);
    });
  });
});
