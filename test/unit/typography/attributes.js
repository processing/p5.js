suite('Typography Attributes', function() {
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

  suite('p5.prototype.textAlign', function() {
    test('wrong param at #0', function() {
      assert.validationError(function() {
        myp5.textAlign('a');
      });
    });
    test('wrong param at #1', function() {
      assert.validationError(function() {
        myp5.textAlign(myp5.CENTER, 'a');
      });
    });
    test('wrong param at #0. vertAlign as #0 param.', function() {
      assert.validationError(function() {
        myp5.textAlign(myp5.BOTTOM);
      });
    });
    test('wrong param at #1. horizAlign as #1 param.', function() {
      assert.validationError(function() {
        myp5.textAlign(myp5.CENTER, myp5.LEFT);
      });
    });
  });

  suite('p5.prototype.textLeading', function() {
    test('sets and gets the spacing value', function() {
      myp5.textLeading(20);
      assert.strictEqual(myp5.textLeading(), 20);
    });
    test('should work for negative spacing value', function() {
      myp5.textLeading(-20);
      assert.strictEqual(myp5.textLeading(), -20);
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.textLeading('C');
      });
    });
    test.skip('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.textLeading('25');
      });
    });
  });

  suite('p5.prototype.textSize', function() {
    test('sets and gets the font size', function() {
      myp5.textSize(24);
      assert.strictEqual(myp5.textSize(), 24);
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.textSize('A');
      });
    });
    test.skip('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.textSize('30');
      });
    });
  });

  suite('p5.prototype.textStyle', function() {
    test('sets and gets the font style', function() {
      myp5.textStyle(myp5.ITALIC);
      assert.strictEqual(myp5.textStyle(), myp5.ITALIC);
    });
    test('wrong param at #0', function() {
      assert.validationError(function() {
        myp5.textStyle('a');
      });
    });
  });

  suite('p5.prototype.textWidth', function() {
    test('should return a number for char input', function() {
      assert.isNumber(myp5.textWidth('P'));
    });
    test('should return a number for string input.', function() {
      assert.isNumber(myp5.textWidth('p5.js'));
    });
    // Either should not throw error
    test('should return a number for number input', function() {
      assert.isNumber(myp5.textWidth('p5.js'));
    });
  });

  suite('p5.prototype.textAscent', function() {
    test('should return a number', function() {
      assert.isNumber(myp5.textAscent());
    });
  });

  suite('p5.prototype.textDescent', function() {
    test('should return a number', function() {
      assert.isNumber(myp5.textDescent());
    });
  });

  suite('p5.prototype.textWrap', function() {
    test('should throw error for non-constant input', function() {
      expect(function() {
        myp5.textWrap('NO-WRAP');
      }).to.throw('Error: textWrap accepts only WORD or CHAR');
    });
    test('returns textWrap text attribute', function() {
      assert.strictEqual(myp5.textWrap(myp5.WORD), myp5.WORD);
    });
  });
});
