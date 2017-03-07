suite('Files', function() {

  var loadJSON = p5.prototype.loadJSON;
  var loadStrings = p5.prototype.loadStrings;

  //variable for preload
  var preload = p5.prototype.preload;
  var result;

  // tests while preload is true without callbacks
  //p5.prototype.preload = function() {};
  preload = true;

  test('preload is a Boolean', function() {
    assert.typeOf(preload, 'Boolean');
  });

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

  //tests while preload is false with callbacks
  preload = false;

  suite('p5.prototype.loadJSON', function() {
    test('should be a function', function() {
      assert.ok(loadJSON);
      assert.typeOf(loadJSON, 'function');
    });

    test('should call callback function if provided', function(done){
      result = loadJSON('unit/assets/array.json', function(data){
        done();
      });
    });

    test('should pass an Array to callback function', function(){
      result = loadJSON('unit/assets/array.json', function(data){
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 3, 'length of data is 3');
      });
    });

    test('should call error callback function if provided', function(done){
      result = loadJSON('unit/assets/arr.json', function(data){}, function(){
        done();
      });
    });

    test('should pass error object to error callback function', function() {
      result = loadJSON('unit/assets/arr.json', function(data){
        // should really be an empty object or never called
        assert.isUndefined(data, 'data is undefined');
      }, function(err){
        assert.isObject(err, 'err is an object');
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });

    /*test('should allow json to override jsonp in 3rd param',
      function(done){

        var url = 'http://localhost:9001/unit/assets/array.json';
        var datatype = 'json';
        var myCallback = function(resp){
          assert.ok(resp);
          //assert.typeOf(resp,'Object');
          done();
        };
        result = loadJSON(url,myCallback,datatype);
    });*/
  });

  suite('p5.prototype.loadStrings', function() {
    test('should be a function', function() {
      assert.ok(loadStrings);
      assert.typeOf(loadStrings, 'function');
    });

    test('should call callback function if provided', function(done){
      result = loadStrings('unit/assets/sentences.txt', function(data){
        done();
      });
    });

    test('should pass an Array to callback function', function(){
      result = loadStrings('unit/assets/sentences.txt', function(data){
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 68, 'length of data is 68');
      });
    });

    test('should call error callback function if provided', function(done){
      result = loadStrings('unit/assets/sen.txt', function(data){}, function(){
        done();
      });
    });

    test('should pass error object to error callback function', function() {
      result = loadStrings('unit/assets/sen.txt', function(data){
        // should really be an empty object or never called
        assert.isUndefined(data, 'data is undefined');
      }, function(err){
        assert.isObject(err, 'err is an object');
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });
  });
  /*
  var loadTable = p5.prototype.loadTable;


  suite('p5.prototype.loadTable',function(){
    var url = 'http://localhost:9001/unit/assets/csv.csv';

    test('should be a function', function(){
      assert.isFunction(loadTable);
    });

    test('should load a file without options',function(done) {
      var myCallback = function(resp){
        assert.ok(resp);
        done();
      };
      loadTable(url,myCallback);
    });

    test('the loaded file should be correct',function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(),4);
        assert.strictEqual(resp.getRow(1).getString(0),'David');
        assert.strictEqual(resp.getRow(1).getNum(1),31);
        done();
      };
      loadTable(url,myCallback);
    });

    test('using the csv option works', function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(),4);
        assert.strictEqual(resp.getRow(1).getString(0),'David');
        assert.strictEqual(resp.getRow(1).getNum(1),31);
        done();
      };
      loadTable(url,'csv',myCallback);
    });
    test('using the csv and tsv options fails', function(){
      var fn = function(){loadTable(url,'csv','tsv');};
      assert.throw(fn,'Cannot set multiple separator types.');
    });

    test('using the header option works', function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(),3);
        assert.strictEqual(resp.getRow(0).getString('name'),'David');
        assert.strictEqual(resp.getRow(0).getNum('age'),31);
        done();
      };
      loadTable(url,'header',myCallback);
    });
    test('using the header and csv options together works', function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(),3);
        assert.strictEqual(resp.getRow(0).getString('name'),'David');
        assert.strictEqual(resp.getRow(0).getNum('age'),31);
        done();
      };
      loadTable(url,'header', 'csv', myCallback);
    });

    test('CSV files should handle commas within quoted fields',function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(),4);
        assert.equal(resp.getRow(2).get(0),'David, Jr.');
        assert.equal(resp.getRow(2).getString(0),'David, Jr.');
        assert.equal(resp.getRow(2).get(1),'11');
        assert.equal(resp.getRow(2).getString(1),11);
        done();
      };
      loadTable(url,myCallback);
    });
    test('CSV files should handle escaped quotes and returns within quoted fields',function(done){
      var myCallback = function(resp){
        assert.equal(resp.getRowCount(),4);
        assert.equal(resp.getRow(3).get(0),'David,\nSr. "the boss"');
        done();
      };
      loadTable(url,myCallback);
    });
  });
  */
});
