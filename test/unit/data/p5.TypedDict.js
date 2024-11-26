import { mockP5, mockP5Prototype } from '../../js/mocks';
import typeDict from '../../../src/data/p5.TypedDict';

suite('Dictionary Objects', function() {
  let stringDict;
  let numberDict;

  beforeAll(function() {
    typeDict(mockP5, mockP5Prototype);
    stringDict = mockP5Prototype.createStringDict('happy', 'coding');
    numberDict = mockP5Prototype.createNumberDict(1, 2);
  });

  suite('p5.prototype.stringDict', function() {
    test('should be created', function() {
      assert.instanceOf(stringDict, mockP5.StringDict);
    });

    test('has correct structure', function() {
      assert.deepEqual(
        stringDict,
        { data: { happy: 'coding' } }
      );
    });

    test('should have correct size', function() {
      var amt = stringDict.size();
      assert.lengthOf(Object.keys(stringDict.data), amt);
    });

    test('should add new key-value pairs', function() {
      stringDict.create('fun', 'coding');
      assert.deepEqual(stringDict.get('fun'), 'coding');
    });

    test('should add objects', function() {
      stringDict.create({ p5: 'js', open: 'source' });
      assert.deepEqual(stringDict.get('open'), 'source');
    });

    test('should change existing values', function() {
      stringDict.set('fun', 'times');
      assert.deepEqual(stringDict.get('fun'), 'times');
    });

    test('should clear', function() {
      stringDict.clear();
      assert.deepEqual(stringDict.data, {});
    });
  });

  suite('p5.prototype.numberDict', function() {
    test('should be created', function() {
      assert.instanceOf(numberDict, mockP5.NumberDict);
    });

    test('has correct structure', function() {
      assert.deepEqual(
        numberDict,
        { data: { 1: 2 } }
      );
    });

    test('should have correct size', function() {
      var amt = numberDict.size();
      assert.lengthOf(Object.keys(numberDict.data), amt);
    });

    test('should add new key-value pairs', function() {
      numberDict.create(3, 4);
      assert.deepEqual(numberDict.get(3), 4);
    });

    test('should change existing values', function() {
      numberDict.set(1, 5);
      assert.deepEqual(numberDict.get(1), 5);
    });

    test('should add values together', function() {
      numberDict.set(1, 5);
      numberDict.add(1, 4);
      assert.deepEqual(numberDict.get(1), 9);
    });

    test('should subtract from value', function() {
      numberDict.set(1, 9);
      numberDict.sub(1, 3);
      assert.deepEqual(numberDict.get(1), 6);
    });

    test('should divide from value', function() {
      numberDict.set(1, 6);
      numberDict.div(1, 3);
      assert.deepEqual(numberDict.get(1), 2);
    });

    test('should multiply value', function() {
      numberDict.mult(1, 3);
      assert.deepEqual(numberDict.get(1), 6);
    });

    test('should find minimum value', function() {
      numberDict.clear();
      [10, 4, 6, 92, 100].forEach(function(x, i) {
        numberDict.set(i, x);
      });
      assert.deepEqual(numberDict.minValue(), 4);
    });

    test('should find maximum value', function() {
      [10, 4, 6, 92, 100].forEach(function(x, i) {
        numberDict.set(i, x);
      });
      assert.deepEqual(numberDict.maxValue(), 100);
    });

    test('should clear', function() {
      numberDict.clear();
      assert.deepEqual(numberDict.data, {});
    });
  });
});
