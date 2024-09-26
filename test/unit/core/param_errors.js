import validateParams from '../../../src/core/friendly_errors/param_validator.js';
import * as constants from '../../../src/core/constants.js';

import '../../js/chai_helpers'
import { vi } from 'vitest';
import { ValidationError } from 'zod-validation-error';

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
        assert.instanceOf(result.error, ValidationError);
      });
    });
  });

  suite('validateParams: constant as parameter', function () {
    const FAKE_CONSTANT = 'fake-constant';
    const testCases = [
      { name: 'BLEND, no friendly-err-msg', input: constants.BLEND, expectSuccess: true },
      { name: 'HARD_LIGHT, no friendly-err-msg', input: constants.HARD_LIGHT, expectSuccess: true },
      { name: 'invalid constant', input: FAKE_CONSTANT, expectSuccess: false },
      { name: 'non-constant parameter', input: 100, expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      test(`blendMode(): ${name}`, () => {
        const result = mockP5Prototype._validateParams('p5.blendMode', [input]);
        assert.validationResult(result, expectSuccess);
      });
    });
  });

  suite('validateParams: numbers + optional constant for arc()', function () {
    const testCases = [
      { name: 'no friendly-err-msg', input: [200, 100, 100, 80, 0, Math.PI, constants.PIE, 30], expectSuccess: true },
      { name: 'missing optional param #6 & #7, no friendly-err-msg', input: [200, 100, 100, 80, 0, Math.PI], expectSuccess: true },
      { name: 'missing required arc parameters #4, #5', input: [200, 100, 100, 80], expectSuccess: false },
      { name: 'missing required param #0', input: [undefined, 100, 100, 80, 0, Math.PI, constants.PIE, 30], expectSuccess: false },
      { name: 'missing required param #4', input: [200, 100, 100, 80, undefined, 0], expectSuccess: false },
      { name: 'missing optional param #5', input: [200, 100, 100, 80, 0, undefined, Math.PI], expectSuccess: false },
      { name: 'wrong param type at #0', input: ['a', 100, 100, 80, 0, Math.PI, constants.PIE, 30], expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      test(`arc(): ${name}`, () => {
        const result = mockP5Prototype._validateParams('p5.arc', input);
        assert.validationResult(result, expectSuccess);
      });
    });
  });

  suite('validateParams: numbers + optional constant for rect()', function () {
    const testCases = [
      { name: 'no friendly-err-msg', input: [1, 1, 10.5, 10], expectSuccess: true },
      { name: 'wrong param type at #0', input: ['a', 1, 10.5, 10, 0, Math.PI], expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      test(`rect(): ${name}`, () => {
        const result = mockP5Prototype._validateParams('p5.rect', input);
        assert.validationResult(result, expectSuccess);
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
    const testCases = [
      { fn: 'color', name: 'wrong type for optional parameter', input: [0, 0, 0, 'A'] },
      { fn: 'color', name: 'superfluous parameter', input: [[0, 0, 0], 0] },
      { fn: 'color', name: 'wrong element types', input: [['A', 'B', 'C']] },
      { fn: 'rect', name: 'null, non-trailing, optional parameter', input: [0, 0, 0, 0, null, 0, 0, 0] },
      { fn: 'color', name: 'too many args + wrong types too', input: ['A', 'A', 0, 0, 0, 0, 0, 0, 0, 0] },
      { fn: 'line', name: 'null string given', input: [1, 2, 4, 'null'] },
      { fn: 'line', name: 'NaN value given', input: [1, 2, 4, NaN] }
    ];

    testCases.forEach(({ name, input, fn }) => {
      test(`${fn}(): ${name}`, () => {
        const result = mockP5Prototype._validateParams(`p5.${fn}`, input);
        console.log(result);
        assert.validationResult(result, false);
      });
    });
  });

  suite('validateParams: trailing undefined arguments', function () {
    const testCases = [
      { fn: 'color', name: 'missing params #1, #2', input: [12, undefined, undefined] },
      // Even though the undefined arguments are technically allowed for
      // optional parameters, it is more likely that the user wanted to call
      // the function with meaningful arguments.
      { fn: 'random', name: 'missing params #0, #1', input: [undefined, undefined] },
      { fn: 'circle', name: 'missing compulsory parameter #2', input: [5, 5, undefined] }
    ];

    testCases.forEach(({ fn, name, input }) => {
      test(`${fn}(): ${name}`, () => {
        const result = mockP5Prototype._validateParams(`p5.${fn}`, input);
        assert.validationResult(result, false);
      });
    });
  });

  suite('validateParams: multi-format', function () {
    const testCases = [
      { name: 'no friendly-err-msg', input: [65], expectSuccess: true },
      { name: 'no friendly-err-msg', input: [65, 100], expectSuccess: true },
      { name: 'no friendly-err-msg', input: [65, 100, 100], expectSuccess: true },
      { name: 'optional parameter, incorrect type', input: [65, 100, 100, 'a'], expectSuccess: false },
      { name: 'extra parameter', input: [[65, 100, 100], 100], expectSuccess: false },
      { name: 'incorrect element type', input: ['A', 'B', 'C'], expectSuccess: false },
      { name: 'incorrect parameter count', input: ['A', 'A', 0, 0, 0, 0, 0, 0], expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      test(`color(): ${name}`, () => {
        const result = mockP5Prototype._validateParams('p5.color', input);
        assert.validationResult(result, expectSuccess);
      });
    });
  });

  suite('validateParameters: union types', function () {
    const testCases = [
      { name: 'set() with Number', input: [0, 0, 0], expectSuccess: true },
      { name: 'set() with Number[]', input: [0, 0, [0, 0, 0, 255]], expectSuccess: true },
      { name: 'set() with Object', input: [0, 0, new mockP5.Color()], expectSuccess: true },
      { name: 'set() with Boolean (invalid)', input: [0, 0, true], expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      test(`set(): ${name}`, function () {
        const result = mockP5Prototype._validateParams('p5.set', input);
        assert.validationResult(result, expectSuccess);
      });
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
        assert.validationResult(result, true);
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
