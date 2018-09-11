suite('String functions', function() {
  let myp5;

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

  let result;

  suite('p5.prototype.join', function() {
    const join = p5.prototype.join;
    test('should be a function', function() {
      assert.ok(join);
    });

    test('should return joined string', function() {
      const arr = ['foo', 'bar'];
      const sep = '-';
      result = myp5.join(arr, sep);
      assert.equal(result, 'foo-bar');
    });
  });

  suite('p5.prototype.match', function() {
    const match = p5.prototype.match;
    test('should be a function', function() {
      assert.ok(match);
    });

    test('should return correct index of match strings', function() {
      const str = 'Where is the duckling in this ducky duck string?';
      const regexp = 'duck';
      result = myp5.match(str, regexp);
      assert.equal(result.index, 13);
    });
  });

  suite('p5.prototype.matchAll', function() {
    const matchAll = p5.prototype.matchAll;
    test('should be a function', function() {
      assert.ok(matchAll);
    });

    test('should return correct array of strings', function() {
      const str = 'Where is the duckling in this ducky duck string?';
      const regexp = 'duck';
      result = myp5.matchAll(str, regexp);
      assert.equal(result.length, 3);
    });
  });

  suite('p5.prototype.nf', function() {
    const nf = p5.prototype.nf;
    test('should be a function', function() {
      assert.ok(nf);
    });

    test('should return correct string', function() {
      const num = 3.141516;
      result = myp5.nf(num, 2);
      assert.equal(result, '03.141516');
    });

    test('should return correct string', function() {
      const num = 3.141516;
      result = myp5.nf(num, '2', '2'); // automatic conversion?
      assert.equal(result, '03.14');
    });
  });

  suite('p5.prototype.nfc', function() {
    const nfc = p5.prototype.nfc;
    test('should be a function', function() {
      assert.ok(nfc);
    });

    test('should return correct string', function() {
      const num = 32000;
      result = myp5.nfc(num, 3);
      assert.equal(result, '32,000.000');
    });

    test('should return correct string', function() {
      const num = 32000;
      result = myp5.nfc(num, '3'); // automatic conversion?
      assert.equal(result, '32,000.000');
    });
  });

  suite('p5.prototype.nfp', function() {
    const nfp = p5.prototype.nfp;
    test('should be a function', function() {
      assert.ok(nfp);
    });

    test('should return correct string', function() {
      const num = -32000;
      result = myp5.nfp(num, 3);
      assert.equal(result, '-32000');
    });

    test('should return correct string', function() {
      const num = 32000;
      result = myp5.nfp(num, 3); // automatic conversion?
      assert.equal(result, '+32000');
    });
  });

  suite('p5.prototype.nfs', function() {
    const nfs = p5.prototype.nfs;
    test('should be a function', function() {
      assert.ok(nfs);
    });

    test('should return correct string', function() {
      const num = -32000;
      result = myp5.nfs(num, 3);
      assert.equal(result, '-32000');
    });

    test('should return correct string', function() {
      const num = 32000;
      result = myp5.nfs(num, 3); // automatic conversion?
      assert.equal(result, ' 32000');
    });
  });

  suite('p5.prototype.split', function() {
    const split = p5.prototype.split;
    test('should be a function', function() {
      assert.ok(split);
    });

    test('should return correct index of match strings', function() {
      const str = 'parsely, sage, rosemary, thyme';
      const regexp = ',';
      result = myp5.split(str, regexp);
      assert.equal(result.length, 4);
    });
  });

  suite('p5.prototype.splitTokens', function() {
    const splitTokens = p5.prototype.splitTokens;
    test('should be a function', function() {
      assert.ok(splitTokens);
    });

    test('should return correct index of match strings', function() {
      const str = 'parsely, sage, rosemary, thyme';
      const regexp = ',';
      result = myp5.splitTokens(str, regexp);
      assert.equal(result.length, 4);
    });
  });

  suite('p5.prototype.trim', function() {
    const trim = p5.prototype.trim;
    test('should be a function', function() {
      assert.ok(trim);
    });

    test('should return correct strings', function() {
      const str = '     oh so roomy     ';
      result = myp5.trim(str);
      assert.equal(result, 'oh so roomy');
    });
  });
});
