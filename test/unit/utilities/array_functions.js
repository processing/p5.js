import { mockP5, mockP5Prototype } from '../../js/mocks';
import arrayFunctions from '../../../src/utilities/array_functions';
import random from '../../../src/math/random';

suite('Array', function() {
  beforeAll(function() {
    arrayFunctions(mockP5, mockP5Prototype);
    random(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.shuffle', function() {
    test('should contain all the elements of the original array', function() {
      let regularArr = ['ABC', 'def', {}, Math.PI * 2, Math.E];
      let newArr = mockP5Prototype.shuffle(regularArr);
      let flag = true;
      for (let i = 0; i < regularArr.length; i++) {
        if (!newArr.includes(regularArr[i])) {
          flag = false;
          break;
        }
      }
      assert.isArray(newArr);
      assert.strictEqual(newArr.length, regularArr.length);
      assert.strictEqual(flag, true);
    });
  });
});
