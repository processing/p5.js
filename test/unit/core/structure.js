suite('Structure', function() {

  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  teardown(function(){
    myp5.clear();
  });

  suite('p5.prototype.push and p5.prototype.pop', function() {
    function getRenderState() {
      var state = {};
      for (var key in myp5._renderer) {
        var value = myp5._renderer[key];
        if (typeof value !== 'function') {
          state[key] = value;
        }
      }
      return state;
    }

    function assertCanPreserveRenderState(work) {
      var originalState = getRenderState();
      myp5.push();
      work();
      myp5.pop();
      assert.deepEqual(getRenderState(), originalState);
    }

    test('leak no state after fill()', function() {
      myp5.noFill();
      assertCanPreserveRenderState(function () {
        myp5.fill('red');
      });
    });

    test('leak no state after noFill()', function () {
      myp5.fill('red');
      assertCanPreserveRenderState(function () {
        myp5.noFill();
      });
    });

    test('leak no state after stroke()', function() {
      myp5.noStroke();
      assertCanPreserveRenderState(function () {
        myp5.stroke('red');
      });
    });

    test('leak no state after noStroke()', function () {
      myp5.stroke('red');
      assertCanPreserveRenderState(function () {
        myp5.noStroke();
      });
    });

    test('leak no state after tint()', function() {
      myp5.noTint();
      assertCanPreserveRenderState(function () {
        myp5.tint(255, 0, 0);
      });
    });

    test('leak no state after noTint()', function () {
      myp5.tint(255, 0, 0);
      assertCanPreserveRenderState(function () {
        myp5.noTint();
      });
    });

    test('leak no state after strokeWeight()', function () {
      myp5.strokeWeight(1);
      assertCanPreserveRenderState(function () {
        myp5.strokeWeight(10);
      });
    });

    test('leak no state after strokeCap()', function () {
      myp5.strokeCap(p5.ROUND);
      assertCanPreserveRenderState(function () {
        myp5.strokeCap(p5.SQUARE);
      });
    });

    test('leak no state after strokeJoin()', function () {
      myp5.strokeJoin(p5.BEVEL);
      assertCanPreserveRenderState(function () {
        myp5.strokeJoin(p5.MITER);
      });
    });

    test('leak no state after imageMode()', function () {
      myp5.imageMode(p5.CORNER);
      assertCanPreserveRenderState(function () {
        myp5.imageMode(p5.CENTER);
      });
    });

    test('leak no state after rectMode()', function () {
      myp5.rectMode(p5.CORNER);
      assertCanPreserveRenderState(function () {
        myp5.rectMode(p5.CENTER);
      });
    });

    test('leak no state after ellipseMode()', function () {
      myp5.ellipseMode(p5.CORNER);
      assertCanPreserveRenderState(function () {
        myp5.ellipseMode(p5.CENTER);
      });
    });

    test('leak no state after colorMode()', function () {
      myp5.colorMode(p5.HSB);
      assertCanPreserveRenderState(function () {
        myp5.colorMode(p5.RGB);
      });
    });

    test('leak no state after textAlign()', function () {
      myp5.textAlign(p5.RIGHT, p5.BOTTOM);
      assertCanPreserveRenderState(function () {
        myp5.textAlign(p5.CENTER, p5.CENTER);
      });
    });

    test('leak no state after textFont()', function () {
      myp5.textFont('Georgia');
      assertCanPreserveRenderState(function () {
        myp5.textFont('Helvetica');
      });
    });

    test('leak no state after textStyle()', function () {
      myp5.textStyle(p5.ITALIC);
      assertCanPreserveRenderState(function () {
        myp5.textStyle(p5.BOLD);
      });
    });

    test('leak no state after textSize()', function () {
      myp5.textSize(12);
      assertCanPreserveRenderState(function () {
        myp5.textSize(16);
      });
    });

    test('leak no state after textLeading()', function () {
      myp5.textLeading(20);
      assertCanPreserveRenderState(function () {
        myp5.textLeading(30);
      });
    });
  });

});
