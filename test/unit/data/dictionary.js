suite('Dictionary Objects', function() {
  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  teardown(function(){
    myp5.clear();
  });

  var stringDict = myp5.createStringDict('happy', 'coding');
  var numberDict = myp5.createNumberDict(1, 2);

  test('stringDict should be created', function() {
    assert.isTrue(stringDict instanceof p5.StringDict);
  });

  test('numberDict should be created', function() {
    assert.isTrue(numberDict instanceof p5.NumberDict);
  });

  test('check on the structure of stringDict', function() {
    assert.deepEqual(JSON.stringify(stringDict),
     JSON.stringify({data:{'happy':'coding'}}));
  });

  test('check on the structure of numberDict', function() {
    assert.deepEqual(JSON.stringify(numberDict),
     JSON.stringify({data:{1:2}}));
  });

  test('stringDict should have correct count', function() {
    var amt = stringDict.size();
    assert.isTrue(amt === Object.keys(stringDict.data).length);
  });

  test('numberDict should have correct count', function() {
    var amt = numberDict.size();
    assert.isTrue(amt === Object.keys(numberDict.data).length);
  });

  test('stringDict should add new key-value pairs and search', function() {
    stringDict.create('fun', 'sun');
    assert.deepEqual(stringDict.get('fun'), 'sun');
  });

  test('stringDict should add objects', function() {
    stringDict.create({'p5': 'js', 'open': 'source'});
    assert.deepEqual(stringDict.get('open'), 'source');
  });

  test('numberDict should add new key-value pairs and search', function() {
    numberDict.create(3, 4);
    assert.deepEqual(numberDict.get(3), 4);
  });

  test('stringDict should change existing values', function() {
    stringDict.set('fun', 'times');
    assert.deepEqual(stringDict.get('fun'),'times');
  });

  test('numberDict should change existing values', function() {
    numberDict.set(1, 5);
    assert.deepEqual(numberDict.get(1),5);
  });

  test('should clear stringDict', function() {
    stringDict.clear();
    assert.deepEqual(stringDict, {data:{}});
  });

  test('should add values together', function() {
    numberDict.add(1, 4);
    assert.deepEqual(numberDict.get(1), 9);
  });

  test('should subtract from value', function() {
    numberDict.sub(1, 3);
    assert.deepEqual(numberDict.get(1), 6);
  });

  test('should divide from value', function() {
    numberDict.div(1, 3);
    assert.deepEqual(numberDict.get(1), 2);
  });

  test('should multiply value', function() {
    numberDict.mult(1, 3);
    assert.deepEqual(numberDict.get(1), 6);
  });

  test('should find minimum value', function() {
    assert.deepEqual(numberDict.minValue(), 4);
  });

  test('should find maximum value', function() {
    assert.deepEqual(numberDict.maxValue(), 6);
  });

  test('should clear numberDict', function() {
    numberDict.clear();
    assert.deepEqual(numberDict, {data:{}});
  });
});