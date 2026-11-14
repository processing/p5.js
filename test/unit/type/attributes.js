import p5 from '../../../src/app.js';

suite('Typography Attributes', function () {
  var myp5;

  beforeEach(function () {
    myp5 = new p5(function (p) {
      p.setup = function () {};
      p.draw = function () {};
    });
  });

  afterEach(function () {
    myp5.remove();
  });

  suite('textLeading', function () {
    test('sets and gets the leading value', function () {
      myp5.textLeading(20);
      assert.strictEqual(myp5.textLeading(), 20);
    });
    test('should work for negative leadings', function () {
      myp5.textLeading(-20);
      assert.strictEqual(myp5.textLeading(), -20);
    });
  });

  suite('textAlign', function () {
    test('keeps valid horizontal and vertical values', function () {
      myp5.textAlign(myp5.RIGHT, myp5.BOTTOM);
      assert.strictEqual(myp5.textAlign().horizontal, myp5.RIGHT);
      assert.strictEqual(myp5.textAlign().vertical, myp5.BOTTOM);
    });
    test('falls back to LEFT for an unknown horizontal value', function () {
      myp5.textAlign(myp5.RIGHT);
      myp5.textAlign(myp5.TOP);
      assert.strictEqual(myp5.textAlign().horizontal, myp5.LEFT);
      assert.strictEqual(myp5.drawingContext.textAlign, myp5.LEFT);
    });
    test('falls back to BASELINE for an unknown vertical value', function () {
      myp5.textAlign(myp5.LEFT, myp5.TOP);
      myp5.textAlign(myp5.LEFT, myp5.LEFT);
      assert.strictEqual(myp5.textAlign().vertical, myp5.BASELINE);
      assert.strictEqual(myp5.drawingContext.textBaseline, myp5.BASELINE);
    });
  });

  suite('textSize', function () {
    test('sets and gets the text size', function () {
      myp5.textSize(24);
      assert.strictEqual(myp5.textSize(), 24);
    });
  });

  suite('textStyle', function () {
    test('sets and gets the text style', function () {
      myp5.textStyle(myp5.ITALIC);
      assert.strictEqual(myp5.textStyle(), myp5.ITALIC);
    });
  });

  suite('textWidth', function () {
    test('should return a number for char input', function () {
      assert.isNumber(myp5.textWidth('P'));
    });
    test('should return a number for string input.', function () {
      assert.isNumber(myp5.textWidth('p5.js'));
    });
    // Either should not throw error
    test('should return a number for number input', function () {
      assert.isNumber(myp5.textWidth(100));
    });
    test('should ignore leading and trailing spaces', function () {
      assert.strictEqual(myp5.textWidth('  Hello  '), myp5.textWidth('Hello'));
      assert.strictEqual(
        myp5.textWidth('    Hello    '),
        myp5.textWidth('Hello')
      );
    });
  });

  suite('textAscent', function () {
    test('should return a number', function () {
      assert.isNumber(myp5.textAscent());
    });
  });

  suite('textDescent', function () {
    test('should return a number', function () {
      assert.isNumber(myp5.textDescent());
    });
  });

  suite('textWrap', function () {
    test('gets the default text wrap attribute', function () {
      assert.strictEqual(myp5.textWrap(), myp5.WORD);
    });
    test('sets and gets the text wrap value', function () {
      myp5.textWrap(myp5.CHAR);
      assert.strictEqual(myp5.textWrap(), myp5.CHAR);
    });
  });
});
