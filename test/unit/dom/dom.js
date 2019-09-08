/* global testSketchWithPromise */
suite('DOM', function() {
  suite('p5.prototype.select', function() {
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

    var elt;

    teardown(function() {
      if (elt && elt.parentNode) {
        elt.parentNode.removeChild(elt);
        elt = null;
      }
    });

    test('should find elements by ID', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'blarg');
      document.body.appendChild(elt);

      assert.strictEqual(myp5.select('#blarg').elt, elt);
    });

    test('should return null when elements by ID are not found', function() {
      assert.isNull(myp5.select('#blarg'));
    });

    test('should find elements by class', function() {
      elt = document.createElement('div');
      elt.setAttribute('class', 'blarg');
      document.body.appendChild(elt);

      assert.strictEqual(myp5.select('.blarg').elt, elt);
    });

    test('should return null when elements by class are not found', function() {
      assert.isNull(myp5.select('.blarg'));
    });

    test('should find elements by tag name', function() {
      elt = document.createElement('aside');
      document.body.appendChild(elt);

      assert.strictEqual(myp5.select('aside').elt, elt);
    });

    test('should return null when elements by tag name are not found', function() {
      assert.isNull(myp5.select('aside'));
    });

    test('should create an empty node when no html is provided', function() {
      const elem = myp5.createDiv();
      assert.strictEqual(elem.elt.innerHTML, '');
    });
  });

  suite('p5.prototype.createButton', function() {
    testSketchWithPromise('mousePressed works', function(
      sketch,
      resolve,
      reject
    ) {
      sketch.setup = function() {
        var elem = sketch.createButton('test');
        elem.mousePressed(resolve);
        elem.elt.dispatchEvent(new Event('mousedown'));
      };
    });
  });
  suite('p5.prototype.drop', function() {
    testSketchWithPromise('drop fires multiple events', function(
      sketch,
      resolve,
      reject
    ) {
      var myElt;
      var myFileFnCounter = 0;
      var myEventFnCounter = 0;
      sketch.setup = function() {
        myFileFnCounter = 0;
        myEventFnCounter = 0;
        myElt = sketch.createDiv('drop stuff');
        function hasFinished() {
          if (myFileFnCounter > 1 && myEventFnCounter === 1) {
            resolve();
          }
        }
        var myFileFn = function() {
          myFileFnCounter++;
          hasFinished();
        };
        var myEventFn = function() {
          myEventFnCounter++;
          hasFinished();
        };
        myElt.drop(myFileFn, myEventFn);
        assert.isFunction(myElt._events.drop);
        //Mock A File Drop Event.
        var file1 = new File(['foo'], 'foo.txt', {
          type: 'text/plain'
        });
        var file2 = new File(['foo'], 'foo.txt', {
          type: 'text/plain'
        });
        var myMockedEvent = new Event('drop');
        myMockedEvent.dataTransfer = { files: [file1, file2] };
        myElt.elt.dispatchEvent(myMockedEvent);
      };
    });
  });
});
