import validateParams from '../../../src/core/friendly_errors/param_validator.js';
import * as constants from '../../../src/core/constants.js';

suite('Validate Params', function () {
  const mockP5 = {
    disableFriendlyErrors: false,
    Color: function () {
      return 'mock p5.Color';
    },
  };
  const mockP5Prototype = {};

  beforeAll(function () {
    validateParams(mockP5, mockP5Prototype);
    mockP5Prototype._loadP5Constructors();
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
        const result = mockP5Prototype._validateParams('saturation', input);
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
        const result = mockP5Prototype._validateParams('p5.saturation', input);
        assert.isTrue(result.error.startsWith("Expected Color or array or string at the first parameter, but received"));
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
        const result = mockP5Prototype._validateParams('p5.blendMode', [input]);
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
        const result = mockP5Prototype._validateParams('p5.blendMode', [input]);
        const expectedError = "Expected constant (please refer to documentation for allowed values) at the first parameter, but received " + input + ".";
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
        const result = mockP5Prototype._validateParams('p5.arc', input);
        assert.isTrue(result.success);
      });
    });

    const invalidInputs = [
      { name: 'missing required arc parameters #4, #5', input: [200, 100, 100, 80], msg: 'Expected at least 6 arguments, but received fewer. Please add more arguments! For more information, see https://p5js.org/reference/p5/arc.' },
      { name: 'missing required param #0', input: [undefined, 100, 100, 80, 0, Math.PI, constants.PIE, 30], msg: 'Expected number at the first parameter, but received undefined.' },
      { name: 'missing required param #4', input: [200, 100, 100, 80, undefined, 0], msg: 'Expected number at the fifth parameter, but received undefined.' },
      { name: 'missing optional param #5', input: [200, 100, 100, 80, 0, undefined, Math.PI], msg: 'Expected number at the sixth parameter, but received undefined.' },
      { name: 'wrong param type at #0', input: ['a', 100, 100, 80, 0, Math.PI, constants.PIE, 30], msg: 'Expected number at the first parameter, but received string.' }
    ];

    invalidInputs.forEach(({ name, input, msg }) => {
      test(`arc(): ${name}`, () => {
        const result = mockP5Prototype._validateParams('p5.arc', input);
        assert.equal(result.error, msg);
      });
    });
  });

  suite('validateParams: class, multi-types + optional numbers', function () {
    test('ambientLight(): no firendly-err-msg', function () {
      const result = mockP5Prototype._validateParams('p5.ambientLight', [new mockP5.Color()]);
      assert.isTrue(result.success);
    })
  })

  suite('validateParams: a few edge cases', function () {
    const invalidInputs = [
      { fn: 'color', name: 'wrong type for optional parameter', input: [0, 0, 0, 'A'], msg: 'Expected number at the fourth parameter, but received string.' },
      { fn: 'color', name: 'superfluous parameter', input: [[0, 0, 0], 0], msg: 'Expected number at the first parameter, but received array.' },
      { fn: 'color', name: 'wrong element types', input: [['A', 'B', 'C']], msg: 'Expected number at the first parameter, but received array.' },
      { fn: 'rect', name: 'null, non-trailing, optional parameter', input: [0, 0, 0, 0, null, 0, 0, 0], msg: 'Expected number at the fifth parameter, but received null.' },
      { fn: 'color', name: 'too many args + wrong types too', input: ['A', 'A', 0, 0, 0, 0, 0, 0, 0, 0], msg: 'Expected at most 4 arguments, but received more. Please delete some arguments! For more information, see https://p5js.org/reference/p5/color.' },
      { fn: 'line', name: 'null string given', input: [1, 2, 4, 'null'], msg: 'Expected number at the fourth parameter, but received string.' },
      { fn: 'line', name: 'NaN value given', input: [1, 2, 4, NaN], msg: 'Expected number at the fourth parameter, but received nan.' }
    ];

    invalidInputs.forEach(({ name, input, fn, msg }) => {
      test(`${fn}(): ${name}`, () => {
        const result = mockP5Prototype._validateParams(`p5.${fn}`, input);
        assert.equal(result.error, msg);
      });
    });
  });

  suite('validateParams: trailing undefined arguments', function () {
    const invalidInputs = [
      { fn: 'color', name: 'missing params #1, #2', input: [12, undefined, undefined], msg: 'Expected number at the second parameter, but received undefined.' },
      // Even though the undefined arguments are technically allowed for
      // optional parameters, it is more likely that the user wanted to call
      // the function with meaningful arguments.
      { fn: 'random', name: 'missing params #0, #1', input: [undefined, undefined], msg: 'All arguments for function p5.random are undefined. There is likely an error in the code.' },
      { fn: 'circle', name: 'missing compulsory parameter #2', input: [5, 5, undefined], msg: 'Expected number at the third parameter, but received undefined.' }
    ];

    invalidInputs.forEach(({ fn, name, input, msg }) => {
      test(`${fn}(): ${name}`, () => {
        const result = mockP5Prototype._validateParams(`p5.${fn}`, input);
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
        const result = mockP5Prototype._validateParams('p5.color', input);
        assert.isTrue(result.success);
      });
    });

    const invalidInputs = [
      { name: 'optional parameter, incorrect type', input: [65, 100, 100, 'a'], msg: 'Expected number at the fourth parameter, but received string.' },
      { name: 'extra parameter', input: [[65, 100, 100], 100], msg: 'Expected number at the first parameter, but received array.' },
      { name: 'incorrect element type', input: ['A', 'B', 'C'], msg: 'Expected number at the first parameter, but received string.' },
      { name: 'incorrect parameter count', input: ['A', 'A', 0, 0, 0, 0, 0, 0], msg: 'Expected at most 4 arguments, but received more. Please delete some arguments! For more information, see https://p5js.org/reference/p5/color.' }
    ];

    invalidInputs.forEach(({ name, input, msg }) => {
      test(`color(): ${name}`, () => {
        const result = mockP5Prototype._validateParams('p5.color', input);
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
        const result = mockP5Prototype._validateParams('p5.set', input);
        assert.isTrue(result.success);
      });
    });

    test(`set() with Boolean (invalid)`, function () {
      const result = mockP5Prototype._validateParams('p5.set', [0, 0, true]);
      assert.equal(result.error, 'Expected number or array or object at the third parameter, but received boolean.');
    });
  });

  suite('validateParams: web API objects', function () {
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();

    const testCases = [
      { fn: 'mouseMoved', name: 'no friendly-err-msg', input: [new MouseEvent('click')] },
      { fn: 'p5.MediaElement.connect', name: 'no friendly-err-msg', input: [gainNode] }
    ];

    testCases.forEach(({ fn, name, input }) => {
      test(`${fn}(): ${name}`, function () {
        const result = mockP5Prototype._validateParams(fn, input);
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
      const result = mockP5Prototype._validateParams('p5.Color.paletteLerp', [colorStops, 0.5]);
      assert.isTrue(result.success);
    })
  })
});
