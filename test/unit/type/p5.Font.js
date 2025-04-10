import p5 from '../../../src/app.js';

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

  suite('textToPoints', () => {
    test('contains no NaNs', async () => {
      const pFont = await myp5.loadFont(fontFile);
      const pts = pFont.textToPoints('hello, world!', 0, 0);
      for (const pt of pts) {
        expect(pt.x).not.toBeNaN();
        expect(pt.y).not.toBeNaN();
      }
    });
  });
});
