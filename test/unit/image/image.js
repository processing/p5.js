suite.only('image', function() {
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

  suite('p5.prototype.saveCanvas', function() {
    test('should be a function', function() {
      assert.ok(myp5.saveCanvas);
      assert.typeOf(myp5.saveCanvas, 'function');
    });
    test('no friendly-err-msg. missing extension param #3.', function() {
      assert.doesNotThrow(
        function() {
          let c = myp5.createCanvas(100, 100);
          myp5.saveCanvas(c, 'myCanvas');
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. missing extension param #2 and #3.', function() {
      assert.doesNotThrow(
        function() {
          let c = myp5.createCanvas(100, 100);
          myp5.saveCanvas(c);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.createCanvas(100, 100);
        myp5.saveCanvas(10);
      });
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          let c = myp5.createCanvas(100, 100);
          myp5.saveCanvas(c, 'myCanvas');
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.saveFrames', function() {
    test('should be a function', function() {
      assert.ok(myp5.saveFrames);
      assert.typeOf(myp5.saveFrames, 'function');
    });
    test('no friendly-err-msg. correct 4 parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.saveFrames('out', 'png', 1, 25, data => {
            print(data);
          });
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. missing callback param #4', function() {
      assert.doesNotThrow(
        function() {
          myp5.saveFrames('out', 'png', 1, 25);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('wrong number of params , 3 params', function() {
      assert.validationError(function() {
        myp5.saveFrames('out', 'png', 1);
      });
    });
  });
});
