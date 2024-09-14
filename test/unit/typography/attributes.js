import p5 from '../../../src/app.js';

suite('Typography Attributes', function() {
  let myp5;

  beforeAll(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
  });

  afterAll(function() {
    myp5.remove();
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
  });

  suite('p5.prototype.textSize', function() {
    test('sets and gets the font size', function() {
      myp5.textSize(24);
      assert.strictEqual(myp5.textSize(), 24);
    });
  });

  suite('p5.prototype.textStyle', function() {
    test('sets and gets the font style', function() {
      myp5.textStyle(myp5.ITALIC);
      assert.strictEqual(myp5.textStyle(), myp5.ITALIC);
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
    test('returns textWrap text attribute', function() {
      assert.strictEqual(myp5.textWrap(myp5.WORD), myp5.WORD);
    });
  });
});
