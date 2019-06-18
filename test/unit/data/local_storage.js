suite('local storage', function() {
  var myp5;
  var myBoolean = false;
  var myObject = { one: 1, two: { nested: true } };
  var myNumber = 46;
  var myString = 'coolio';
  var myColor;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        myColor = myp5.color(40, 100, 70);
        myp5.storeItem('myBoolean', myBoolean);
        myp5.storeItem('myObject', myObject);
        myp5.storeItem('myNumber', myNumber);
        myp5.storeItem('myString', myString);
        myp5.storeItem('myColor', myColor);
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('all keys and type keys should exist in local storage', function() {
    test('boolean storage retrieval should work', function() {
      assert.isTrue(myp5.getItem('myBoolean') === false);
    });
    test('boolean storage should store the correct type ID', function() {
      assert.isTrue(localStorage.getItem('myBooleanp5TypeID') === 'boolean');
    });
    test('object storage should work', function() {
      console.log(myp5.getItem('myObject'));
      assert.deepEqual(myp5.getItem('myObject'), {
        one: 1,
        two: { nested: true }
      });
    });
    test('object storage retrieval should store the correct type ID', function() {
      assert.isTrue(localStorage.getItem('myObjectp5TypeID') === 'object');
    });
    test('number storage retrieval should work', function() {
      assert.isTrue(myp5.getItem('myNumber') === 46);
    });
    test('number storage should store the correct type ID', function() {
      assert.isTrue(localStorage.getItem('myNumberp5TypeID') === 'number');
    });
    test('string storage retrieval should work', function() {
      assert.isTrue(myp5.getItem('myString') === 'coolio');
    });
    test('string storage should store the correct type ID', function() {
      assert.isTrue(localStorage.getItem('myStringp5TypeID') === 'string');
    });
    test('p5 Color should retrieve as p5 Color', function() {
      assert.isTrue(myp5.getItem('myColor') instanceof p5.Color);
    });
  });
});
