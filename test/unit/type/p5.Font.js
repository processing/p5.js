import p5 from '../../../src/app.js';
import { promisedSketch } from '../../js/p5_helpers.js';

suite.todo('p5.Font', function () {

  var myp5;
  var font;

  beforeEach(function () {
    let fontFile = 'manual-test-examples/p5.Font/acmesa.ttf';
    return new Promise(done => {
      myp5 = new p5(function (p) {
        p.setup = async function () {
          p.createCanvas(100, 100);
          font = await p.loadFont(fontFile);
          done();
        };
      });
    });
  });

  afterEach(function () {
    myp5.remove();
  });

  var loadFontTest = function() {
    assert(font instanceof p5.Font, 'font was not a p5.Font object');
  };

  suite.todo('loadFont', function() {
    test('load a p5.Font', function() {
      loadFontTest();
    });
  });

  suite.todo('p5.Font.prototype.textBounds', function () {
    test('returns a tight bounding box for the given text string', function () {
      let fontFile = 'manual-test-examples/p5.Font/acmesa.ttf';
      let textString = 'Lorem ipsum dolor sit amet.';
      sketch.setup = async function () {
        let _font = await sketch.loadFont(fontFile, function () { }, reject);
        //sketch.textFont(_font);
        let bbox = _font.textBounds(textString, 10, 30, 12);
        console.log(bbox);
        assert.isObject(bbox);
        assert.property(bbox, 'x');
        assert.property(bbox, 'y');
        assert.property(bbox, 'w');
        assert.property(bbox, 'h');
      };

    });
  });
});
suite.todo('p5.Font.prototype.textToPoints', function() {
  test('returns array of points', async function() {
    let fontFile = 'manual-test-examples/p5.Font/acmesa.ttf';
    const points = await promisedSketch(function(sketch, resolve, reject) {
      let _font;
      sketch.preload = function() {
        _font = sketch.loadFont(fontFile, function() {}, reject);
      };
      sketch.setup = function() {
        let _points = _font.textToPoints('p5', 0, 0, 10, {
          sampleFactor: 5,
          simplifyThreshold: 0
        });
        resolve(_points);
      };
    });
    assert.isArray(points);
    points.forEach(p => {
      assert.property(p, 'x');
      assert.property(p, 'y');
      assert.property(p, 'alpha');
    });
  });
});

