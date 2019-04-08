suite('Files', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  //variable for preload
  var preload = p5.prototype.preload;
  var result;

  // httpDo
  suite('httpDo()', function() {
    test('should be a function', function() {
      assert.ok(myp5.httpDo);
      assert.isFunction(myp5.httpDo);
    });

    test('should work when provided with just a path', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/sentences.txt', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept method parameter', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/sentences.txt', 'GET', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept type parameter', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/array.json', 'text', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept method and type parameter together', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/array.json', 'GET', 'text', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo(
          'unit/assets/sen.txt',
          function(data) {
            reject('Incorrectly succeeded.');
          },
          resolve
        );
      }).then(function(err) {
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });

    test('should return a promise', function() {
      var promise = myp5.httpDo('unit/assets/sentences.txt');
      assert.instanceOf(promise, Promise);
      return promise.then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should return a promise that rejects on error', function() {
      return new Promise(function(resolve, reject) {
        var promise = myp5.httpDo('404file');
        assert.instanceOf(promise, Promise);
        promise.then(function(data) {
          reject(new Error('promise resolved.'));
        });
        resolve(
          promise.catch(function(error) {
            assert.instanceOf(error, Error);
          })
        );
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
  suite('loadJSON() in Preload', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadJSON);
      assert.typeOf(myp5.loadJSON, 'function');
    });

    test('should return an Object', function() {
      result = myp5.loadJSON('unit/assets/array.json');
      assert.ok(result);
      assert.isObject(result, 'result is an object');
    });
  });
  // loadXML()
  suite('loadXML() in Preload', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadXML);
      assert.typeOf(myp5.loadXML, 'function');
    });

    test('should return an Object', function() {
      result = myp5.loadXML('unit/assets/books.xml');
      assert.ok(result);
      assert.isObject(result, 'result is an object');
    });
  });

  // loadStrings()
  suite('loadStrings() in Preload', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadStrings);
      assert.typeOf(myp5.loadStrings, 'function');
    });

    test('should return an array', function() {
      result = myp5.loadStrings('unit/assets/sentences.txt');
      assert.ok(result);
      assert.isArray(result, 'result is and array');
    });
  });

  //tests while preload is false with callbacks
  preload = false;

  // myp5.loadJSON()
  suite('p5.prototype.myp5.loadJSON', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadJSON);
      assert.typeOf(myp5.loadJSON, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON('unit/assets/array.json', resolve, reject);
      });
    });

    test('should pass an Array to callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON('unit/assets/array.json', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 3, 'length of data is 3');
      });
    });

    test('should call error callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON(
          'unit/assets/arr.json',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON(
          'unit/assets/arr.json',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      }).then(function(err) {
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });

    // @TODO Need to check this does what it should
    test('should allow json to override jsonp', function() {
      return new Promise(function(resolve, reject) {
        result = myp5.loadJSON(
          'unit/assets/array.json',
          'json',
          resolve,
          reject
        );
      }).then(function(resp) {
        assert.ok(resp);
      });
    });
  });

  // loadXML()
  suite('p5.prototype.loadXML', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadXML);
      assert.typeOf(myp5.loadXML, 'function');
    });

    //Missing reference to parseXML, might need some test suite rethink
    // test('should call callback function if provided', function() {
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   });
    // });
    //
    // test('should pass an Object to callback function', function(){
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   }).then(function(data) {
    //     assert.isObject(data);
    //   });
    // });
  });

  // loadStrings()
  suite('p5.prototype.loadStrings', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadStrings);
      assert.typeOf(myp5.loadStrings, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings('unit/assets/sentences.txt', resolve, reject);
      });
    });

    test('should pass an Array to callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings('unit/assets/sentences.txt', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 68, 'length of data is 68');
      });
    });

    test('should include empty strings', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings('unit/assets/empty_lines.txt', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 6, 'length of data is 6');
      });
    });

    test('should call error callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings(
          'unit/assets/sen.txt',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings(
          'unit/assets/sen.txt',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      }).then(function(err) {
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });
  });

  suite('p5.prototype.loadTable', function() {
    var url = 'unit/assets/csv.csv';

    test('should be a function', function() {
      assert.isFunction(myp5.loadTable);
    });

    test('should load a file without options', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      });
    });

    test('the loaded file should be correct', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.strictEqual(resp.getRow(1).getString(0), 'David');
        assert.strictEqual(resp.getRow(1).getNum(1), 31);
      });
    });

    test('using the csv option works', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, 'csv', resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.strictEqual(resp.getRow(1).getString(0), 'David');
        assert.strictEqual(resp.getRow(1).getNum(1), 31);
      });
    });

    test('using the csv and tsv options fails', function() {
      var fn = function() {
        myp5.loadTable(url, 'csv', 'tsv');
      };
      assert.throw(fn, 'Cannot set multiple separator types.');
    });

    test('using the header option works', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, 'header', resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 3);
        assert.strictEqual(resp.getRow(0).getString('name'), 'David');
        assert.strictEqual(resp.getRow(0).getNum('age'), 31);
      });
    });

    test('using the header and csv options together works', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, 'header', 'csv', resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 3);
        assert.strictEqual(resp.getRow(0).getString('name'), 'David');
        assert.strictEqual(resp.getRow(0).getNum('age'), 31);
      });
    });

    test('CSV files should handle commas within quoted fields', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.equal(resp.getRow(2).get(0), 'David, Jr.');
        assert.equal(resp.getRow(2).getString(0), 'David, Jr.');
        assert.equal(resp.getRow(2).get(1), '11');
        assert.equal(resp.getRow(2).getString(1), 11);
      });
    });

    test('CSV files should handle escaped quotes and returns within quoted fields', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.equal(resp.getRow(3).get(0), 'David,\nSr. "the boss"');
      });
    });
  });

  // loadXML()
  suite('p5.prototype.loadXML', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadXML);
      assert.typeOf(myp5.loadXML, 'function');
    });

    //Missing reference to parseXML, might need some test suite rethink
    // test('should call callback function if provided', function() {
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   });
    // });
    //
    // test('should pass an Object to callback function', function(){
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   }).then(function(data) {
    //     assert.isObject(data);
    //   });
    // });
  });

  // loadBytes()
  suite('p5.prototype.loadBytes', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadBytes);
      assert.typeOf(myp5.loadBytes, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      });
    });

    test('should call error callback function if not found', function() {
      var errorCalled = false;
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('notfound.jpg', resolve, reject);
      })
        .catch(function() {
          errorCalled = true;
        })
        .then(function() {
          assert.isTrue(errorCalled);
        });
    });

    test('should pass an Object to callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      }).then(function(data) {
        assert.isObject(data);
      });
    });

    test('data.bytes should be an Array/Uint8Array', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      }).then(function(data) {
        expect(data.bytes).to.satisfy(function(v) {
          return Array.isArray(v) || v instanceof Uint8Array;
        });
      });
    });

    test('should load correct data', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      }).then(function(data) {
        var str = 'GIF89a';
        // convert the string to a byte array
        var rgb = str.split('').map(function(e) {
          return e.charCodeAt(0);
        });
        // this will convert a Uint8Aray to [], if necessary:
        var loaded = Array.prototype.slice.call(data.bytes, 0, str.length);
        assert.deepEqual(loaded, rgb);
      });
    });
  });
});
