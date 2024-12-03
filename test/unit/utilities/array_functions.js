import { mockP5, mockP5Prototype } from '../../js/mocks';
import arrayFunctions from '../../../src/utilities/array_functions';
import random from '../../../src/math/random';

suite('Array', function() {
  beforeAll(function() {
    arrayFunctions(mockP5, mockP5Prototype);
    random(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.append', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.append);
      assert.typeOf(mockP5Prototype.append, 'function');
    });

    test('should return an array with appended value', function() {
      const result = mockP5Prototype.append([], 1);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [1]);
    });
  });

  suite('p5.prototype.arrayCopy', function() {
    let src, dest;
    beforeEach(function() {
      src = [1, 2, 3, 4, 5];
      dest = [6, 7, 8];
    });

    test('should be a function', function() {
      assert.ok(mockP5Prototype.arrayCopy);
      assert.typeOf(mockP5Prototype.arrayCopy, 'function');
    });

    suite('src, dst', function() {
      test('should return fully copied array', function() {
        mockP5Prototype.arrayCopy(src, dest);
        assert.deepEqual(dest, src);
      });
    });

    suite('src, dst, len', function() {
      test('should return an array with first 2 elements copied over', function() {
        mockP5Prototype.arrayCopy(src, dest, 2);
        assert.deepEqual(dest, [1, 2, 8]);
      });

      test('should return an array with first 4 elements copied over', function() {
        mockP5Prototype.arrayCopy(src, dest, 4);
        assert.deepEqual(dest, [1, 2, 3, 4]);
      });
    });

    suite('src, srcPosition, dst, dstPosition, length', function() {
      // src[1 - 2] is src[1] and src[2]
      test('should copy src[1 - 2] to dst[0 - 1]', function() {
        mockP5Prototype.arrayCopy(src, 1, dest, 0, 2);
        assert.deepEqual(dest, [2, 3, 8]);
      });

      test('should copy src[1 - 2] to dst [1 - 2]', function() {
        mockP5Prototype.arrayCopy(src, 1, dest, 1, 2);
        assert.deepEqual(dest, [6, 2, 3]);
      });

      test('should copy src[3 - 4] to dst[0 - 1]', function() {
        mockP5Prototype.arrayCopy(src, 3, dest, 0, 2);
        assert.deepEqual(dest, [4, 5, 8]);
      });
    });
  });

  suite('p5.prototype.concat', function() {
    test('should concat empty arrays', function() {
      const result = mockP5Prototype.concat([], []);
      assert.deepEqual(result, []);
    });

    test('should concat arrays', function() {
      const result = mockP5Prototype.concat([1], [2, 3]);
      assert.deepEqual(result, [1, 2, 3]);
    });
  });

  suite('p5.prototype.reverse', function() {
    test('should reverse empty array', function() {
      const result = mockP5Prototype.reverse([]);
      assert.deepEqual(result, []);
    });

    test('should reverse array', function() {
      const result = mockP5Prototype.reverse([1, 2, 3]);
      assert.deepEqual(result, [3, 2, 1]);
    });
  });

  suite('p5.prototype.shorten', function() {
    test('should not have error for shortening empty array', function() {
      const result = mockP5Prototype.shorten([]);
      assert.deepEqual(result, []);
    });

    test('should shorten array', function() {
      const result = mockP5Prototype.shorten([1, 2, 3]);
      assert.deepEqual(result, [1, 2]);
    });
  });

  suite('p5.prototype.shuffle', function() {
    test('should contain all the elements of the original array', function() {
      let regularArr = ['ABC', 'def', {}, Math.PI * 2, Math.E];
      let newArr = mockP5Prototype.shuffle(regularArr);
      let flag = true;
      for (let i = 0; i < regularArr.length; i++) {
        if (!newArr.includes(regularArr[i])) {
          flag = false;
          break;
        }
      }
      assert.isArray(newArr);
      assert.strictEqual(newArr.length, regularArr.length);
      assert.strictEqual(flag, true);
    });
  });

  suite('p5.prototype.sort', function() {
    test('should not have error for sorting empty array', function() {
      const result = mockP5Prototype.sort([]);
      assert.deepEqual(result, []);
    });

    test('should sort alphabetic array lexicographically', function() {
      const result = mockP5Prototype.sort(['c', 'b', 'a']);
      assert.deepEqual(result, ['a', 'b', 'c']);
    });

    test('should sort numerical array from smallest to largest', function() {
      const result = mockP5Prototype.sort([2, 1, 11]);
      assert.deepEqual(result, [1, 2, 11]);
    });

    test('should sort numerical array from smallest to largest for only first 2 elements', function() {
      const result = mockP5Prototype.sort([3, 1, 2, 0], 2);
      assert.deepEqual(result, [1, 3, 2, 0]);
    });
  });

  suite('p5.prototype.splice', function() {
    test('should insert 4 into position 1', function() {
      const result = mockP5Prototype.splice([1, 2, 3], 4, 1);
      assert.deepEqual(result, [1, 4, 2, 3]);
    });

    test('should splice in array of values', function() {
      const result = mockP5Prototype.splice([1, 2, 3], [4, 5], 1);
      assert.deepEqual(result, [1, 4, 5, 2, 3]);
    });
  });

  suite('p5.prototype.subset', function() {
    test('should get subset from index 1 to end', function() {
      const result = mockP5Prototype.subset([1, 2, 3], 1);
      assert.deepEqual(result, [2, 3]);
    });

    test('should subset arr[1 - 2]', function() {
      const result = mockP5Prototype.subset([1, 2, 3, 4], 1, 2);
      assert.deepEqual(result, [2, 3]);
    });
  });
});
