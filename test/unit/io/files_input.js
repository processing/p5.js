suite('Files', function() {

  var httpDo = p5.prototype.httpDo;
  var loadJSON = p5.prototype.loadJSON;
  var loadStrings = p5.prototype.loadStrings;
  var loadXML = p5.prototype.loadXML;

  //variable for preload
  var preload = p5.prototype.preload;
  var result;

  // httpDo
  suite('httpDo()', function() {
    test('should be a function', function() {
      assert.ok(httpDo);
      assert.isFunction(httpDo);
    });

    test('should work when provided with just a path', function() {
      return new Promise(function(resolve, reject) {
        httpDo('unit/assets/sentences.txt', resolve, reject);
      }).then(function(data){
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept method parameter', function() {
      return new Promise(function(resolve, reject) {
        httpDo('unit/assets/sentences.txt', 'GET', resolve, reject);
      }).then(function(data){
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept type parameter', function() {
      return new Promise(function(resolve, reject) {
        httpDo('unit/assets/array.json', 'text', resolve, reject);
      }).then(function(data){
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept method and type parameter together', function() {
      return new Promise(function(resolve, reject) {
        httpDo('unit/assets/array.json', 'GET', 'text', resolve, reject);
      }).then(function(data){
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        httpDo('unit/assets/sen.txt', function(data){
          reject('Incorrectly succeeded.');
        }, resolve);
      }).then(function(err){
        assert.instanceOf(err, Response, 'err is a Response');
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });
  });

  // tests while preload is true without callbacks
  //p5.prototype.preload = function() {};
  preload = true;

  test('preload is a Boolean', function() {
    assert.typeOf(preload, 'Boolean');
  });

  // loadJSON()
  suite('loadJSON() in Preload', function () {
    test('should be a function', function() {
      assert.ok(loadJSON);
      assert.typeOf(loadJSON, 'function');
    });

    test('should return an Object', function() {
      result = loadJSON('unit/assets/array.json');
      assert.ok(result);
      assert.isObject(result, 'result is an object');
    });
  });

  // loadStrings()
  suite('loadStrings() in Preload', function(){
    test('should be a function', function() {
      assert.ok(loadStrings);
      assert.typeOf(loadStrings, 'function');
    });

    test('should return an array', function(){
      result = loadStrings('unit/assets/sentences.txt');
      assert.ok(result);
      assert.isArray(result, 'result is and array');
    });
  });

  // loadXML()
  suite('loadXML() in Preload', function(){
    test('should be a function', function(){
      assert.ok(loadXML);
      assert.typeOf(loadXML, 'function');
    });

    test('should return an Object', function() {
      result = loadXML('unit/assets/books.xml');
      assert.ok(result);
      assert.isObject(result, 'result is an object');
    });
  });

  //tests while preload is false with callbacks
  preload = false;

  // loadJSON()
  suite('p5.prototype.loadJSON', function() {
    test('should be a function', function() {
      assert.ok(loadJSON);
      assert.typeOf(loadJSON, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        loadJSON('unit/assets/array.json', resolve, reject);
      });
    });

    test('should pass an Array to callback function', function() {
      return new Promise(function(resolve, reject) {
        loadJSON('unit/assets/array.json', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 3, 'length of data is 3');
      });
    });

    test('should call error callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        loadJSON('unit/assets/arr.json', function(data) {
          reject('Success callback executed');
        }, resolve);
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        loadJSON('unit/assets/arr.json', function(data) {
          reject('Success callback executed');
        }, resolve);
      }).then(function(err) {
        assert.instanceOf(err, Response, 'err is a Response.');
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });

    // @TODO Need to check this does what it should
    test('should allow json to override jsonp in 3rd param', function() {
      return new Promise(function(resolve, reject) {
        result = loadJSON('unit/assets/array.json', resolve, reject, 'json');
      }).then(function(resp) {
        assert.ok(resp);
      });
    });
  });

  // loadStrings()
  suite('p5.prototype.loadStrings', function() {
    test('should be a function', function() {
      assert.ok(loadStrings);
      assert.typeOf(loadStrings, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        loadStrings('unit/assets/sentences.txt', resolve, reject);
      });
    });

    test('should pass an Array to callback function', function() {
      return new Promise(function(resolve, reject) {
        loadStrings('unit/assets/sentences.txt', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 68, 'length of data is 68');
      });
    });

    test('should call error callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        loadStrings('unit/assets/sen.txt', function(data) {
          reject('Success callback executed');
        }, resolve);
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        loadStrings('unit/assets/sen.txt', function(data) {
          reject('Success callback executed');
        }, resolve);
      }).then(function(err) {
        assert.instanceOf(err, Response, 'err is an object');
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });
  });

  // loadXML()
  suite('p5.prototype.loadXML', function(){
    test('should be a function', function(){
      assert.ok(loadXML);
      assert.typeOf(loadXML, 'function');
    });

    // Missing reference to parseXML, might need some test suite rethink
    // test('should call callback function if provided', function(done){
    //   result = loadXML('unit/assets/books.xml', function(data){
    //     done();
    //   });
    // });

    // test('should pass an Object to callback function', function(){
    //   result = loadXML('unit/assets/books.xml', function(data){
    //     console.log(data);
    //     assert.isObject(data);
    //   });
    // });
  });


  var loadTable = p5.prototype.loadTable;

  suite('p5.prototype.loadTable',function(){
    var url = 'unit/assets/csv.csv';

    test('should be a function', function(){
      assert.isFunction(loadTable);
    });

    test('should load a file without options',function(done) {
      var myCallback = function(resp){
        assert.ok(resp);
        done();
      };
      loadTable(url, myCallback);
    });

    test('the loaded file should be correct',function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(), 4);
        assert.strictEqual(resp.getRow(1).getString(0), 'David');
        assert.strictEqual(resp.getRow(1).getNum(1), 31);
        done();
      };
      loadTable(url, myCallback);
    });

    test('using the csv option works', function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(), 4);
        assert.strictEqual(resp.getRow(1).getString(0), 'David');
        assert.strictEqual(resp.getRow(1).getNum(1), 31);
        done();
      };
      loadTable(url, 'csv', myCallback);
    });

    test('using the csv and tsv options fails', function(){
      var fn = function(){
        loadTable(url, 'csv', 'tsv');
      };
      assert.throw(fn, 'Cannot set multiple separator types.');
    });

    test('using the header option works', function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(), 3);
        assert.strictEqual(resp.getRow(0).getString('name'), 'David');
        assert.strictEqual(resp.getRow(0).getNum('age'), 31);
        done();
      };
      loadTable(url, 'header', myCallback);
    });

    test('using the header and csv options together works', function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(), 3);
        assert.strictEqual(resp.getRow(0).getString('name'), 'David');
        assert.strictEqual(resp.getRow(0).getNum('age'), 31);
        done();
      };
      loadTable(url,'header', 'csv', myCallback);
    });

    test('CSV files should handle commas within quoted fields',function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(), 4);
        assert.equal(resp.getRow(2).get(0), 'David, Jr.');
        assert.equal(resp.getRow(2).getString(0), 'David, Jr.');
        assert.equal(resp.getRow(2).get(1), '11');
        assert.equal(resp.getRow(2).getString(1), 11);
        done();
      };
      loadTable(url, myCallback);
    });

    test('CSV files should handle escaped quotes and returns within quoted fields',function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(), 4);
        assert.equal(resp.getRow(3).get(0), 'David,\nSr. "the boss"');
        done();
      };
      loadTable(url, myCallback);
    });
  });

});
