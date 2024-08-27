import p5 from '../../../src/app.js';
import * as constants from '../../../src/core/constants.js';

import { testUnMinified } from '../../js/p5_helpers';
import '../../js/chai_helpers';
import { ValidationError } from 'zod-validation-error';

suite('Friendly Errors', function () {
  suite('validateParams: multiple types allowed for single parameter', function () {
    test('saturation(): valid inputs', () => {
      const validInputs = [
        { input: ['rgb(255, 128, 128)'] },
        { input: [[0, 50, 100]] }
        // TODO: add a test case for p5.Color
      ];

      validInputs.forEach(({ input }) => {
        const result = p5._validateParams('saturation', input);
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
        const result = p5._validateParams('saturation', input);
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
        const result = p5._validateParams('blendMode', [input]);
        assert.validationResult(result, expectSuccess);
      });
    });
  });

  suite('validateParams: bumbers + optional constant', function () {
    const testCases = [
      // Test cases that pass validation
      { name: 'no friendly-err-msg', input: [200, 100, 100, 80, 0, Math.PI, constants.PIE, 30], expectSuccess: true },
      { name: 'missing optional param #6 & #7, no friendly-err-msg', input: [200, 100, 100, 80, 0, Math.PI], expectSuccess: true },
      // Test cases that fail validation
      { name: 'missing required arc parameters #4, #5', input: [200, 100, 100, 80], expectSuccess: false },
      { name: 'missing required param #0', input: [undefined, 100, 100, 80, 0, Math.PI, constants.PIE, 30], expectSuccess: false },
      { name: 'missing required param #4', input: [200, 100, 100, 80, undefined, 0], expectSuccess: false },
      { name: 'missing optional param #5', input: [200, 100, 100, 80, 0, undefined, Math.PI], expectSuccess: false },
      { name: 'wrong param type at #0', input: ['a', 100, 100, 80, 0, Math.PI, constants.PIE, 30], expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      test(`arc(): ${name}`, () => {
        const result = p5._validateParams('arc', input);
        assert.validationResult(result, expectSuccess);
      });
    });
  });

  suite('validateParams: multi-format', function () {
    const testCases = [
      // Test cases that pass validation
      { name: 'no friendly-err-msg', input: [65], expectSuccess: true },
      { name: 'no friendly-err-msg', input: [65, 100], expectSuccess: true },
      { name: 'no friendly-err-msg', input: [65, 100, 100], expectSuccess: true },
      // Test cases that fail validation
      { name: 'optional parameter, incorrect type', input: [65, 100, 100, 'a'], expectSuccess: false },
      { name: 'extra parameter', input: [[65, 100, 100], 100], expectSuccess: false },
      { name: 'incorrect element type', input: ['A', 'B', 'C'], expectSuccess: false },
      { name: 'incorrect parameter count', input: ['A', 'A', 0, 0, 0, 0, 0, 0], expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      test(`color(): ${name}`, () => {
        const result = p5._validateParams('color', input);
        assert.validationResult(result, expectSuccess);
      });
    });
  });

  suite('validateParameters: union types', function () {
    const testCases = [
      { name: 'with Number', input: [0, 0, 0], expectSuccess: true },
      { name: 'with Number[]', input: [0, 0, [0, 0, 0, 255]], expectSuccess: true },
      // TODO: add test case for p5.Color
      { name: 'with Boolean (invalid)', input: [0, 0, true], expectSuccess: false }
    ];

    testCases.forEach(({ name, input, expectSuccess }) => {
      testUnMinified(`set(): ${name}`, function () {
        const result = p5._validateParams('set', input);
        assert.validationResult(result, expectSuccess);
      });
    });
  });
});