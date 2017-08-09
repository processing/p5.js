suite('String functions', function() {

  var result;

  suite('p5.prototype.join', function() {
    var join = p5.prototype.join;
    suite('join()', function() {
      test('should be a function', function() {
        assert.ok(join);
      });
      test('should return joined string', function() {
        var arr = ['foo', 'bar'];
        var sep = '-';
        result = join(arr, sep);
        assert.equal(result, 'foo-bar');
      });
    });
  });

  suite('p5.prototype.match', function() {
    var match = p5.prototype.match;
    suite('match()', function() {
      test('should be a function', function() {
        assert.ok(match);
      });
      test('should return correct index of match strings', function() {
        var str = 'Where is the duckling in this ducky duck string?';
        var regexp = 'duck';
        result = match(str, regexp);
        assert.equal(result.index, 13);
      });
    });
  });

  suite('p5.prototype.matchAll', function() {
    var matchAll = p5.prototype.matchAll;
    suite('matchAll()', function() {
      test('should be a function', function() {
        assert.ok(matchAll);
      });
      test('should return correct array of strings', function() {
        var str = 'Where is the duckling in this ducky duck string?';
        var regexp = 'duck';
        result = matchAll(str, regexp);
        assert.equal(result.length, 3);
      });
    });
  });

  suite('p5.prototype.nf', function() {
    var nf = p5.prototype.nf;
    suite('nf()', function() {
      test('should be a function', function() {
        assert.ok(nf);
      });
      test('should return correct string', function() {
        var num = 3.141516;
        result = nf(num, 2);
        assert.equal(result, '03.141516');
      });
      test('FES: false positive case (#1)', function() {
        var num = 3.141516;
        result = nf(num, '2'); // automatic conversion?
        assert.equal(result, '03.141516');
      });
    });
  });

  suite('p5.prototype.nfc', function() {
    var nfc = p5.prototype.nfc;
    suite('nfc()', function() {
      test('should be a function', function() {
        assert.ok(nfc);
      });
      test('should return correct string', function() {
        var num = 32000;
        result = nfc(num, 3);
        assert.equal(result, '32,000.000');
      });
      test('FES: false positive case (#1)', function() {
        var num = 32000;
        result = nfc(num, '3'); // automatic conversion?
        assert.equal(result, '32,000.000');
      });
    });
  });

  suite('p5.prototype.nfp', function() {
    var nfp = p5.prototype.nfp;
    suite('nfp()', function() {
      test('should be a function', function() {
        assert.ok(nfp);
      });
      test('should return correct string', function() {
        var num = -32000;
        result = nfp(num, 3);
        assert.equal(result, '-32000');
      });
      test('should return correct string', function() {
        var num = 32000;
        result = nfp(num, 3); // automatic conversion?
        assert.equal(result, '+32000');
      });
    });
  });

  suite('p5.prototype.nfs', function() {
    var nfs = p5.prototype.nfs;
    suite('nfs()', function() {
      test('should be a function', function() {
        assert.ok(nfs);
      });
      test('should return correct string', function() {
        var num = -32000;
        result = nfs(num, 3);
        assert.equal(result, '-32000');
      });
      test('should return correct string', function() {
        var num = 32000;
        result = nfs(num, 3); // automatic conversion?
        assert.equal(result, ' 32000');
      });
    });
  });

  suite('p5.prototype.split', function() {
    var split = p5.prototype.split;
    suite('split()', function() {
      test('should be a function', function() {
        assert.ok(split);
      });
      test('should return correct index of match strings', function() {
        var str = 'parsely, sage, rosemary, thyme';
        var regexp = ',';
        result = split(str, regexp);
        assert.equal(result.length, 4);
      });
    });
  });

  suite('p5.prototype.splitTokens', function() {
    var splitTokens = p5.prototype.splitTokens;
    suite('splitTokens()', function() {
      test('should be a function', function() {
        assert.ok(splitTokens);
      });
      test('should return correct index of match strings', function() {
        var str = 'parsely, sage, rosemary, thyme';
        var regexp = ',';
        result = splitTokens(str, regexp);
        assert.equal(result.length, 4);
      });
    });
  });

  suite('p5.prototype.trim', function() {
    var trim = p5.prototype.trim;
    suite('trim()', function() {
      test('should be a function', function() {
        assert.ok(trim);
      });
      test('should return correct strings', function() {
        var str = '     oh so roomy     ';
        result = trim(str);
        assert.equal(result, 'oh so roomy');
      });
    });
  });

});
