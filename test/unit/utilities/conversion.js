import { mockP5, mockP5Prototype } from '../../js/mocks';
import conversion from '../../../src/utilities/conversion';

suite('Conversion', function() {
  beforeAll(function() {
    conversion(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.float', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.float);
      assert.typeOf(mockP5Prototype.float, 'function');
    });

    test('should convert a string to its floating point representation', function() {
      const result = mockP5Prototype.float('56.99998');
      assert.typeOf(result, 'Number');
      assert.strictEqual(result, 56.99998);
    });

    test('should return NaN for invalid string', function() {
      const result = mockP5Prototype.float('cat');
      assert.isNaN(result);
    });

    test('should return Infinity for Infinity', function() {
      const result = mockP5Prototype.float(Infinity);
      assert.strictEqual(result, Infinity);
    });

    test('should return -Infinity for -Infinity', function() {
      const result = mockP5Prototype.float(-Infinity);
      assert.strictEqual(result, -Infinity);
    });

    test('should return array of floating points and Nan', function() {
      const result = mockP5Prototype.float(['1', '2.0', '3.1', 'giraffe']);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [1, 2.0, 3.1, NaN]);
    });
  });

  suite('p5.prototype.int', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.int);
      assert.typeOf(mockP5Prototype.int, 'function');
    });

    test('should convert false to its integer representation i.e. 0', function() {
      const result = mockP5Prototype.int(false);
      assert.typeOf(result, 'Number');
      assert.strictEqual(result, 0);
    });

    test('should convert true to its integer representation i.e. 1', function() {
      const result = mockP5Prototype.int(true);
      assert.strictEqual(result, 1);
    });

    test('should convert a string to its integer representation', function() {
      const result = mockP5Prototype.int('1001');
      assert.strictEqual(result, 1001);
    });

    test('should return NaN for invalid string', function() {
      const result = mockP5Prototype.int('cat');
      assert.isNaN(result);
    });

    test('should return Infinity for Infinity', function() {
      const result = mockP5Prototype.int(Infinity);
      assert.strictEqual(result, Infinity);
    });

    test('should return -Infinity for -Infinity', function() {
      const result = mockP5Prototype.int(-Infinity);
      assert.strictEqual(result, -Infinity);
    });

    test('should convert float to its integer representation', function() {
      const result = mockP5Prototype.int('-1001.9');
      assert.strictEqual(result, -1001);
    });

    test('should return array of integers and NaN', function() {
      const result = mockP5Prototype.int(['1', '2.3', '-3.5', 'giraffe', false, 4.7]);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [1, 2, -3, NaN, 0, 4]);
    });
  });

  suite('p5.prototype.str', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.str);
      assert.typeOf(mockP5Prototype.str, 'function');
    });

    test('should convert false to string', function() {
      const result = mockP5Prototype.str(false);
      assert.typeOf(result, 'String');
      assert.strictEqual(result, 'false');
    });

    test('should convert true to string', function() {
      const result = mockP5Prototype.str(true);
      assert.strictEqual(result, 'true');
    });

    test('should convert a number to string', function() {
      const result = mockP5Prototype.str(45);
      assert.strictEqual(result, '45');
    });

    test('should return array of strings', function() {
      const result = mockP5Prototype.str([1, 2.3, true, -4.5]);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, ['1', '2.3', 'true', '-4.5']);
    });
  });

  suite('p5.prototype.boolean', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.boolean);
      assert.typeOf(mockP5Prototype.boolean, 'function');
    });

    test('should convert 1 to true', function() {
      const result = mockP5Prototype.boolean(1);
      assert.strictEqual(result, true);
    });

    test('should convert a number to true', function() {
      const result = mockP5Prototype.boolean(154);
      assert.strictEqual(result, true);
    });

    test('should return true for Infinity', function() {
      const result = mockP5Prototype.boolean(Infinity);
      assert.strictEqual(result, true);
    });

    test('should convert 0 to false', function() {
      const result = mockP5Prototype.boolean(0);
      assert.strictEqual(result, false);
    });

    test('should convert a string to false', function() {
      const result = mockP5Prototype.boolean('1');
      assert.strictEqual(result, false);
    });

    test('should convert a string to false', function() {
      const result = mockP5Prototype.boolean('0');
      assert.strictEqual(result, false);
    });

    test('should convert "true" to true', function() {
      const result = mockP5Prototype.boolean('true');
      assert.strictEqual(result, true);
    });

    test('should return false for empty string', function() {
      const result = mockP5Prototype.boolean('');
      assert.strictEqual(result, false);
    });

    test('should return array of boolean', function() {
      const result = mockP5Prototype.boolean([1, true, -4.5, Infinity, 'cat', '23']);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [true, true, true, true, false, false]);
    });
  });

  suite('p5.prototype.byte', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.byte);
      assert.typeOf(mockP5Prototype.byte, 'function');
    });

    test('should return 127 for 127', function() {
      const result = mockP5Prototype.byte(127);
      assert.strictEqual(result, 127);
    });

    test('should return -128 for 128', function() {
      const result = mockP5Prototype.byte(128);
      assert.strictEqual(result, -128);
    });

    test('should return 23 for 23.4', function() {
      const result = mockP5Prototype.byte(23.4);
      assert.strictEqual(result, 23);
    });

    test('should return 1 for true', function() {
      const result = mockP5Prototype.byte(true);
      assert.strictEqual(result, 1);
    });

    test('should return 23 for "23.4"', function() {
      const result = mockP5Prototype.byte('23.4');
      assert.strictEqual(result, 23);
    });

    test('should return NaN for invalid string', function() {
      const result = mockP5Prototype.byte('cat');
      assert.isNaN(result);
    });

    test('should return array', function() {
      const result = mockP5Prototype.byte([0, 255, '100']);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [0, -1, 100]);
    });
  });

  suite('p5.prototype.char', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.char);
      assert.typeOf(mockP5Prototype.char, 'function');
    });

    test('should return the char representation of the number', function() {
      const result = mockP5Prototype.char(65);
      assert.typeOf(result, 'String');
      assert.strictEqual(result, 'A');
    });

    test('should return the char representation of the string', function() {
      const result = mockP5Prototype.char('65');
      assert.strictEqual(result, 'A');
    });

    test('should return array', function() {
      const result = mockP5Prototype.char([65, 66, '67']);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, ['A', 'B', 'C']);
    });
  });

  suite('p5.prototype.unchar', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.unchar);
      assert.typeOf(mockP5Prototype.unchar, 'function');
    });

    test('should return the integer representation of char', function() {
      const result = mockP5Prototype.unchar('A');
      assert.typeOf(result, 'Number');
      assert.strictEqual(result, 65);
    });

    test('should return array of numbers', function() {
      const result = mockP5Prototype.unchar(['A', 'B', 'C']);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [65, 66, 67]);
    });
  });

  suite('p5.prototype.hex', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.hex);
      assert.typeOf(mockP5Prototype.hex, 'function');
    });

    test('should return the hex representation of the number', function() {
      const result = mockP5Prototype.hex(65);
      assert.typeOf(result, 'String');
      assert.strictEqual(result, '00000041');
    });

    test('should return FFFFFFFF for Infinity', function() {
      const result = mockP5Prototype.hex(Infinity);
      assert.typeOf(result, 'String');
      assert.strictEqual(result, 'FFFFFFFF');
    });

    test('should return 00000000 for -Infinity', function() {
      const result = mockP5Prototype.hex(-Infinity);
      assert.typeOf(result, 'String');
      assert.strictEqual(result, '00000000');
    });

    test('should return array', function() {
      const result = mockP5Prototype.hex([65, 66, 67]);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, ['00000041', '00000042', '00000043']);
    });
  });

  suite('p5.prototype.unhex', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.unhex);
      assert.typeOf(mockP5Prototype.unchar, 'function');
    });

    test('should return the integer representation of hex', function() {
      const result = mockP5Prototype.unhex('00000041');
      assert.typeOf(result, 'Number');
      assert.strictEqual(result, 65);
    });

    test('should return the NaN for empty string', function() {
      const result = mockP5Prototype.unhex('');
      assert.isNaN(result);
    });

    test('should return the NaN for invalid hex string', function() {
      const result = mockP5Prototype.unhex('lorem');
      assert.isNaN(result);
    });

    test('should return array of numbers', function() {
      const result = mockP5Prototype.unhex(['00000041', '00000042', '00000043']);
      assert.typeOf(result, 'Array');
      assert.deepEqual(result, [65, 66, 67]);
    });
  });
});
