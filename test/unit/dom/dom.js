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
    let myp5;
    let testElement;

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
      if (testElement && testElement.parentNode) {
        testElement.parentNode.removeChild(testElement);
        testElement = null;
      }
    });

    const createHTMLSelect = options => {
      const selectElement = document.createElement('select');
      for (const optionName of options) {
        const option = document.createElement('option');
        option.setAttribute('label', optionName);
        option.setAttribute('value', optionName);
        selectElement.add(option);
      }
      return selectElement;
    };

    test('should be a function', function() {
      assert.isFunction(myp5.createSelect);
    });

    test('should return p5.Element of select HTML Element', function() {
      testElement = myp5.createSelect();
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLSelectElement);
    });

    test('should return p5.Element when select element is passed', function() {
      selectElement = createHTMLSelect(['option1', 'option2']);
      testElement = myp5.createSelect(selectElement);
      assert.deepEqual(testElement.elt, selectElement);
    });

    test('calling option(newName) should add a new option', function() {
      const testOptions = ['John', 'Bethany', 'Dwayne'];
      testElement = myp5.createSelect();
      for (const optionName of testOptions) testElement.option(optionName);

      const htmlOptions = [];
      for (const optionName of testElement.elt.options) {
        assert.deepEqual(optionName.label, optionName.value);
        htmlOptions.push(optionName.label);
      }
      assert.deepEqual(htmlOptions, testOptions);
    });

    test('calling option(name, newValue) should update value of option', function() {
      const optionName = 'john';
      const testValues = [1, 'abc', true];
      testElement = myp5.createSelect();
      testElement.option(optionName, 0);

      for (const newValue of testValues) {
        testElement.option(optionName, newValue);
        const htmlValue = testElement.elt.options[0].value;
        assert(htmlValue, newValue);
      }
    });

    test('calling value() should return current selected option', function() {
      testElement = myp5.createSelect();
      testElement.option('Sunday');
      testElement.option('Monday');
      testElement.elt.options[1].selected = true;
      assert(testElement.value(), 'Monday');
    });

    test('calling selected() should return all selected options', function() {
      testElement = myp5.createSelect(true);
      options = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (const optionName of options) testElement.option(optionName);

      // Select multiple options
      const selectedOptions = options.slice(0, 3);
      for (let i = 0; i < selectedOptions.length; i++) {
        testElement.elt.options[i].selected = true;
        assert.deepEqual(
          testElement.selected(),
          selectedOptions.slice(0, i + 1)
        );
      }
    });

    test('calling selected(value) should updated selectedIndex', function() {
      testElement = myp5.createSelect(true);
      options = ['Sunday', 'Monday', 'Tuesday', 'Friday'];
      for (const optionName of options) testElement.option(optionName);

      // Select multiple options and check if the values get updated
      for (let i = 0; i < options.length; i++) {
        testElement.selected(options[i]);
        const selectedIndexValue =
          testElement.elt.options[testElement.elt.selectedIndex].value;
        assert.deepEqual(selectedIndexValue, options[i]);
      }
    });

    test('calling disable() should disable the whole dropdown', function() {
      testElement = myp5.createSelect(true);
      testElement.disable();

      assert.isTrue(testElement.elt.disabled);
    });

    test('should disable an option when disable() method invoked with option name', function() {
      testElement = myp5.createSelect(true);
      options = ['Sunday', 'Monday', 'Tuesday', 'Friday'];
      for (const optionName of options) testElement.option(optionName);

      const disabledIndex = 2;
      testElement.disable(options[disabledIndex]);
      assert.isTrue(testElement.elt.options[disabledIndex].disabled);
      assert.isFalse(testElement.elt.options[disabledIndex].selected);
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

    test('should match properties with dummy element', function() {
      let paragraph = myp5.createP('out of box');
      paragraph.position(20, 20, 'static');

      elt = document.createElement('p', 'out of box');
      elt.style.position = 'static';
      elt.style.left = '20px';
      elt.style.top = '20px';
      expect(JSON.stringify(paragraph.elt)).to.eql(JSON.stringify(elt));
    });
  });

  suite('p5.prototype.createSlider', function() {
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

    test('should be instance of p5.Element', () => {
      expect(myp5.createSlider(5, 10) instanceof p5.Element).to.eql(true);
    });

    test('should create a slider', function() {
      let slider = myp5.createSlider(5, 10, 8, 1);
      elt = document.createElement('input');
      elt.type = 'range';
      elt.min = 5;
      elt.max = 10;
      elt.step = 1;
      elt.value = 8;
      expect(JSON.stringify(slider.elt)).to.eql(JSON.stringify(elt));
    });
  });

  suite('p5.prototype.createA', function() {
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

    test('should be instance of p5.Element', () => {
      expect(
        myp5.createA('http://p5js.org/', 'this is a link') instanceof p5.Element
      ).to.eql(true);
    });

    test('should create anchor tag', function() {
      let anchor = myp5.createA('http://p5js.org/', 'p5');
      elt = document.createElement('a');
      elt.href = 'http://p5js.org/';
      elt.innerHTML = 'p5';
      expect(JSON.stringify(anchor.elt)).to.eql(JSON.stringify(elt));
    });
  });

  suite('p5.prototype.createCapture', function() {
    // to run these tests, getUserMedia is required to be supported
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      throw Error(
        'Cannot run tests as getUserMedia not supported in this browser'
      );
    }

    let myp5;
    let testElement;

    setup(function(done) {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          done();
        };
      });
    });

    teardown(function() {
      if (testElement && testElement.parentNode) {
        testElement.parentNode.removeChild(testElement);
      }
      testElement = null;
      myp5.remove();
    });

    test('should be a function', function() {
      assert.isFunction(myp5.createCapture);
    });

    test('should return p5.Element of video type', function() {
      testElement = myp5.createCapture(myp5.VIDEO);
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLVideoElement);
    });

    test('should throw error if getUserMedia is not supported', function() {
      // Remove getUserMedia method and test
      const backup = navigator.mediaDevices.getUserMedia;
      navigator.mediaDevices.getUserMedia = undefined;
      try {
        testElement = myp5.createCapture(myp5.VIDEO);
        assert.fail();
      } catch (error) {
        assert.instanceOf(error, DOMException);
      }

      // Restore backup, very important.
      navigator.mediaDevices.getUserMedia = backup;
    });

    testSketchWithPromise(
      'triggers the callback after loading metadata',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          testElement = myp5.createCapture(myp5.VIDEO, resolve);
          const mockedEvent = new Event('loadedmetadata');
          testElement.elt.dispatchEvent(mockedEvent);
        };
      }
    );

    // Required for ios 11 devices
    test('should have playsinline attribute to empty string on DOM element', function() {
      testElement = myp5.createCapture(myp5.VIDEO);
      console.log(testElement.elt);
      // Weird check, setter accepts : playinline, getter accepts playInline
      assert.isTrue(testElement.elt.playsInline);
    });
  });

  suite('p5.prototype.removeElements', function() {
    let myp5;
    let myp5Container;

    setup(function(done) {
      myp5Container = document.createElement('div');
      document.body.appendChild(myp5Container);
      new p5(function(p) {
        p.setup = function() {
          // configure p5 to not add a canvas by default.
          p.noCanvas();
          myp5 = p;
          done();
        };
      }, myp5Container);
    });

    teardown(function() {
      myp5.remove();
      if (myp5Container && myp5Container.parentNode) {
        myp5Container.parentNode.removeChild(myp5Container);
      }
      myp5Container = null;
    });

    test('should remove all elements created by p5 except Canvas', function() {
      // creates 6 elements one of which is a canvas, then calls
      // removeElements and tests if only canvas is left.
      const tags = ['a', 'button', 'canvas', 'div', 'p', 'video'];
      for (const tag of tags) {
        myp5.createElement(tag);
      }
      // Check if all elements are created.
      assert.deepEqual(myp5Container.childElementCount, tags.length);

      // Call removeElements and check if only canvas is remaining
      myp5.removeElements();
      assert.deepEqual(myp5Container.childElementCount, 1);
      const remainingElement = myp5Container.children[0];
      assert.instanceOf(remainingElement, HTMLCanvasElement);
    });
  });
});
