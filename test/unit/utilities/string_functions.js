import { mockP5, mockP5Prototype } from '../../js/mocks';
import stringFunctions from '../../../src/utilities/string_functions';

suite('String functions', function() {
  beforeAll(function() {
    stringFunctions(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.join', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.join);
    });

    test('should return joined string', function() {
      var arr = ['foo', 'bar'];
      var sep = '-';
      const result = mockP5Prototype.join(arr, sep);
      assert.equal(result, 'foo-bar');
    });
  });

  suite('p5.prototype.match', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.match);
    });

    test('should return correct index of match strings', function() {
      var str = 'Where is the duckling in this ducky duck string?';
      var regexp = 'duck';
      const result = mockP5Prototype.match(str, regexp);
      assert.equal(result.index, 13);
    });
  });

  suite('p5.prototype.matchAll', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.matchAll);
    });

    test('should return correct array of strings', function() {
      var str = 'Where is the duckling in this ducky duck string?';
      var regexp = 'duck';
      const result = mockP5Prototype.matchAll(str, regexp);
      assert.equal(result.length, 3);
    });
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

  suite('p5.prototype.split', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.split);
    });

    test('should return correct index of match strings', function() {
      var str = 'parsely, sage, rosemary, thyme';
      var regexp = ',';
      const result = mockP5Prototype.split(str, regexp);
      assert.equal(result.length, 4);
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

  suite('p5.prototype.trim', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.trim);
    });

    test('should return correct strings', function() {
      var str = '     oh so roomy     ';
      const result = mockP5Prototype.trim(str);
      assert.equal(result, 'oh so roomy');
    });
  });
});
