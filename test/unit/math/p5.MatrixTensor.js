suite('p5.MatrixTensor', function() {
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
      assert.instanceOf(m1, p5.MatrixTensor);
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
      assert.instanceOf(m, p5.MatrixTensor);
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
  suite('p5.MatrixTensor.prototype.map()', function() {
    setup(function() {
      m = new p5.MatrixTensor(3, 3);
      m.initiate(2);
      m.setValue(4, 1, 1);
      m.setValue(5, 1, 2);
      m.setValue(6, 0, 2);
      m.map(x => x * x);
    });
    test('Should have mapped values', function() {
      assert.instanceOf(m, p5.MatrixTensor);
      assert.equal(16, m.matrix[1][1]);
      assert.equal(25, m.matrix[1][2]);
      assert.equal(36, m.matrix[0][2]);
      assert.equal(4, m.matrix[0][0]);
      assert.equal(4, m.matrix[1][0]);
      assert.equal(4, m.matrix[0][1]);
      assert.equal(4, m.matrix[2][0]);
      assert.equal(4, m.matrix[2][1]);
      assert.equal(4, m.matrix[2][2]);
    });
  });
  suite('p5.MatrixTensor.map()', function() {
    let m1;
    setup(function() {
      m = new p5.MatrixTensor(3, 3);
      m.initiate(2);
      m.setValue(4, 1, 1);
      m.setValue(5, 1, 2);
      m.setValue(6, 0, 2);
      m1 = p5.MatrixTensor.map(m, x => x * x);
    });
    test('Should have mapped values, but not the original matrix (static)', function() {
      //m1 matrix test
      assert.instanceOf(m1, p5.MatrixTensor);
      assert.equal(16, m1.matrix[1][1]);
      assert.equal(25, m1.matrix[1][2]);
      assert.equal(36, m1.matrix[0][2]);
      assert.equal(4, m1.matrix[0][0]);
      assert.equal(4, m1.matrix[1][0]);
      assert.equal(4, m1.matrix[0][1]);
      assert.equal(4, m1.matrix[2][0]);
      assert.equal(4, m1.matrix[2][1]);
      assert.equal(4, m1.matrix[2][2]);
      //m matrix test (should not have changed)
      assert.instanceOf(m, p5.MatrixTensor);
      assert.equal(4, m.matrix[1][1]);
      assert.equal(5, m.matrix[1][2]);
      assert.equal(6, m.matrix[0][2]);
      assert.equal(2, m.matrix[0][0]);
      assert.equal(2, m.matrix[1][0]);
      assert.equal(2, m.matrix[0][1]);
      assert.equal(2, m.matrix[2][0]);
      assert.equal(2, m.matrix[2][1]);
      assert.equal(2, m.matrix[2][2]);
    });
  });
  suite('p5.MatrixTensor.prototype.sub()', function() {
    suite('with Number', function() {
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(3, 0, 1);
        m.setValue(4, 1, 1);
        m.sub(1);
      });
      test('Should have subtracted 1 to values', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(0, m.matrix[0][0]);
        assert.equal(1, m.matrix[1][0]);
        assert.equal(2, m.matrix[0][1]);
        assert.equal(3, m.matrix[1][1]);
      });
    });
    suite('with Matrix', function() {
      let m1;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(3, 0, 1);
        m.setValue(4, 1, 1);
        m1.setValue(1, 0, 0);
        m1.setValue(2, 1, 0);
        m1.setValue(3, 0, 1);
        m1.setValue(4, 1, 1);
        m.sub(m1);
      });
      test('Should have subtracted matrix to matrix values', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(0, m.matrix[0][0]);
        assert.equal(0, m.matrix[1][0]);
        assert.equal(0, m.matrix[0][1]);
        assert.equal(0, m.matrix[1][1]);
        //m1 should not have changed
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(1, m1.matrix[0][0]);
        assert.equal(2, m1.matrix[1][0]);
        assert.equal(3, m1.matrix[0][1]);
        assert.equal(4, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.sub()', function() {
    suite('with Matrix', function() {
      let m1;
      let m2;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(3, 0, 1);
        m.setValue(4, 1, 1);
        m1.setValue(1, 0, 0);
        m1.setValue(2, 1, 0);
        m1.setValue(3, 0, 1);
        m1.setValue(4, 1, 1);
        m2 = p5.MatrixTensor.sub(m, m1);
      });
      test('Should have subtracted matrix to matrix values, but should not affect original matrices (static)', function() {
        //output matrice should have subtracted values.
        assert.instanceOf(m2, p5.MatrixTensor);
        assert.equal(0, m2.matrix[0][0]);
        assert.equal(0, m2.matrix[1][0]);
        assert.equal(0, m2.matrix[0][1]);
        assert.equal(0, m2.matrix[1][1]);
        //should not have changed original matrices
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(1, m.matrix[0][0]);
        assert.equal(2, m.matrix[1][0]);
        assert.equal(3, m.matrix[0][1]);
        assert.equal(4, m.matrix[1][1]);
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(1, m1.matrix[0][0]);
        assert.equal(2, m1.matrix[1][0]);
        assert.equal(3, m1.matrix[0][1]);
        assert.equal(4, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.prototype.add()', function() {
    suite('with Number', function() {
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(3, 0, 1);
        m.setValue(4, 1, 1);
        m.add(1);
      });
      test('Should have added 1 to values', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(2, m.matrix[0][0]);
        assert.equal(3, m.matrix[1][0]);
        assert.equal(4, m.matrix[0][1]);
        assert.equal(5, m.matrix[1][1]);
      });
    });
    suite('with Matrix', function() {
      let m1;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(3, 0, 1);
        m.setValue(4, 1, 1);
        m1.setValue(1, 0, 0);
        m1.setValue(2, 1, 0);
        m1.setValue(3, 0, 1);
        m1.setValue(4, 1, 1);
        m.add(m1);
      });
      test('Should have added matrix to matrix values', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(2, m.matrix[0][0]);
        assert.equal(4, m.matrix[1][0]);
        assert.equal(6, m.matrix[0][1]);
        assert.equal(8, m.matrix[1][1]);
        //m1 should not have changed
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(1, m1.matrix[0][0]);
        assert.equal(2, m1.matrix[1][0]);
        assert.equal(3, m1.matrix[0][1]);
        assert.equal(4, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.add()', function() {
    suite('with Matrix', function() {
      let m1;
      let m2;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(3, 0, 1);
        m.setValue(4, 1, 1);
        m1.setValue(1, 0, 0);
        m1.setValue(2, 1, 0);
        m1.setValue(3, 0, 1);
        m1.setValue(4, 1, 1);
        m2 = p5.MatrixTensor.add(m, m1);
      });
      test('Should have added matrix to matrix values, but should not affect original matrices (static)', function() {
        //output matrice should have subtracted values.
        assert.instanceOf(m2, p5.MatrixTensor);
        assert.equal(2, m2.matrix[0][0]);
        assert.equal(4, m2.matrix[1][0]);
        assert.equal(6, m2.matrix[0][1]);
        assert.equal(8, m2.matrix[1][1]);
        //should not have changed original matrices
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(1, m.matrix[0][0]);
        assert.equal(2, m.matrix[1][0]);
        assert.equal(3, m.matrix[0][1]);
        assert.equal(4, m.matrix[1][1]);
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(1, m1.matrix[0][0]);
        assert.equal(2, m1.matrix[1][0]);
        assert.equal(3, m1.matrix[0][1]);
        assert.equal(4, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.prototype.div()', function() {
    suite('with Number', function() {
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(4, 0, 1);
        m.setValue(5, 1, 1);
        m.div(2);
      });
      test('Should have divided values by 2', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(0.5, m.matrix[0][0]);
        assert.equal(1, m.matrix[1][0]);
        assert.equal(2, m.matrix[0][1]);
        assert.equal(2.5, m.matrix[1][1]);
      });
    });
    suite('with Matrix', function() {
      let m1;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(2, 0, 1);
        m.setValue(4, 1, 1);
        m1.setValue(2, 0, 0);
        m1.setValue(4, 1, 0);
        m1.setValue(1, 0, 1);
        m1.setValue(8, 1, 1);
        m.div(m1);
      });
      test('Should have divided a matrix to matrix values', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(0.5, m.matrix[0][0]);
        assert.equal(0.5, m.matrix[1][0]);
        assert.equal(2, m.matrix[0][1]);
        assert.equal(0.5, m.matrix[1][1]);
        //m1 should not have changed
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(2, m1.matrix[0][0]);
        assert.equal(4, m1.matrix[1][0]);
        assert.equal(1, m1.matrix[0][1]);
        assert.equal(8, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.div()', function() {
    suite('with Matrix', function() {
      let m1;
      let m2;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(8, 0, 1);
        m.setValue(4, 1, 1);
        m1.setValue(8, 0, 0);
        m1.setValue(8, 1, 0);
        m1.setValue(2, 0, 1);
        m1.setValue(4, 1, 1);
        m2 = p5.MatrixTensor.div(m, m1);
      });
      test('Should have divided a matrix to matrix values, but should not affect original matrices (static)', function() {
        //output matrix should have subtracted values.
        assert.instanceOf(m2, p5.MatrixTensor);
        assert.equal(0.125, m2.matrix[0][0]);
        assert.equal(0.25, m2.matrix[1][0]);
        assert.equal(4, m2.matrix[0][1]);
        assert.equal(1, m2.matrix[1][1]);
        //should not have changed original matrices
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(1, m.matrix[0][0]);
        assert.equal(2, m.matrix[1][0]);
        assert.equal(8, m.matrix[0][1]);
        assert.equal(4, m.matrix[1][1]);
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(8, m1.matrix[0][0]);
        assert.equal(8, m1.matrix[1][0]);
        assert.equal(2, m1.matrix[0][1]);
        assert.equal(4, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.prototype.mult()', function() {
    suite('with Number', function() {
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(4, 0, 1);
        m.setValue(5, 1, 1);
        m.mult(2);
      });
      test('Should have multiplied values by 2', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(2, m.matrix[0][0]);
        assert.equal(4, m.matrix[1][0]);
        assert.equal(8, m.matrix[0][1]);
        assert.equal(10, m.matrix[1][1]);
      });
    });
    suite('with Matrix', function() {
      let m1;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(4, 0, 1);
        m.setValue(4, 1, 1);
        m1.setValue(2, 0, 0);
        m1.setValue(4, 1, 0);
        m1.setValue(16, 0, 1);
        m1.setValue(8, 1, 1);
        m.mult(m1);
      });
      test('Should have multiplied a matrix to matrix values', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(2, m.matrix[0][0]);
        assert.equal(8, m.matrix[1][0]);
        assert.equal(64, m.matrix[0][1]);
        assert.equal(32, m.matrix[1][1]);
        //m1 should not have changed
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(2, m1.matrix[0][0]);
        assert.equal(4, m1.matrix[1][0]);
        assert.equal(16, m1.matrix[0][1]);
        assert.equal(8, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.mult()', function() {
    suite('with Matrix', function() {
      let m1;
      let m2;
      setup(function() {
        m = new p5.MatrixTensor(2, 2);
        m1 = new p5.MatrixTensor(2, 2);
        m.setValue(1, 0, 0);
        m.setValue(2, 1, 0);
        m.setValue(8, 0, 1);
        m.setValue(6, 1, 1);
        m1.setValue(8, 0, 0);
        m1.setValue(8, 1, 0);
        m1.setValue(7, 0, 1);
        m1.setValue(4, 1, 1);
        m2 = p5.MatrixTensor.mult(m, m1);
      });
      test('Should have multiplied a matrix to matrix values, but should not affect original matrices (static)', function() {
        //output matrice should have subtracted values.
        assert.instanceOf(m2, p5.MatrixTensor);
        assert.equal(8, m2.matrix[0][0]);
        assert.equal(16, m2.matrix[1][0]);
        assert.equal(56, m2.matrix[0][1]);
        assert.equal(24, m2.matrix[1][1]);
        //should not have changed original matrices
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(1, m.matrix[0][0]);
        assert.equal(2, m.matrix[1][0]);
        assert.equal(8, m.matrix[0][1]);
        assert.equal(6, m.matrix[1][1]);
        assert.instanceOf(m1, p5.MatrixTensor);
        assert.equal(8, m1.matrix[0][0]);
        assert.equal(8, m1.matrix[1][0]);
        assert.equal(7, m1.matrix[0][1]);
        assert.equal(4, m1.matrix[1][1]);
      });
    });
  });
  suite('p5.MatrixTensor.prototype.dot()', function() {
    let a;
    let b;
    setup(function() {
      a = new p5.MatrixTensor(3, 3);
      a.set([[1, 2, 1], [0, 1, 0], [2, 3, 4]]);
      b = new p5.MatrixTensor(3, 2);
      b.set([[2, 5], [6, 7], [1, 8]]);
      a.dot(b);
    });
    test('Should output the dot product', function() {
      assert.instanceOf(a, p5.MatrixTensor);
      //Checking a dimensions
      assert.equal(3, a.cols);
      assert.equal(2, a.rows);
      //Checking a values
      assert.equal(15, a.matrix[0][0]);
      assert.equal(27, a.matrix[0][1]);
      assert.equal(6, a.matrix[1][0]);
      assert.equal(7, a.matrix[1][1]);
      assert.equal(26, a.matrix[2][0]);
      assert.equal(63, a.matrix[2][1]);
      //Checking if b has changed
      //Checking b dimensions
      assert.equal(3, b.cols);
      assert.equal(2, b.rows);
      //Checking b values
      assert.equal(2, b.matrix[0][0]);
      assert.equal(5, b.matrix[0][1]);
      assert.equal(6, b.matrix[1][0]);
      assert.equal(7, b.matrix[1][1]);
      assert.equal(1, b.matrix[2][0]);
      assert.equal(8, b.matrix[2][1]);
    });
  });
  suite('p5.MatrixTensor.dot()', function() {
    let a;
    let b;
    let c;
    setup(function() {
      a = new p5.MatrixTensor(3, 3);
      a.set([[1, 2, 1], [0, 1, 0], [2, 3, 4]]);
      b = new p5.MatrixTensor(3, 2);
      b.set([[2, 5], [6, 7], [1, 8]]);
      c = p5.MatrixTensor.dot(a, b);
    });
    test('Should output the dot product', function() {
      assert.instanceOf(a, p5.MatrixTensor);
      //Checking c dimensions
      assert.equal(3, c.cols);
      assert.equal(2, c.rows);
      //Checking c values
      assert.equal(15, c.matrix[0][0]);
      assert.equal(27, c.matrix[0][1]);
      assert.equal(6, c.matrix[1][0]);
      assert.equal(7, c.matrix[1][1]);
      assert.equal(26, c.matrix[2][0]);
      assert.equal(63, c.matrix[2][1]);
      //Original matrices should not have changed
      //Checking a dimensions
      assert.equal(3, a.cols);
      assert.equal(3, a.rows);
      //Checking a values
      assert.equal(1, a.matrix[0][0]);
      assert.equal(2, a.matrix[0][1]);
      assert.equal(1, a.matrix[0][2]);
      assert.equal(0, a.matrix[1][0]);
      assert.equal(1, a.matrix[1][1]);
      assert.equal(0, a.matrix[1][2]);
      assert.equal(2, a.matrix[2][0]);
      assert.equal(3, a.matrix[2][1]);
      assert.equal(4, a.matrix[2][2]);
      //Checking b dimensions
      assert.equal(3, b.cols);
      assert.equal(2, b.rows);
      //Checking b values
      assert.equal(2, b.matrix[0][0]);
      assert.equal(5, b.matrix[0][1]);
      assert.equal(6, b.matrix[1][0]);
      assert.equal(7, b.matrix[1][1]);
      assert.equal(1, b.matrix[2][0]);
      assert.equal(8, b.matrix[2][1]);
    });
  });
  suite('p5.MatrixTensor.prototype.identity()', function() {
    let m;
    suite('with 4 by 4 matrix', function() {
      setup(function() {
        m = new p5.MatrixTensor(4, 4);
        m.identity();
      });
      test('Should have initiated a 4 by 4 identity matrix', function() {
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(1, m.matrix[0][0]);
        assert.equal(0, m.matrix[0][1]);
        assert.equal(0, m.matrix[0][2]);
        assert.equal(0, m.matrix[0][3]);
        assert.equal(0, m.matrix[1][0]);
        assert.equal(1, m.matrix[1][1]);
        assert.equal(0, m.matrix[1][2]);
        assert.equal(0, m.matrix[1][3]);
        assert.equal(0, m.matrix[2][0]);
        assert.equal(0, m.matrix[2][1]);
        assert.equal(1, m.matrix[2][2]);
        assert.equal(0, m.matrix[2][3]);
        assert.equal(0, m.matrix[3][0]);
        assert.equal(0, m.matrix[3][1]);
        assert.equal(0, m.matrix[3][2]);
        assert.equal(1, m.matrix[3][3]);
      });
    });
    suite('white non-square matrix (should return undefined)', function() {
      let out;
      setup(function() {
        m = new p5.MatrixTensor(2, 4);
        out = m.identity();
      });
      test('Should have returned undefined & not changed the original matrix', function() {
        assert.equal(out, undefined);
        //Original matrix should have stayed the same.
        assert.instanceOf(m, p5.MatrixTensor);
        assert.equal(0, m.matrix[0][0]);
        assert.equal(0, m.matrix[0][1]);
        assert.equal(0, m.matrix[0][2]);
        assert.equal(0, m.matrix[0][3]);
        assert.equal(0, m.matrix[1][0]);
        assert.equal(0, m.matrix[1][1]);
        assert.equal(0, m.matrix[1][2]);
        assert.equal(0, m.matrix[1][3]);
      });
    });
  });
  suite('p5.MatrixTensor.prototype.initiate()', function() {
    let m;
    setup(function() {
      m = new p5.MatrixTensor(2, 2);
      m.initiate(5);
    });
    test('Should have initiated all the 2 by 2 matrix values to 5', function() {
      assert.instanceOf(m, p5.MatrixTensor);
      assert.equal(5, m.matrix[0][0]);
      assert.equal(5, m.matrix[0][1]);
      assert.equal(5, m.matrix[1][1]);
      assert.equal(5, m.matrix[1][0]);
    });
  });
});
