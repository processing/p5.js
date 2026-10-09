import { mockP5, mockP5Prototype } from '../../js/mocks';
import stringFunctions from '../../../src/utilities/utility_functions';
import random from '../../../src/math/random';

suite('String functions', function () {
  beforeAll(function () {
    stringFunctions(mockP5, mockP5Prototype);
    random(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.nf', function () {
    test('should be a function', function () {
      assert.ok(mockP5Prototype.nf);
    });

    test('should return correct string', function () {
      var num = 1234;
      const result = mockP5Prototype.nf(num, 3);
      assert.equal(result, '1234');
    });

    test('should return correct string', function () {
      var num = 1234;
      const result = mockP5Prototype.nf(num, 5);
      assert.equal(result, '01234');
    });

    test('should return correct string', function () {
      var num = 1234;
      const result = mockP5Prototype.nf(num, 3, 3);
      assert.equal(result, '1234.000');
    });

    test('should return correct string', function () {
      var num = 3.141516;
      const result = mockP5Prototype.nf(num, '2'); // automatic conversion?
      assert.equal(result, '03.141516');
    });

    test('should return correct string', function () {
      var num = 3.141516;
      const result = mockP5Prototype.nf(num, '2', '2'); // automatic conversion?
      assert.equal(result, '03.14');
    });

    test('should return correct string', function () {
      var num = 3.141516e-2;
      const result = mockP5Prototype.nf(num, '3', '4'); // automatic conversion?
      assert.equal(result, '000.0314');
    });

    test('should return correct string', function () {
      var num = 3.141516e7;
      const result = mockP5Prototype.nf(num, '3', '4'); // automatic conversion?
      assert.equal(result, '31415160.0000');
    });

    test('should return correct string', function () {
      var num = 123.45;
      const result = mockP5Prototype.nf(num, 3, 0);
      assert.equal(result, '123');
    });

    test('should return correct string', function () {
      var num = -123;
      const result = mockP5Prototype.nf(num, 5);
      assert.equal(result, '-00123');
    });
  });

  suite('p5.prototype.nfc', function () {
    test('should be a function', function () {
      assert.ok(mockP5Prototype.nfc);
    });

    test('should return correct string', function () {
      var num = 32000;
      const result = mockP5Prototype.nfc(num, 3);
      assert.equal(result, '32,000.000');
    });

    test('should return correct string', function () {
      var num = 32000;
      const result = mockP5Prototype.nfc(num, '3'); // automatic conversion?
      assert.equal(result, '32,000.000');
    });

    test('should round when right is smaller than the decimals present', function () {
      assert.equal(mockP5Prototype.nfc(12345.67, 1), '12,345.7');
      assert.equal(mockP5Prototype.nfc(12345.649, 2), '12,345.65');
    });

    test('should pad when right is larger than the decimals present', function () {
      assert.equal(mockP5Prototype.nfc(12345.67, 3), '12,345.670');
      assert.equal(mockP5Prototype.nfc(12345.6, 2), '12,345.60');
    });

    test('should keep the sign when padding or rounding', function () {
      assert.equal(mockP5Prototype.nfc(-12345.6, 2), '-12,345.60');
      assert.equal(mockP5Prototype.nfc(-12345.67, 1), '-12,345.7');
    });

    test('should drop the decimals when right is 0', function () {
      assert.equal(mockP5Prototype.nfc(12345.67, 0), '12,346');
      assert.equal(mockP5Prototype.nfc(12345.4, 0), '12,345');
    });

    test('should format each entry of an array', function () {
      assert.deepEqual(mockP5Prototype.nfc([12345.67, 8.9], 2), [
        '12,345.67',
        '8.90'
      ]);
    });
  });

  suite('p5.prototype.nfp', function () {
    test('should be a function', function () {
      assert.ok(mockP5Prototype.nfp);
    });

    test('should return correct string', function () {
      var num = -32000;
      const result = mockP5Prototype.nfp(num, 3);
      assert.equal(result, '-32000');
    });

    test('should return correct string', function () {
      var num = 32000;
      const result = mockP5Prototype.nfp(num, 3); // automatic conversion?
      assert.equal(result, '+32000');
    });
  });

  suite('p5.prototype.nfs', function () {
    test('should be a function', function () {
      assert.ok(mockP5Prototype.nfs);
    });

    test('should return correct string', function () {
      var num = -32000;
      const result = mockP5Prototype.nfs(num, 3);
      assert.equal(result, '-32000');
    });

    test('should return correct string', function () {
      var num = 32000;
      const result = mockP5Prototype.nfs(num, 3); // automatic conversion?
      assert.equal(result, ' 32000');
    });
  });

  suite('p5.prototype.splitTokens', function () {
    test('should be a function', function () {
      assert.ok(mockP5Prototype.splitTokens);
    });

    test('should return correct index of match strings', function () {
      var str = 'parsely, sage, rosemary, thyme';
      var regexp = ',';
      const result = mockP5Prototype.splitTokens(str, regexp);
      assert.equal(result.length, 4);
    });
  });

  suite('p5.prototype.shuffle', function () {
    test('should contain all the elements of the original array', function () {
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

    test('should not modify regular array by default', function () {
      const original = [1, 2, 3, 4, 5, 6, 7, 8];
      const copy = [...original];
      const result = mockP5Prototype.shuffle(original);
      assert.notStrictEqual(result, original);
      assert.deepEqual(original, copy);
      assert.strictEqual(result.length, original.length);
    });

    test('should modify regular array in place when modify is true', function () {
      const original = [1, 2, 3, 4, 5, 6, 7, 8];
      const result = mockP5Prototype.shuffle(original, true);
      assert.strictEqual(result, original);
    });

    test('should not modify typed array by default and return a copy', function () {
      const original = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
      const initialCopy = Array.from(original);
      const result = mockP5Prototype.shuffle(original);
      assert.instanceOf(result, Float32Array);
      assert.notStrictEqual(result, original);
      assert.deepEqual(Array.from(original), initialCopy);
      assert.strictEqual(result.length, original.length);
      assert.deepEqual(Array.from(result).sort(), initialCopy.sort());
    });

    test('should modify typed array in place when modify is true', function () {
      const original = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
      const result = mockP5Prototype.shuffle(original, true);
      assert.instanceOf(result, Float32Array);
      assert.strictEqual(result, original);
    });
  });
});
