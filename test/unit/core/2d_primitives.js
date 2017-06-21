suite('2D Primitives', function() {

  var myp5 = new p5(function(p) {
    p.setup = function() {};
    p.draw = function() {};
  });

  if (!window.Modernizr.webgl) {
    return;
  }

  // var myp5webgl;
  //
  // setup(function() {
  //   myp5webgl = new p5(function(p) {
  //     p.setup = function() {
  //       p.createCanvas(100, 100, p.WEBGL);
  //     };
  //   });
  // });

  teardown(function() {
    myp5.clear();
  });

  suite('p5.prototype.arc', function() {
    var arc = p5.prototype.arc;
    suite('arc()', function() {
      test('should be a function', function() {
        assert.ok(arc);
        assert.typeOf(arc, 'function');
      });
      test('parameter check and no err (with MODE value)', function() {
        assert.doesNotThrow(function() {
            myp5.arc(1, 1, 10.5, 10, 0, Math.PI, 'pie');
          },
          Error, 'got unwanted exception');
      });
      test('parameter check and no err (without MODE value)', function() {
        assert.doesNotThrow(
          function() {
            myp5.arc(1, 1, 10.5, 10, 0, Math.PI);
          },
          Error, 'got unwanted exception');
      });
      test('parameter check and throws err (empty variable)', function() {
        assert.throws(function() {
            myp5.arc(1, 1, 10.5, 10);
          },
          /EMPTY_VAR/,
          'did not throw with expected message!');
      });
      test('parameter check and throws err (wrong type)', function() {
        assert.throws(function() {
            myp5.arc('1', 1, 10.5, 10, 0, Math.PI, 'pie');
          },
          /WRONG_TYPE/, 'did not throw with expected message!');
      });
    });
  });
  suite('p5.prototype.ellipse', function() {
    var ellipse = p5.prototype.ellipse;
    suite('ellipse()', function() {
      test('should be a function', function() {
        assert.ok(ellipse);
        assert.typeOf(ellipse, 'function');
      });
      // test('should draw', function(done) {
      //   myp5.background(155);
      //   myp5.fill(0);
      //   myp5.ellipse(0, 0, 100, 100);
      //
      //   testRender('unit/assets/renders/ellipse.png', myp5, function(res) {
      //     assert.isTrue(res);
      //     done();
      //   });
      // });
      test('parameter check and no err', function() {
        assert.doesNotThrow(
          function() {
            myp5.ellipse(0, 10.5, 30);
          },
          Error, 'got unwanted exception');
      });
      test('parameter check and throws err (empty variable)', function() {
        assert.throws(function() {
            myp5.ellipse(0, 10.5);
          },
          /EMPTY_VAR/, 'did not throw with expected message!');
      });
      test('parameter check and throws err (wrong type I)', function() {
        assert.throws(function() {
          myp5.ellipse('0', 10.5, 30);
        }, /WRONG_TYPE/, 'did not throw with expected message!');
      });
      test('parameter check and throws err (wrong type II)', function() {
        assert.throws(function() {
          myp5.ellipse(0, 10.5, '30');
        }, /WRONG_TYPE/, 'did not throw with expected message!');
      });
    });
  });

  suite('p5.prototype.line', function() {
    var line = p5.prototype.line;
    suite('line()', function() {
      test('should be a function', function() {
        assert.ok(line);
        assert.typeOf(line, 'function');
      });
      // test('should draw', function(done) {
      //   myp5.background(155);
      //   myp5.fill(0);
      //   myp5.line(0, 0, 100, 100);
      //
      //   testRender('unit/assets/renders/line.png', myp5, function(res) {
      //     assert.isTrue(res);
      //     done();
      //   });
      // });
      test('parameter check and no err 2D', function() {
        assert.doesNotThrow(function() {
            myp5.line(0, 0.5, 10, 10.5);
          },
          Error, 'got unwanted exception');
      });
      // test('parameter check and no err 3D', function() {
      //   assert.doesNotThrow(function() {
      //       myp5webgl.line(0, 0.5, 10, 10.5, 20, 20.5);
      //     },
      //     Error, 'got unwanted exception');
      // });
      test('parameter check and throws err (empty variable)', function() {
        assert.throws(function() {
            myp5.line(0, 0.5, 10);
          },
          /EMPTY_VAR/, 'did not throw with expected message!');
      });
      // test('parameter check and throws err (empty variable)', function() {
      //   assert.throws(function() {
      //       myp5.line(0, 0.5, 10, 10.5, 20);
      //     },
      //     /EMPTY_VAR/, 'did not throw with expected message!');
      // });
      test('parameter check and throws err (wrong type)', function() {
        assert.throws(function() {
          myp5.line(0, 10, '30', 30.5);
        }, /WRONG_TYPE/, 'did not throw with expected message!');
      });
    });
  });

  suite('p5.prototype.rect', function() {
    var rect = p5.prototype.rect;
    suite('rect()', function() {
      test('should be a function', function() {
        assert.ok(rect);
        assert.typeOf(rect, 'function');
      });
      test('parameter check and no err', function() {
        assert.doesNotThrow(
          function() {
            myp5.rect(0, 10.5, 30, -20);
          },
          Error, 'got unwanted exception');
      });
      test('parameter check and throws err (empty variable)', function() {
        assert.throws(function() {
            myp5.rect(0, 10.5, 30);
          },
          /EMPTY_VAR/, 'did not throw with expected message!');
      });
      test('parameter check and throws err (wrong type)', function() {
        assert.throws(function() {
          myp5.rect(0, 10.5, '30', -20);
        }, /WRONG_TYPE/, 'did not throw with expected message!');
      });
    });
  });

  suite('p5.prototype.triangle', function() {
    var triangle = p5.prototype.triangle;
    suite('triangle()', function() {
      test('should be a function', function() {
        assert.ok(triangle);
        assert.typeOf(triangle, 'function');
      });
      test('parameter check and no err', function() {
        assert.doesNotThrow(
          function() {
            myp5.triangle(0, 10.5, 30, -20, 10, 10);
          },
          Error, 'got unwanted exception');
      });
      test('parameter check and throws err (empty variable)', function() {
        assert.throws(function() {
            myp5.triangle(0, 10.5, 30, -20, 10);
          },
          /EMPTY_VAR/, 'did not throw with expected message!');
      });
      test('parameter check and throws err (wrong type)', function() {
        assert.throws(function() {
          myp5.triangle(0, 10.5, '30', -20, 10, 10);
        }, /WRONG_TYPE/, 'did not throw with expected message!');
      });
    });
  });
});
