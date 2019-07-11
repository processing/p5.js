suite('Array', function() {
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

  var result;

  suite('p5.prototype.append', function() {
    test('should be a function', function() {
      assert.ok(myp5.append);
      assert.typeOf(myp5.append, 'function');
    });
    test('should return an array with appended value', function() {
      result = myp5.append([], 1);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [1]);
    });
  });

  suite('p5.prototype.arrayCopy', function() {
    var src, dest;
    setup(function() {
      src = [1, 2, 3, 4, 5];
      dest = [6, 7, 8];
    });

    test('should be a function', function() {
      assert.ok(myp5.arrayCopy);
      assert.typeOf(myp5.arrayCopy, 'function');
    });

    suite('src, dst', function() {
      test('should return fully copied array', function() {
        myp5.arrayCopy(src, dest);
        assert.deepEqual(dest, src);
      });
    });

    suite('src, dst, len', function() {
      test('should return an array with first 2 elements copied over', function() {
        myp5.arrayCopy(src, dest, 2);
        assert.deepEqual(dest, [1, 2, 8]);
      });

      test('should return an array with first 4 elements copied over', function() {
        myp5.arrayCopy(src, dest, 4);
        assert.deepEqual(dest, [1, 2, 3, 4]);
      });
    });

    suite('src, srcPosition, dst, dstPosition, length', function() {
      // src[1 - 2] is src[1] and src[2]
      test('should copy src[1 - 2] to dst[0 - 1]', function() {
        myp5.arrayCopy(src, 1, dest, 0, 2);
        assert.deepEqual(dest, [2, 3, 8]);
      });

      test('should copy src[1 - 2] to dst [1 - 2]', function() {
        myp5.arrayCopy(src, 1, dest, 1, 2);
        assert.deepEqual(dest, [6, 2, 3]);
      });

      test('should copy src[3 - 4] to dst[0 - 1]', function() {
        myp5.arrayCopy(src, 3, dest, 0, 2);
        assert.deepEqual(dest, [4, 5, 8]);
      });
    });
  });

  suite('p5.prototype.concat', function() {
    test('should concat empty arrays', function() {
      result = myp5.concat([], []);
      assert.deepEqual(result, []);
    });

    test('should concat arrays', function() {
      result = myp5.concat([1], [2, 3]);
      assert.deepEqual(result, [1, 2, 3]);
    });
  });

  suite('p5.prototype.reverse', function() {
    test('should reverse empty array', function() {
      result = myp5.reverse([]);
      assert.deepEqual(result, []);
    });

    test('should reverse array', function() {
      result = myp5.reverse([1, 2, 3]);
      assert.deepEqual(result, [3, 2, 1]);
    });
  });

  suite('p5.prototype.shorten', function() {
    test('should not have error for shortening empty array', function() {
      result = myp5.shorten([]);
      assert.deepEqual(result, []);
    });

    test('should shorten array', function() {
      result = myp5.shorten([1, 2, 3]);
      assert.deepEqual(result, [1, 2]);
    });
  });

  suite('p5.prototype.shuffle', function() {
    test('should contain all the elements of the original array', function() {
      let regularArr = ['ABC', 'def', myp5.createVector(), myp5.TAU, Math.E];
      let newArr = myp5.shuffle(regularArr);
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
      result = myp5.sort([]);
      assert.deepEqual(result, []);
    });

    test('should sort alphabetic array lexicographically', function() {
      result = myp5.sort(['c', 'b', 'a']);
      assert.deepEqual(result, ['a', 'b', 'c']);
    });

    test('should sort numerical array from smallest to largest', function() {
      result = myp5.sort([2, 1, 11]);
      assert.deepEqual(result, [1, 2, 11]);
    });

    test('should sort numerical array from smallest to largest for only first 2 elements', function() {
      result = myp5.sort([3, 1, 2, 0], 2);
      assert.deepEqual(result, [1, 3, 2, 0]);
    });
  });

  suite('p5.prototype.splice', function() {
    test('should insert 4 into position 1', function() {
      result = myp5.splice([1, 2, 3], 4, 1);
      assert.deepEqual(result, [1, 4, 2, 3]);
    });

    test('should splice in array of values', function() {
      result = myp5.splice([1, 2, 3], [4, 5], 1);
      assert.deepEqual(result, [1, 4, 5, 2, 3]);
    });
  });

  suite('p5.prototype.subset', function() {
    test('should get subset from index 1 to end', function() {
      result = myp5.subset([1, 2, 3], 1);
      assert.deepEqual(result, [2, 3]);
    });

    test('should subset arr[1 - 2]', function() {
      result = myp5.subset([1, 2, 3, 4], 1, 2);
      assert.deepEqual(result, [2, 3]);
    });
  });
});
