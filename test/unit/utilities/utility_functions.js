import { mockP5, mockP5Prototype } from '../../js/mocks';
import stringFunctions from '../../../src/utilities/string_functions';
import random from '../../../src/math/random';

suite('String functions', function() {
  beforeAll(function() {
    stringFunctions(mockP5, mockP5Prototype);
    random(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.nf', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.nf);
    });

    test('should return correct string', function() {
      var num = 1234;
      const result = mockP5Prototype.nf(num, 3);
      assert.equal(result, '1234');
    });

    test('should return correct string', function() {
      var num = 1234;
      const result = mockP5Prototype.nf(num, 5);
      assert.equal(result, '01234');
    });

    test('should return correct string', function() {
      var num = 1234;
      const result = mockP5Prototype.nf(num, 3, 3);
      assert.equal(result, '1234.000');
    });

    test('should return correct string', function() {
      var num = 3.141516;
      const result = mockP5Prototype.nf(num, '2'); // automatic conversion?
      assert.equal(result, '03.141516');
    });

    test('should return correct string', function() {
      var num = 3.141516;
      const result = mockP5Prototype.nf(num, '2', '2'); // automatic conversion?
      assert.equal(result, '03.14');
    });

    test('should return correct string', function() {
      var num = 3.141516e-2;
      const result = mockP5Prototype.nf(num, '3', '4'); // automatic conversion?
      assert.equal(result, '000.0314');
    });

    test('should return correct string', function() {
      var num = 3.141516e7;
      const result = mockP5Prototype.nf(num, '3', '4'); // automatic conversion?
      assert.equal(result, '31415160.0000');
    });

    test('should return correct string', function() {
      var num = 123.45;
      const result = mockP5Prototype.nf(num, 3, 0);
      assert.equal(result, '123');
    });

    test('should return correct string', function() {
      var num = -123;
      const result = mockP5Prototype.nf(num, 5);
      assert.equal(result, '-00123');
    });
  });

  suite('p5.prototype.nfc', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.nfc);
    });

    test('should return correct string', function() {
      var num = 32000;
      const result = mockP5Prototype.nfc(num, 3);
      assert.equal(result, '32,000.000');
    });

    test('should return correct string', function() {
      var num = 32000;
      const result = mockP5Prototype.nfc(num, '3'); // automatic conversion?
      assert.equal(result, '32,000.000');
    });
  });

  suite('p5.prototype.nfp', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.nfp);
    });

    test('should return correct string', function() {
      var num = -32000;
      const result = mockP5Prototype.nfp(num, 3);
      assert.equal(result, '-32000');
    });

    test('should return correct string', function() {
      var num = 32000;
      const result = mockP5Prototype.nfp(num, 3); // automatic conversion?
      assert.equal(result, '+32000');
    });
  });

  suite('p5.prototype.nfs', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.nfs);
    });

    test('should return correct string', function() {
      var num = -32000;
      const result = mockP5Prototype.nfs(num, 3);
      assert.equal(result, '-32000');
    });

    test('should return correct string', function() {
      var num = 32000;
      const result = mockP5Prototype.nfs(num, 3); // automatic conversion?
      assert.equal(result, ' 32000');
    });
  });

  suite('p5.prototype.splitTokens', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.splitTokens);
    });

    test('should return correct index of match strings', function() {
      var str = 'parsely, sage, rosemary, thyme';
      var regexp = ',';
      const result = mockP5Prototype.splitTokens(str, regexp);
      assert.equal(result.length, 4);
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
});
