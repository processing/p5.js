import p5 from '../../../src/app.js';
import { _sanitizeFontName } from '../../../src/type/p5.Font.js';

suite('p5.Font', function () {
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

  // tests ////////////////////////////////////////////////
  const fontFile = 'test/unit/assets/acmesa.ttf';
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
      const simplifiedPts = font.textToPoints('T', 0, 0, {
        simplifyThreshold: Math.PI * 0.01
      });
      expect(pts.length).toBeGreaterThan(simplifiedPts.length);
    });
  });

  // https://github.com/processing/p5.js/issues/7486
  //
  // Originally reported as a WOFF2-only problem, but it isn't: it
  // reproduces from a plain, uncompressed .ttf, so WOFF2 decompression
  // was never the cause. The real fault was in Typr's `gvar`
  // (variable-font glyph-variation) table header parser: the
  // `glyphVariationDataOffsets` array is stored as 4-byte `Offset32`
  // values when the table's `flags` bit 0 is set, or as 2-byte `uint16`
  // values (real offset = value * 2) when it's clear -- Typr always
  // read them as 4-byte offsets, silently misaligning every glyph's
  // variation data for any font using the shorter (more common, more
  // compact) form. Confirmed against real-world variable fonts served
  // by Google Fonts (Bricolage Grotesque, Inter, Outfit); the smaller
  // synthetic fixture used elsewhere in this file's sibling tests,
  // `BricolageGrotesque-Variable.ttf`, happens to use the long-offset
  // form, which is why it never surfaced this bug.
  suite('variable font glyph data (issue #7486)', () => {
    test('a static font parses full glyph data', async () => {
      const pFont = await myp5.loadFont('test/unit/assets/Lato-Regular.woff');
      expect(pFont.data).toBeTruthy();
      expect(pFont.data.glyf).toBeTruthy();
      expect(pFont.data.gvar).toBeFalsy();
    });

    test('a real-world variable font (short gvar offsets) parses glyph data', async () => {
      const pFont = await myp5.loadFont(
        'test/unit/assets/BricolageGrotesque-gvar-bug.ttf'
      );
      expect(pFont.data).toBeTruthy();
      expect(pFont.data.glyf).toBeTruthy();
      expect(pFont.data.gvar).toBeTruthy();
    });

    test('a variable font with long gvar offsets still parses glyph data', async () => {
      const pFont = await myp5.loadFont(
        'test/unit/assets/BricolageGrotesque-Variable.ttf'
      );
      expect(pFont.data).toBeTruthy();
      expect(pFont.data.glyf).toBeTruthy();
      expect(pFont.data.gvar).toBeTruthy();
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
