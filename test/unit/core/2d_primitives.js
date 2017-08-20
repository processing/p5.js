suite('2D Primitives', function() {

  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

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
      test('arc(): no friendly-err-msg', function() {
        assert.doesNotThrow(function() {
            myp5.arc(1, 1, 10.5, 10, 0, Math.PI, 'pie');
          },
          Error, 'got unwanted exception');
      });
      test('arc(): missing param #4, #5', function() {
        assert.doesNotThrow(function() {
            myp5.arc(1, 1, 10.5, 10);
          },
          Error, 'got unwanted exception');
      });
      test('arc(): wrong param type at #0', function() {
        assert.doesNotThrow(function() {
            myp5.arc('1', 1, 10.5, 10, 0, Math.PI, 'pie');
          },
          Error, 'got unwanted exception');
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
      test('ellipse(): no friendly-err-msg', function() {
        assert.doesNotThrow(function() {
            myp5.ellipse(0, 0, 100);
          },
          Error, 'got unwanted exception');
      });
      test('ellipse(): missing param #2', function() {
        assert.doesNotThrow(function() {
            myp5.ellipse(0, 0);
          },
          Error, 'got unwanted exception');
      });
      test('ellipse(): missing param #2', function() {
        assert.doesNotThrow(function() {
            var size;
            myp5.ellipse(0, 0, size);
          },
          Error, 'got unwanted exception');
      });
      test('ellipse(): wrong param type at #0', function() {
        assert.doesNotThrow(function() {
            myp5.ellipse('0', 0, 100, 100);
          },
          Error, 'got unwanted exception');
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
      test('line(): no friendly-err-msg, 2D', function() {
        assert.doesNotThrow(function() {
            myp5.line(0, 0, 100, 100);
          },
          Error, 'got unwanted exception');
      });
      test('line(): no friendly-err-msg, 3D', function() {
        assert.doesNotThrow(function() {
            myp5.line(0, 0, 100, 100, 20, Math.PI);
          },
          Error, 'got unwanted exception');
      });
      test('line(): missing param #3', function() {
        assert.doesNotThrow(function() {
            myp5.line(0, 0, Math.PI);
          },
          Error, 'got unwanted exception');
      });
      test('line(): missing param #4 ', function() { // this err case escapes
        assert.doesNotThrow(function() {
            var x3;
            myp5.line(0, 0, 100, 100, x3, Math.PI);
          },
          Error, 'got unwanted exception');
      });
      test('line(): wrong param type at #1', function() {
        assert.doesNotThrow(function() {
            myp5.line(0, '0', 100, 100);
          },
          Error, 'got unwanted exception');
      });
    });
  });

  suite('p5.prototype.point', function() {
    var point = p5.prototype.point;
    suite('point()', function() {
      test('should be a function', function() {
        assert.ok(point);
        assert.typeOf(point, 'function');
      });
      test('point(): no friendly-err-msg, 2D', function() {
        assert.doesNotThrow(function() {
            myp5.point(Math.PI, 0);
          },
          Error, 'got unwanted exception');
      });
      test('point(): no friendly-err-msg, 3D', function() {
        assert.doesNotThrow(function() {
            myp5.point(Math.PI, 0, 100);
          },
          Error, 'got unwanted exception');
      });
      test('point(): missing param #1', function() {
        assert.doesNotThrow(function() {
            myp5.point(0);
          },
          Error, 'got unwanted exception');
      });
      test('point(): missing param #3', function() { // this err case escapes
        assert.doesNotThrow(function() {
            var z;
            myp5.point(0, Math.PI, z);
          },
          Error, 'got unwanted exception');
      });
      test('point(): wrong param type at #1', function() {
        assert.doesNotThrow(function() {
            myp5.point(Math.PI, '0');
          },
          Error, 'got unwanted exception');
      });
    });
  });

  suite('p5.prototype.quad', function() {
    var quad = p5.prototype.quad;
    suite('quad()', function() {
      test('should be a function', function() {
        assert.ok(quad);
        assert.typeOf(quad, 'function');
      });
      test('quad(): no friendly-err-msg, 2D', function() {
        assert.doesNotThrow(function() {
            myp5.quad(Math.PI, 0, Math.PI, 5.1, 10, 5.1, 10, 0);
          },
          Error, 'got unwanted exception');
      });
      test('quad(): missing param #7', function() {
        assert.doesNotThrow(function() {
            myp5.quad(Math.PI, 0, Math.PI, 5.1, 10, 5.1, 10);
          },
          Error, 'got unwanted exception');
      });
      test('quad(): wrong param type at #1', function() {
        assert.doesNotThrow(function() {
            myp5.quad(Math.PI, '0', Math.PI, 5.1, 10, 5.1, 10, 0);
          },
          Error, 'got unwanted exception');
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
      test('rect(): no friendly-err-msg, format I', function() {
        assert.doesNotThrow(function() {
            myp5.rect(0, 0, 100, 100);
          },
          Error, 'got unwanted exception');
      });
      test('rect(): no friendly-err-msg, format II', function() {
        assert.doesNotThrow(function() {
            myp5.rect(0, 0, 100, 100, 1, Math.PI, 1, Math.PI);
          },
          Error, 'got unwanted exception');
      });
      test('rect(): missing param #3', function() {
        assert.doesNotThrow(function() {
            myp5.rect(0, 0, Math.PI);
          },
          Error, 'got unwanted exception');
      });
      test('rect(): missing param #4', function() { // this err case escapes
        assert.doesNotThrow(function() {
            var r1;
            myp5.rect(0, 0, 100, 100, r1, Math.PI, 1, Math.PI);
          },
          Error, 'got unwanted exception');
      });
      test('rect(): wrong param type at #1', function() {
        assert.doesNotThrow(function() {
            myp5.rect(0, '0', 100, 100);
          },
          Error, 'got unwanted exception');
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
      test('triangle(): no friendly-err-msg', function() {
        assert.doesNotThrow(function() {
            myp5.triangle(Math.PI, 0, Math.PI, 5.1, 10, 5.1);
          },
          Error, 'got unwanted exception');
      });
      test('triangle(): missing param #5', function() {
        assert.doesNotThrow(function() {
            myp5.triangle(Math.PI, 0, Math.PI, 5.1, 10);
          },
          Error, 'got unwanted exception');
      });
      test('triangle(): wrong param type at #1', function() {
        assert.doesNotThrow(function() {
            myp5.triangle(Math.PI, '0', Math.PI, 5.1, 10, 5.1);
          },
          Error, 'got unwanted exception');
      });
    });
  });

});
