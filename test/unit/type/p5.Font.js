import p5 from '../../../src/app.js';
import {_sanitizeFontName} from '../../../src/type/p5.Font.js';

suite('p5.Font', function () {
  var myp5;

  beforeEach(function () {
    myp5 = new p5(function (p) {
      p.setup = function () { };
      p.draw = function () { };
    });
  });

  afterEach(function () {
    myp5.remove();
  });

  // tests ////////////////////////////////////////////////
  const fontFile = '/unit/assets/acmesa.ttf';
  const textString = 'Lorem ipsum dolor sit amet.';

  test('textBounds', async () => {
    const pFont = await myp5.loadFont(fontFile);
    let bbox = pFont.textBounds(textString, 10, 30, 12);
    //console.log(bbox);
    assert.isObject(bbox);
    assert.property(bbox, 'x');
    assert.property(bbox, 'y');
    assert.property(bbox, 'w');
    assert.property(bbox, 'h');
  });

  test('fontBounds', async () => {
    const pFont = await myp5.loadFont(fontFile);
    let bbox = pFont.fontBounds(textString, 10, 30, 12);
    //console.log(bbox);
    assert.isObject(bbox);
    assert.property(bbox, 'x');
    assert.property(bbox, 'y');
    assert.property(bbox, 'w');
    assert.property(bbox, 'h');
  });

   test('fontBounds no NaN (multiline + CENTER)', async () => {
     const pFont = await myp5.loadFont(fontFile);
     myp5.textAlign(myp5.CENTER, myp5.CENTER);
     const b = pFont.fontBounds('Hello,\nWorld!', 50, 50, 24);
     expect(b.x).not.toBeNaN();
     expect(b.y).not.toBeNaN();
     expect(b.w).not.toBeNaN();
     expect(b.h).not.toBeNaN();
  });

  suite('textToPoints', () => {
    test('contains no NaNs', async () => {
      const pFont = await myp5.loadFont(fontFile);
      const pts = pFont.textToPoints('hello, world!', 0, 0);
      for (const pt of pts) {
        expect(pt.x).not.toBeNaN();
        expect(pt.y).not.toBeNaN();
      }
    });

    test('simplifies collinear points', async () => {
      const font = await myp5.loadFont(fontFile);
      myp5.textSize(50);
      const pts = font.textToPoints('T', 0, 0);
      const simplifiedPts = font.textToPoints('T', 0, 0, { simplifyThreshold: Math.PI * 0.01 });
      expect(pts.length).toBeGreaterThan(simplifiedPts.length);
    });
  });
});

suite('sanitizeFontName', function () {
  test('fully alphabetic or alpha-leading alnum do not need quotes', function () {
    assert.equal(_sanitizeFontName('Arial'), 'Arial');
    assert.equal(_sanitizeFontName('Family900'), 'Family900');
    assert.equal(_sanitizeFontName('A_b-c'), 'A_b-c');
  });

  test('names starting with a digit need quotes', function () {
    assert.equal(_sanitizeFontName('9lives'), "'9lives'");
  });

  test('names with spaces need quotes', function () {
    assert.equal(_sanitizeFontName('My Font'), "'My Font'");
  });

  test('names with commas need quotes', function () {
    assert.equal(_sanitizeFontName('Foo,Bar'), "'Foo,Bar'");
  });
});
