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
  });

  // tests while preload is true without callbacks
  //p5.prototype.preload = function() {};
  preload = true;

  test('preload is a Boolean', function() {
    assert.typeOf(preload, 'Boolean');
  });

  //tests while preload is false with callbacks
  preload = false;

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
