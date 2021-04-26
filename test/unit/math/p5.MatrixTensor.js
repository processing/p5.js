suite.only('p5.MatrixTensor', function() {
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
  var m;
  suite('p5.prototype.createMatrixTensor()', function() {
    setup(function() {
      m = myp5.createMatrixTensor(5, 4);
    });
    test('should create instance of p5.MatrixTensor', function() {
      assert.instanceOf(m, p5.MatrixTensor);
    });
    test('should have values be initialized to 0', function() {
      for (let i = 0; i < m.cols; i++) {
        for (let j = 0; j < m.rows; j++) {
          assert.equal(m.matrix[i][j], 0);
        }
      }
    });
    test('should have values be initialized to 0. (Using getValue)', function() {
      for (let i = 0; i < m.cols; i++) {
        for (let j = 0; j < m.rows; j++) {
          assert.equal(m.getValue(i, j), 0);
        }
      }
    });
  });
  suite('with p5.MatrixTensor', function() {
    setup(function() {
      m = new p5.MatrixTensor();
    });
    test('matrix component should have 0 in length in both directions', function() {
      assert.equal(1, m.matrix.length);
      assert.equal(0, m.matrix[0].length);
    });
  });
  var rm;
  suite('p5.MatrixTensor.make()', function() {
    setup(function() {
      rm = p5.MatrixTensor.make();
    });
    test('should create a 0 by 0 number[][]', function() {
      assert.equal(1, rm.length);
      assert.equal(0, rm[0].length);
    });
  });
  suite('p5.MatrixTensor.make(n, n)', function() {
    setup(function() {
      rm = p5.MatrixTensor.make(3, 4);
    });
    test('should create instance of p5.MatrixTensor', function() {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
          assert.equal(rm[i][j], 0);
        }
      }
      assert.equal(3, rm.length);
      assert.equal(4, rm[0].length);
    });
  });
  suite('p5.MatrixTensor.prototype.toArray()', function() {
    suite('1 by n', function() {
      setup(function() {
        m = new p5.MatrixTensor(1, 4);
      });
      test('should output an array of length 4', function() {
        let arr = m.toArray();
        assert.equal(4, arr.length);
      });
    });
    suite('n by 1', function() {
      setup(function() {
        m = new p5.MatrixTensor(4, 1);
      });
      test('should output an array of length 4', function() {
        let arr = m.toArray();
        assert.equal(4, arr.length);
      });
    });
    suite('0 by 1', function() {
      setup(function() {
        m = new p5.MatrixTensor(0, 1);
      });
      test('should output an array of length 0', function() {
        let arr = m.toArray();
        assert.equal(0, arr.length);
      });
    });
    suite('1 by 0', function() {
      setup(function() {
        m = new p5.MatrixTensor(1, 0);
      });
      test('should output an array of length 0', function() {
        let arr = m.toArray();
        assert.equal(0, arr.length);
      });
    });
    suite('2 by 2', function() {
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
      });
      test('should output undefined because 2 by 2 matrix cant be translated into an array', function() {
        let arr = m.toArray();
        assert.equal(arr, undefined);
      });
    });
  });
  suite('p5.MatrixTensor.fromArray()', function() {
    let a;
    setup(function() {
      a = [1, 1, 0, 1, 0, 1];
    });
    test('should output a matrix with 6 columns & 1 row', function() {
      let m1 = p5.MatrixTensor.fromArray(a);
      assert.equal(6, m1.cols);
      assert.equal(6, m1.matrix.length);
      assert.equal(1, m1.rows);
      assert.equal(1, m1.matrix[0].length);
    });
  });
  suite('p5.MatrixTensor.prototype.setValue()', function() {
    setup(function() {
      m = new p5.MatrixTensor(5, 6);
    });
    test('should set value 100 at column 4, row 5', function() {
      m.setValue(100, 4, 5);
      assert.equal(100, m.matrix[4][5]);
      assert.equal(100, m.getValue(4, 5));
    });
    test('should set value 55 at column 0, row 0', function() {
      m.setValue(55, 0, 0);
      assert.equal(55, m.matrix[0][0]);
      assert.equal(55, m.getValue(0, 0));
    });
    test('should set value 80 at column 2, row 2', function() {
      m.setValue(80, 2, 2);
      assert.equal(80, m.matrix[2][2]);
      assert.equal(80, m.getValue(2, 2));
    });
  });
  suite('p5.MatrixTensor.prototype.copy()', function() {
    setup(function() {
      m = new p5.MatrixTensor(5, 6);
      m.setValue(100, 4, 5);
      m.setValue(55, 0, 0);
      m.setValue(80, 2, 2);
    });
    test('should be the exact same matrix after copy', function() {
      let m1 = m.copy();
      assert.equal(100, m1.matrix[4][5]);
      assert.equal(100, m1.getValue(4, 5));
      assert.equal(55, m1.matrix[0][0]);
      assert.equal(55, m1.getValue(0, 0));
      assert.equal(80, m1.matrix[2][2]);
      assert.equal(80, m1.getValue(2, 2));
    });
  });
  suite('p5.MatrixTensor.prototype.set()', function() {
    setup(function() {
      m = new p5.MatrixTensor(2, 3);
      m.setValue(10, 1, 1);
      m.setValue(25, 0, 1);
      m.setValue(60, 0, 2);
      rm = [[0, 25, 60], [0, 10, 0]];
    });
    test('setting a matrix with another p5.MatrixTensor instance', function() {
      let m1 = new p5.MatrixTensor();
      m1.set(m);
      assert.equal(10, m1.matrix[1][1]);
      assert.equal(10, m1.getValue(1, 1));
      assert.equal(25, m1.matrix[0][1]);
      assert.equal(25, m1.getValue(0, 1));
      assert.equal(60, m1.matrix[0][2]);
      assert.equal(60, m1.getValue(0, 2));
    });
    test('setting a matrix with a Number[][]', function() {
      let m1 = new p5.MatrixTensor();
      m1.set(rm);
      assert.equal(10, m1.matrix[1][1]);
      assert.equal(10, m1.getValue(1, 1));
      assert.equal(25, m1.matrix[0][1]);
      assert.equal(25, m1.getValue(0, 1));
      assert.equal(60, m1.matrix[0][2]);
      assert.equal(60, m1.getValue(0, 2));
    });
  });
  suite('p5.MatrixTensor.prototype.transpose()', function() {
    setup(function() {
      m = new p5.MatrixTensor(2, 4);
      m.setValue(125, 1, 1);
      m.setValue(45, 1, 2);
      m.setValue(25, 0, 3);
      m.transpose();
    });
    test('Should be the same matrix but transposed', function() {
      assert.equal(125, m.matrix[1][1]);
      assert.equal(45, m.matrix[2][1]);
      assert.equal(25, m.matrix[3][0]);
    });
    test('Should be the same matrix as the first one after second transpose', function() {
      m.transpose();
      assert.equal(125, m.matrix[1][1]);
      assert.equal(45, m.matrix[1][2]);
      assert.equal(25, m.matrix[0][3]);
    });
  });
  suite('p5.MatrixTensor.transpose()', function() {
    let m1;
    setup(function() {
      m = new p5.MatrixTensor(2, 4);
      m.setValue(125, 1, 1);
      m.setValue(45, 1, 2);
      m.setValue(25, 0, 3);
      m1 = p5.MatrixTensor.transpose(m);
    });
    test('Should be the same matrix but transposed (static)', function() {
      assert.equal(125, m1.matrix[1][1]);
      assert.equal(45, m1.matrix[2][1]);
      assert.equal(25, m1.matrix[3][0]);
      //Original Matrix should not change since we are using static transpose.
      assert.equal(125, m.matrix[1][1]);
      assert.equal(45, m.matrix[1][2]);
      assert.equal(25, m.matrix[0][3]);
    });
  });
});
