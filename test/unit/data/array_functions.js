suite('Array', function() {

    var result;

    suite('p5.prototype.append', function() {
      var append = p5.prototype.append;
      suite('append()', function() {
        test('should be a function', function() {
            assert.ok(append);
            assert.typeOf(append, 'function');
        });
        test('should return an array with appended value', function() {
            result = append([], 1);
            assert.typeOf(result, 'Array');
            assert.deepEqual(result, [1]);
        });
      });
    });

    suite('p5.prototype.arrayCopy', function() {
      var arrayCopy = p5.prototype.arrayCopy;
      var src, dest;
      setup(function() {
        src = [1, 2, 3, 4, 5];
        dest = [6, 7, 8];
      });
      suite('arrayCopy()', function() {

        test('should be a function', function() {
          assert.ok(arrayCopy);
          assert.typeOf(arrayCopy, 'function');
        });

        suite('src, dst', function() {

          test('should return fully copied array', function() {
            arrayCopy(src, dest);
            assert.deepEqual(dest, src);
          });

        });

        suite('src, dst, len', function() {

          test('should return an array with first 2 elements copied over', function() {
            arrayCopy(src, dest, 2);
            assert.deepEqual(dest, [1, 2, 8]);
          });

          test('should return an array with first 4 elements copied over', function() {
              arrayCopy(src, dest, 4);
              assert.deepEqual(dest, [1, 2, 3, 4]);
          });

        });

        suite('src, srcPosition, dst, dstPosition, length',function() {

          // src[1 - 2] is src[1] and src[2]
          test('should copy src[1 - 2] to dst[0 - 1]', function() {
              arrayCopy(src, 1, dest, 0, 2);
              assert.deepEqual(dest, [2, 3, 8]);
          });

          test('should copy src[1 - 2] to dst [1 - 2]', function() {
              arrayCopy(src, 1, dest, 1, 2);
              assert.deepEqual(dest, [6, 2, 3]);
          });

          test('should copy src[3 - 4] to dst[0 - 1]', function() {
              arrayCopy(src, 3, dest, 0, 2);
              assert.deepEqual(dest, [4, 5, 8]);
          });
        });

      });

    });

    suite('p5.prototype.concat', function() {
      var concat = p5.prototype.concat;

      suite('concat()', function() {

        test('should concat empty arrays', function() {
          result = concat([], []);
          assert.deepEqual(result, []);
        });

        test('should concat arrays', function() {
          result = concat([1], [2, 3]);
          assert.deepEqual(result, [1, 2, 3]);
        });

      });

    });

    suite('p5.prototype.reverse', function() {
      var reverse = p5.prototype.reverse;

      suite('reverse()', function() {

        test('should reverse empty array', function() {
          result = reverse([]);
          assert.deepEqual(result, []);
        });

        test('should reverse array', function() {
          result = reverse([1, 2, 3]);
          assert.deepEqual(result, [3, 2, 1]);
        });

      });
    });

    suite('p5.prototype.shorten', function() {
      var shorten = p5.prototype.shorten;

      suite('shorten()', function() {

        test('should not have error for shortening empty array', function() {
          result = shorten([]);
          assert.deepEqual(result, []);
        });

        test('should shorten array', function() {
          result = shorten([1, 2, 3]);
          assert.deepEqual(result, [1, 2]);
        });

      });
    });

    suite('p5.prototype.sort', function() {
      var sort = p5.prototype.sort;

      suite('sort()', function() {

        test('should not have error for sorting empty array', function() {
          result = sort([]);
          assert.deepEqual(result, []);
        });

        test('should sort alphabetic array lexicographically', function() {
          result = sort(['c', 'b', 'a']);
          assert.deepEqual(result, ['a', 'b', 'c']);
        });

        test('should sort numerical array from smallest to largest', function() {
          result = sort([2, 1, 11]);
          assert.deepEqual(result, [1, 2, 11]);
        });

        test('should sort numerical array from smallest to largest for only first 2 elements', function() {
          result = sort([3, 1, 2, 0], 2);
          assert.deepEqual(result, [1, 3, 2, 0]);
        });

      });
    });

    suite('p5.prototype.splice', function() {
      var splice = p5.prototype.splice;

      suite('splice()', function() {

        test('should insert 4 into position 1', function() {
          result = splice([1, 2, 3], 4 , 1);
          assert.deepEqual(result, [1, 4, 2, 3]);
        });

        test('should splice in array of values', function() {
          result = splice([1, 2, 3], [4, 5] , 1);
          assert.deepEqual(result, [1, 4, 5, 2, 3]);
        });

      });
    });

    suite('p5.prototype.subset', function() {
      var subset = p5.prototype.subset;

      suite('subset()', function() {

        test('should get subset from index 1 to end', function() {
          result = subset([1, 2, 3], 1);
          assert.deepEqual(result, [2, 3]);
        });

        test('should subset arr[1 - 2]', function() {
          result = subset([1, 2, 3, 4], 1, 2);
          assert.deepEqual(result, [2, 3]);
        });

      });
    });

});
