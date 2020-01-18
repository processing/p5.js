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

  suite('p5.prototype.createSelect', function() {
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

    test('should create dropdown element', function() {
      let opt;
      let dropdown;
      elt = document.createElement('select');
      opt = document.createElement('option');
      opt.value = 'milk';
      opt.text = 'milk';
      elt.appendChild(opt);
      document.body.appendChild(elt);
      dropdown = myp5.createSelect();
      dropdown.option('milk');
      assert.deepEqual(JSON.stringify(dropdown.elt), JSON.stringify(elt));
    });

    test('should mark option default when called with selected() method', function() {
      let dropdown;
      let options = ['milk', 'oil', 'bread'];
      elt = document.createElement('select');
      for (let i = 0; i < options.length; i++) {
        let opt;
        if (options[i] === 'oil') {
          opt = new Option(options[i], options[i]);
          opt.setAttribute('selected', 'selected');
        } else {
          opt = new Option(options[i], options[i]);
        }
        elt.appendChild(opt);
      }

      dropdown = myp5.createSelect();
      dropdown.option('milk');
      dropdown.option('oil');
      dropdown.option('bread');
      dropdown.selected('oil');
      assert.strictEqual(
        dropdown.elt[dropdown.elt.selectedIndex].text,
        elt[elt.selectedIndex].text
      );
    });

    test('should disable an option when disable() method invoked with option name', function() {
      let dropdown;
      let options = ['milk', 'oil', 'bread'];
      elt = document.createElement('select');
      for (let i = 0; i < options.length; i++) {
        let opt;
        if (options[i] === 'oil') {
          opt = new Option(options[i], options[i]);
          opt.setAttribute('disabled', true);
        } else {
          opt = new Option(options[i], options[i]);
        }
        elt.appendChild(opt);
      }
      let disabledIndex;
      dropdown = myp5.createSelect();
      dropdown.option('milk');
      dropdown.option('oil');
      dropdown.option('bread');
      dropdown.disable('oil');
      for (let j = 0; j < dropdown.elt.length; j++) {
        if (dropdown.elt[j].disabled) {
          disabledIndex = j;
        }
      }
      assert.strictEqual(dropdown.elt[disabledIndex].text, 'oil');
    });

    test('should disable dropdown if disbale invoked with no parameter', function() {
      let dropdown = myp5.createSelect();
      dropdown.option('milk');
      dropdown.option('oil');
      dropdown.disable();
      assert.strictEqual(dropdown.elt.disabled, true);
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

  suite('p5.Element.prototype.position', function() {
    let paragraph = myp5.createP('out of box');
    paragraph.position(20, 20, 'static');

    elt = document.createElement('p');
    elt.appendChild(document.createTextNode('out of box'));
    elt.style.position = 'static';
    elt.style.left = '20px';
    elt.style.top = '20px';
    expect(JSON.stringify(paragraph.elt)).to.eql(JSON.stringify(elt));
  });
});
