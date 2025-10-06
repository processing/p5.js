import validateParams from '../../../src/friendly_errors/param_validator.js';
import * as constants from '../../../src/core/constants.js';

suite('Validate Params', function () {
  const mockP5 = {
    disableFriendlyErrors: false,
    Color: function () {
      return 'mock p5.Color';
    },
    Image: function() {
      return 'mock p5.Image';
    },
    Element: function() {
      return 'mock p5.Element';
    },
    Texture: function() {
      return 'mock p5.Texture';
    },
    Framebuffer: function() {
      return 'mock p5.Framebuffer';
    },
    FramebufferTexture: function() {
      return 'mock p5.FramebufferTexture';
    },
    Renderer: function() {
      return 'mock p5.Renderer';
    },
    Graphics: function() {
      return 'mock p5.Graphics';
    },
    _error: () => {},
    decorateHelper: () => {},
  };
  const mockP5Prototype = {};

  beforeAll(function () {
    validateParams(mockP5, mockP5Prototype, {});
  });

  afterAll(function () {
  });

  suite('validateParams: multiple types allowed for single parameter', function () {
    test('saturation(): valid inputs', () => {
      const validInputs = [
        { input: ['rgb(255, 128, 128)'] },
        { input: [[0, 50, 100]] },
        { input: [new mockP5.Color()] }
      ];

      validInputs.forEach(({ input }) => {
        const result = mockP5Prototype._validate('saturation', input);
        assert.isTrue(result.success);
      });
    });

    test('saturation(): invalid inputs', () => {
      const invalidInputs = [
        { input: [true] },
        { input: [42] },
        { input: [{}] },
        { input: [null] }
      ];

      invalidInputs.forEach(({ input }) => {
        const result = mockP5Prototype._validate('p5.saturation', input);
        assert.isTrue(result.error.startsWith('🌸 p5.js says: Expected Color or array or string at the first parameter, but received'));
      });
    });
  });

  suite('validateParams: constant as parameter', function () {
    const validInputs = [
      { name: 'BLEND, no friendly-err-msg', input: constants.BLEND },
      { name: 'HARD_LIGHT, no friendly-err-msg', input: constants.HARD_LIGHT }
    ];

    validInputs.forEach(({ name, input }) => {
      test(`blendMode(): ${name}`, () => {
        const result = mockP5Prototype._validate('p5.blendMode', [input]);
        assert.isTrue(result.success);
      });
    });

    const FAKE_CONSTANT = 'fake-constant';
    const invalidInputs = [
      { name: 'invalid constant', input: FAKE_CONSTANT },
      { name: 'non-constant parameter', input: 100 }
    ];

    invalidInputs.forEach(({ name, input }) => {
      test(`blendMode(): ${name}`, () => {
        const result = mockP5Prototype._validate('p5.blendMode', [input]);
        const expectedError = '🌸 p5.js says: Expected constant (please refer to documentation for allowed values) at the first parameter, but received ' + input + ' in p5.blendMode().';
        assert.equal(result.error, expectedError);
      });
    });
  });

  suite('validateParams: numbers + optional constant for arc()', function () {
    const validInputs = [
      { name: 'no friendly-err-msg', input: [200, 100, 100, 80, 0, Math.PI, constants.PIE, 30] },
      { name: 'missing optional param #6 & #7, no friendly-err-msg', input: [200, 100, 100, 80, 0, Math.PI] }
    ];
    validInputs.forEach(({ name, input }) => {
      test(`arc(): ${name}`, () => {
        const result = mockP5Prototype._validate('p5.arc', input);
        assert.isTrue(result.success);
      });
    });

    const invalidInputs = [
      { name: 'missing required arc parameters #4, #5', input: [200, 100, 100, 80], msg: '🌸 p5.js says: Expected at least 6 arguments, but received fewer in p5.arc(). For more information, see https://p5js.org/reference/p5/arc.' },
      { name: 'missing required param #0', input: [undefined, 100, 100, 80, 0, Math.PI, constants.PIE, 30], msg: '🌸 p5.js says: Expected number at the first parameter, but received undefined in p5.arc().' },
      { name: 'missing required param #4', input: [200, 100, 100, 80, undefined, 0], msg: '🌸 p5.js says: Expected number at the fifth parameter, but received undefined in p5.arc().' },
      { name: 'missing optional param #5', input: [200, 100, 100, 80, 0, undefined, Math.PI], msg: '🌸 p5.js says: Expected number at the sixth parameter, but received undefined in p5.arc().' },
      { name: 'wrong param type at #0', input: ['a', 100, 100, 80, 0, Math.PI, constants.PIE, 30], msg: '🌸 p5.js says: Expected number at the first parameter, but received string in p5.arc().' }
    ];

    invalidInputs.forEach(({ name, input, msg }) => {
      test(`arc(): ${name}`, () => {
        const result = mockP5Prototype._validate('p5.arc', input);
        assert.equal(result.error, msg);
      });
    });
  });

  suite('validateParams: promise where no promise is expected', function () {
    test('image(): promise for first argument', function () {
      const result = mockP5Prototype._validate('p5.image', [Promise.resolve(), 0, 0]);
      console.log(result);
      assert.equal(
        result.error,
        '🌸 p5.js says: Did you mean to put `await` before a loading function? An unexpected Promise was found. Expected Image or Element or Texture or Framebuffer or FramebufferTexture or Renderer or Graphics at the first parameter in p5.image().'
      );
    });
  });

  suite('validateParams: class, multi-types + optional numbers', function () {
    test('ambientLight(): no firendly-err-msg', function () {
      const result = mockP5Prototype._validate('p5.ambientLight', [new mockP5.Color()]);
      assert.isTrue(result.success);
    });
  });

  suite('validateParams: a few edge cases', function () {
    const invalidInputs = [
      { fn: 'color', name: 'wrong type for optional parameter', input: [0, 0, 0, 'A'], msg: '🌸 p5.js says: Expected number at the fourth parameter, but received string in p5.color().' },
      { fn: 'color', name: 'superfluous parameter', input: [[0, 0, 0], 0], msg: '🌸 p5.js says: Expected number at the first parameter, but received array in p5.color().' },
      { fn: 'color', name: 'wrong element types', input: [['A', 'B', 'C']], msg: '🌸 p5.js says: Expected number at the first parameter, but received array in p5.color().' },
      { fn: 'rect', name: 'null, non-trailing, optional parameter', input: [0, 0, 0, 0, null, 0, 0, 0], msg: '🌸 p5.js says: Expected number at the fifth parameter, but received null in p5.rect().' },
      { fn: 'color', name: 'too many args + wrong types too', input: ['A', 'A', 0, 0, 0, 0, 0, 0, 0, 0], msg: '🌸 p5.js says: Expected at most 4 arguments, but received more in p5.color(). For more information, see https://p5js.org/reference/p5/color.' },
      { fn: 'line', name: 'null string given', input: [1, 2, 4, 'null'], msg: '🌸 p5.js says: Expected number at the fourth parameter, but received string in p5.line().' },
      { fn: 'line', name: 'NaN value given', input: [1, 2, 4, NaN], msg: '🌸 p5.js says: Expected number at the fourth parameter, but received NaN in p5.line().' }
    ];

    invalidInputs.forEach(({ name, input, fn, msg }) => {
      test(`${fn}(): ${name}`, () => {
        const result = mockP5Prototype._validate(`p5.${fn}`, input);
        assert.equal(result.error, msg);
      });
    });
  });

  suite('validateParams: trailing undefined arguments', function () {
    const invalidInputs = [
      { fn: 'color', name: 'missing params #1, #2', input: [12, undefined, undefined], msg: '🌸 p5.js says: Expected number at the second parameter, but received undefined in p5.color().' },
      // Even though the undefined arguments are technically allowed for
      // optional parameters, it is more likely that the user wanted to call
      // the function with meaningful arguments.
      { fn: 'random', name: 'missing params #0, #1', input: [undefined, undefined], msg: '🌸 p5.js says: All arguments for p5.random() are undefined. There is likely an error in the code.' },
      { fn: 'circle', name: 'missing compulsory parameter #2', input: [5, 5, undefined], msg: '🌸 p5.js says: Expected number at the third parameter, but received undefined in p5.circle().' }
    ];

    invalidInputs.forEach(({ fn, name, input, msg }) => {
      test(`${fn}(): ${name}`, () => {
        const result = mockP5Prototype._validate(`p5.${fn}`, input);
        assert.equal(result.error, msg);
      });
    });
  });

  suite('validateParams: multi-format', function () {
    const validInputs = [
      { name: 'no friendly-err-msg', input: [65] },
      { name: 'no friendly-err-msg', input: [65, 100] },
      { name: 'no friendly-err-msg', input: [65, 100, 100] }
    ];
    validInputs.forEach(({ name, input }) => {
      test(`color(): ${name}`, () => {
        const result = mockP5Prototype._validate('p5.color', input);
        assert.isTrue(result.success);
      });
    });

    const invalidInputs = [
      { name: 'optional parameter, incorrect type', input: [65, 100, 100, 'a'], msg: '🌸 p5.js says: Expected number at the fourth parameter, but received string in p5.color().' },
      { name: 'extra parameter', input: [[65, 100, 100], 100], msg: '🌸 p5.js says: Expected number at the first parameter, but received array in p5.color().' },
      { name: 'incorrect element type', input: ['A', 'B', 'C'], msg: '🌸 p5.js says: Expected number at the first parameter, but received string in p5.color().' },
      { name: 'incorrect parameter count', input: ['A', 'A', 0, 0, 0, 0, 0, 0], msg: '🌸 p5.js says: Expected at most 4 arguments, but received more in p5.color(). For more information, see https://p5js.org/reference/p5/color.' }
    ];

    invalidInputs.forEach(({ name, input, msg }) => {
      test(`color(): ${name}`, () => {
        const result = mockP5Prototype._validate('p5.color', input);

        assert.equal(result.error, msg);
      });
    });
  });

  suite('validateParameters: union types', function () {
    const validInputs = [
      { name: 'set() with Number', input: [0, 0, 0] },
      { name: 'set() with Number[]', input: [0, 0, [0, 0, 0, 255]] },
      { name: 'set() with Object', input: [0, 0, new mockP5.Color()] }
    ];
    validInputs.forEach(({ name, input }) => {
      test(`${name}`, function () {
        const result = mockP5Prototype._validate('p5.set', input);
        assert.isTrue(result.success);
      });
    });

    test('set() with Boolean (invalid)', function () {
      const result = mockP5Prototype._validate('p5.set', [0, 0, true]);
      assert.equal(result.error, '🌸 p5.js says: Expected number or array or object at the third parameter, but received boolean in p5.set().');
    });
  });

  suite('validateParams: web API objects', function () { // TODO: fix this p5 error
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();

    const testCases = [
      { fn: 'mouseMoved', name: 'no friendly-err-msg', input: [new MouseEvent('click')] },
      { fn: 'p5.MediaElement.connect', name: 'no friendly-err-msg', input: [gainNode] }
    ];

    testCases.forEach(({ fn, name, input }) => {
      test(`${fn}(): ${name}`, function () {
        const result = mockP5Prototype._validate(fn, input);
        assert.isTrue(result.success);
      });
    });
  });

  suite('validateParams: paletteLerp', function () {
    test('paletteLerp(): no firendly-err-msg', function () {
      const colorStops = [
        [new mockP5.Color(), 0.2],
        [new mockP5.Color(), 0.8],
        [new mockP5.Color(), 0.5]
      ];
      const result = mockP5Prototype._validate('p5.paletteLerp', [colorStops, 0.5]);
      assert.isTrue(result.success);
    });
  });

  suite('validateParams: rest arguments', function () {
    test('createVector(): works with no args', function() {
      const result = mockP5Prototype._validate('p5.createVector', []);
      assert.isTrue(result.success);
    });
    test('createVector(): works with one number', function() {
      const result = mockP5Prototype._validate('p5.createVector', [1]);
      assert.isTrue(result.success);
    });
    test('createVector(): works with many numbers', function() {
      const result = mockP5Prototype._validate('p5.createVector', [1, 2, 3, 4]);
      assert.isTrue(result.success);
    });
    test('createVector(): fails with a non-number', function() {
      const result = mockP5Prototype._validate('p5.createVector', ['1']);
      assert.isFalse(result.success);
    });
    test('createVector(): fails with any non-number', function() {
      const result = mockP5Prototype._validate('p5.createVector', [1, 2, '3', 4]);
      assert.isFalse(result.success);
    });
  });
});
