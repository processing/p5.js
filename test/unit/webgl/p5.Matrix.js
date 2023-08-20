/* eslint-disable indent */
var mat4 = [
   1,  2,  3,  4,
   5,  6,  7,  8,
   9, 10, 11, 12,
  13, 14, 15, 16
];

var other = [
  1,  5,  9, 13,
  2,  6, 10, 14,
  3,  7, 11, 15,
  4,  8, 12, 16
];

var mat3 = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9
];
/* eslint-enable indent */

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
      /* eslint-disable indent */
      assert.deepEqual([].slice.call(m.mat4), [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]);
      /* eslint-enable indent */
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
      /* eslint-disable indent */
      assert.deepEqual([].slice.call(m.mat4), [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]);
      /* eslint-enable indent */
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
    /* eslint-disable indent */
    var mm = [
       30,  70, 110, 150,
       70, 174, 278, 382,
      110, 278, 446, 614,
      150, 382, 614, 846
    ];
    /* eslint-enable indent */

    test('self', function() {
      var m = new p5.Matrix(mat4.slice());
      m.mult(m);
      /* eslint-disable indent */
      assert.deepEqual([].slice.call(m.mat4), [
         90, 100, 110, 120,
        202, 228, 254, 280,
        314, 356, 398, 440,
        426, 484, 542, 600
      ]);
      /* eslint-enable indent */
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
    /* eslint-disable indent */
    var am = [
      276, 304, 332, 360,
      304, 336, 368, 400,
      332, 368, 404, 440,
      360, 400, 440, 480
    ];
    /* eslint-enable indent */

    test('self', function() {
      var m = new p5.Matrix(mat4.slice());
      m.apply(m);
      /* eslint-disable indent */
      assert.deepEqual([].slice.call(m.mat4), [
         90, 100, 110, 120,
        202, 228, 254, 280,
        314, 356, 398, 440,
        426, 484, 542, 600
      ]);
      /* eslint-enable indent */
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
    /* eslint-disable indent */
    var sm = [
       2,  4,  6,  8,
      15, 18, 21, 24,
      45, 50, 55, 60,
      13, 14, 15, 16
    ];
    /* eslint-enable indent */

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
    /* eslint-disable max-len */
    var rm = [
      1.433447866601989, 2.5241247073503885, 3.6148015480987885, 4.7054783888471885,
      6.460371405020393, 7.054586073938033,  7.648800742855675,  8.243015411773316,
      7.950398010346969, 9.157598472697025, 10.36479893504708,  11.571999397397136,
      13, 14, 15, 16
    ];
    /* eslint-enable max-len */

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


  suite('p5.Matrix3x3', function() {
    test('apply copy() to 3x3Matrix', function() {
      const m = new p5.Matrix('mat3', [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      const mCopy = m.copy();

      // The matrix created by copying is different from the original matrix
      assert.notEqual(m, mCopy);
      assert.notEqual(m.mat3, mCopy.mat3);

      // The matrix created by copying has the same elements as the original matrix
      assert.deepEqual([].slice.call(m.mat3), [].slice.call(mCopy.mat3));
    });
    test('transpose3x3()', function() {
      const m = new p5.Matrix('mat3', [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      const mTp = new p5.Matrix('mat3', [
        1, 4, 7,
        2, 5, 8,
        3, 6, 9
      ]);

      // If no arguments, transpose itself
      m.transpose3x3();
      assert.deepEqual([].slice.call(m.mat3), [].slice.call(mTp.mat3));

      // If there is an array of arguments, set it by transposing it
      m.transpose3x3([
        1, 2, 3,
        10, 20, 30,
        100, 200, 300
      ]);
      assert.deepEqual([].slice.call(m.mat3), [
        1, 10, 100,
        2, 20, 200,
        3, 30, 300
      ]);
    });
    test('mult3x3()', function() {
      const m = new p5.Matrix('mat3', [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      const m1 = m.copy();
      const m2 = m.copy();
      const multMatrix = new p5.Matrix('mat3', [
        1, 1, 1,
        0, 1, 1,
        1, 0, 1
      ]);

      // When taking a matrix as an argument
      m.mult3x3(multMatrix);
      assert.deepEqual([].slice.call(m.mat3), [
        4, 3, 6,
        10, 9, 15,
        16, 15, 24
      ]);

      // if the argument is an array or an enumerated number
      m1.mult3x3(1, 1, 1, 0, 1, 1, 1, 0, 1);
      m2.mult3x3([1, 1, 1, 0, 1, 1, 1, 0, 1]);
      assert.deepEqual([].slice.call(m.mat3), [].slice.call(m1.mat3));
      assert.deepEqual([].slice.call(m.mat3), [].slice.call(m2.mat3));
    });
    test('column() and row()', function(){
      const m = new p5.Matrix('mat3', [
        // The matrix data is stored column-major, so each line below is
        // a column rather than a row. Imagine you are looking at the
        // transpose of the matrix in the source code.
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      const column0 = m.column(0);
      const column1 = m.column(1);
      const column2 = m.column(2);
      assert.deepEqual(column0.array(), [1, 2, 3]);
      assert.deepEqual(column1.array(), [4, 5, 6]);
      assert.deepEqual(column2.array(), [7, 8, 9]);
      const row0 = m.row(0);
      const row1 = m.row(1);
      const row2 = m.row(2);
      assert.deepEqual(row0.array(), [1, 4, 7]);
      assert.deepEqual(row1.array(), [2, 5, 8]);
      assert.deepEqual(row2.array(), [3, 6, 9]);
    });
    test('diagonal()', function() {
      const m = new p5.Matrix('mat3', [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      const m4x4 = new p5.Matrix([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
      ]);
      assert.deepEqual(m.diagonal(), [1, 5, 9]);
      assert.deepEqual(m4x4.diagonal(), [1, 6, 11, 16]);
    });
    test('multiplyVec3', function() {
      const m = new p5.Matrix('mat3', [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
      const multVector = new p5.Vector(3, 2, 1);
      const result = m.multiplyVec3(multVector);
      assert.deepEqual(result.array(), [18, 24, 30]);
      // If there is a target, set result and return that.
      const target = new p5.Vector();
      m.multiplyVec3(multVector, target);
      assert.deepEqual(target.array(), [18, 24, 30]);
    });
    test('createSubMatrix3x3', function() {
      const m4x4 = new p5.Matrix([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
      ]);
      const result = new p5.Matrix('mat3', [
        1, 2, 3,
        5, 6, 7,
        9, 10, 11
      ]);
      const subMatrix3x3 = m4x4.createSubMatrix3x3();
      assert.deepEqual(
        [].slice.call(result.mat3),
        [].slice.call(subMatrix3x3.mat3)
      );
    });
  });
});
