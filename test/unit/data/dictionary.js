suite('Dictionary Objects', function() {
  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  teardown(function(){
    myp5.clear();
  });

  var stringDict = myp5.createStringDict('happy', 'coding');
  test('stringDict should be created', function() {
	assert.isTrue(stringDict instanceof p5.StringDict);
	done();
  });

  test('stringDict should have correct count', function() {
  	var amt = stringDict.count();
	assert.isTrue(amt === Object.keys(stringDict.data).length);
	done();
  });

  test('should add new key-value pairs and search', function() {
  	stringDict.create('fun', 'sun');
  	assert.isTrue(stringDict.get('fun') === 'sun');
  	done();
  });

  test('should change existing values', function() {
  	stringDict.set('fun', 'times');
  	assert.isTrue(stringDict.get('fun') === 'times');
  	done();
  })
});