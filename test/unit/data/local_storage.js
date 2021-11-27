suite('local storage', function() {
  var myp5;
  var myBoolean = false;
  var myObject = { one: 1, two: { nested: true } };
  var myNumber = 46;
  var myString = 'coolio';
  var myColor;
  var myVector;

  var hardCodedTypeID = 'p5TypeID';

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        myColor = myp5.color(40, 100, 70);
        myVector = myp5.createVector(10, 20, 30);
        myp5.storeItem('myBoolean', myBoolean);
        myp5.storeItem('myObject', myObject);
        myp5.storeItem('myNumber', myNumber);
        myp5.storeItem('myString', myString);
        myp5.storeItem('myColor', myColor);
        myp5.storeItem('myVector', myVector);
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
      assert.isTrue(
        localStorage.getItem('myBoolean' + hardCodedTypeID) === 'boolean'
      );
    });
    test('object storage should work', function() {
      assert.deepEqual(myp5.getItem('myObject'), {
        one: 1,
        two: { nested: true }
      });
    });
    test('object storage retrieval should store the correct type ID', function() {
      assert.isTrue(
        localStorage.getItem('myObject' + hardCodedTypeID) === 'object'
      );
    });
    test('number storage retrieval should work', function() {
      assert.isTrue(myp5.getItem('myNumber') === 46);
    });
    test('number storage should store the correct type ID', function() {
      assert.isTrue(
        localStorage.getItem('myNumber' + hardCodedTypeID) === 'number'
      );
    });
    test('string storage retrieval should work', function() {
      assert.isTrue(myp5.getItem('myString') === 'coolio');
    });
    test('string storage should store the correct type ID', function() {
      assert.isTrue(
        localStorage.getItem('myString' + hardCodedTypeID) === 'string'
      );
    });
    test('p5 Color should retrieve as p5 Color', function() {
      assert.isTrue(myp5.getItem('myColor') instanceof p5.Color);
    });
    test('p5 Vector should retrieve as p5 Vector', function() {
      assert.isTrue(myp5.getItem('myVector') instanceof p5.Vector);
    });
  });

  var checkRemoval = function(key) {
    myp5.removeItem(key);
    assert.deepEqual(myp5.getItem(key), null);
    assert.deepEqual(myp5.getItem(key + hardCodedTypeID), null);
  };

  suite('should be able to remove all items', function() {
    test('boolean should be removable', function() {
      checkRemoval('myBoolean');
    });

    test('number should be removable', function() {
      checkRemoval('myNumber');
    });

    test('object should be removable', function() {
      checkRemoval('myObject');
    });

    test('string should be removable', function() {
      checkRemoval('myString');
    });

    test('color should be removable', function() {
      checkRemoval('myColor');
    });

    test('vector should be removable', function() {
      checkRemoval('myVector');
    });
  });
});
