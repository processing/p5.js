import { States } from '../../../src/core/States.js';

suite('States', function () {
  test('initialises with provided state', function () {
    const s = new States({ fill: 'red', stroke: 'blue' });
    assert.equal(s.fill, 'red');
    assert.equal(s.stroke, 'blue');
  });

  test('setValue() updates the value', function () {
    const s = new States({ fill: 'red' });
    s.setValue('fill', 'green');
    assert.equal(s.fill, 'green');
  });

  test('setValue() records the original before first modification', function () {
    const s = new States({ fill: 'red' });
    s.setValue('fill', 'green');
    assert.equal(s.getModified().fill, 'red');
  });

  test('setValue() does not overwrite original on repeated calls', function () {
    const s = new States({ fill: 'red' });
    s.setValue('fill', 'green');
    s.setValue('fill', 'blue');
    assert.equal(s.getModified().fill, 'red');
  });

  test('takeDiff() returns the modified map', function () {
    const s = new States({ fill: 'red' });
    s.setValue('fill', 'green');
    const diff = s.takeDiff();
    assert.equal(diff.fill, 'red');
  });

  test('takeDiff() clears #modified after returning', function () {
    const s = new States({ fill: 'red' });
    s.setValue('fill', 'green');
    s.takeDiff();
    assert.deepEqual(s.takeDiff(), {});
  });

  test('applyDiff() undoes current modifications and replaces #modified', function () {
    const s = new States({ fill: 'red' });
    s.setValue('fill', 'green');
    const outerModified = {};
    s.applyDiff(outerModified);
    assert.equal(s.fill, 'red');
    assert.deepEqual(s.getModified(), {});
  });

  test('applyDiff() with a non-empty prevModified replaces #modified', function () {
    const s = new States({ fill: 'red', stroke: 'black' });
    s.setValue('fill', 'green');
    const outerModified = { stroke: 'black' };
    s.applyDiff(outerModified);
    assert.equal(s.fill, 'red');
    assert.deepEqual(s.getModified(), { stroke: 'black' });
  });

  test('push/pop cycle: applyDiff restores prior state', function () {
    const s = new States({ fill: 'red' });
    const beforePush = s.takeDiff();
    s.setValue('fill', 'green');
    assert.equal(s.fill, 'green');
    s.applyDiff(beforePush);
    assert.equal(s.fill, 'red');
    assert.deepEqual(s.getModified(), {});
  });
});