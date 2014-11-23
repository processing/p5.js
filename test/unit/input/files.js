suite('Files', function() {

  var loadJSON = p5.prototype.loadJSON;
  // var loadStrings = p5.prototype.loadStrings;

  //variable for preload
  var preload = p5.prototype.preload;
  var result;


  //tests while preload is true without callbacks
  preload = true;
  test('preload is a Boolean', function() {
    assert.typeOf(preload, 'Boolean');
  });

  suite('loadJSON() in Preload', function () {
    test('should be a function', function() {
      assert.ok(loadJSON);
      assert.typeOf(loadJSON, 'function');
    });
    test('should return an Array', function() {
      result = loadJSON('array.json');
      assert.ok(result);
      // assert.isObject(result, 'result is an object');
      assert.typeOf(result, 'Array');
      // assert.lengthOf(result, 2);
    });
    // test('should return an Object', function() {
    //   assert.isObject(result, ['the result is an object'])
    // });
  });


  //   test('should be a function', function( {
  //     assert.ok(loadJSON);
  //     assert.typeOf(loadJSON, 'function');
  //   });
  //   test('in preload, should return an object', function() {
  //     result = loadJSON("array.json");
  //     assert.typeOf(result, 'Object');
  //   });
  //   test('should return an error', function() {
  //     result = loadJSON("arr.json");
  //     assert.typeOf(result, 'nothing');
  //   });
  // });

  // test('loadStrings in preload without callback', function(
  // result = loadStrings('sentences.txt');
  // assert.ok(result);
  // )};

  //tests while preload is false with callbacks
  preload = false;

  suite('p5.prototype.loadJSON', function(){
    test('should be a function', function(){
      assert.ok(loadJSON);
      assert.typeOf(loadJSON, 'function');
    });
    test('should allow json to override jsonp in 3rd param',
      function(done){
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=Atlanta';
        var datatype = 'json';
        var myCallback = function(resp){
          assert.ok(resp);
          //assert.typeOf(resp,'Object');
          done();
        };
        result = loadJSON(url,myCallback,datatype);
    });

  });

});