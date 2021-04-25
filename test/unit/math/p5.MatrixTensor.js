import { assert } from 'chai';

suite('p5.MatrixTensor', function() {
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
  suite('p5.MatrixTensor', function() {
    suite('p5.MatrixTensor.make()', function() {
      setup(function() {
        rm = myp5.MatrixTensor.make();
      });
      test('should create a 0 by 0 number[][]', function() {
        assert.equals(rm, [[]]);
        assert.equals(0, rm[0].length);
      });
    });
    suite('p5.MatrixTensor.make(3, 4)', function() {
      setup(function() {
        rm = myp5.MatrixTensor.make(3, 4);
      });
      test('should create instance of p5.MatrixTensor', function() {
        assert.equals(rm, [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
        assert.equals(3, rm.length);
        assert.equals(4, rm[0].length);
      });
    });
  });
});
