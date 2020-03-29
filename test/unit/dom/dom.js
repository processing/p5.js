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

  suite('p5.prototype.createFileInput', function() {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      throw Error(
        'File API not supported in test environment. Cannot run tests'
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

    const emptyCallback = () => {};
    const createDummyFile = filename => {
      return new File(['testFileBlob'], filename, {
        type: 'text/plain'
      });
    };

    test('should be a function', function() {
      assert.isFunction(myp5.createFileInput);
    });

    test('should return input of file input', function() {
      testElement = myp5.createFileInput(emptyCallback);
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLInputElement);
      assert.deepEqual(testElement.elt.type, 'file');
    });

    testSketchWithPromise(
      'should trigger callback on input change event',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          testElement = myp5.createFileInput(resolve);
          const testFile = createDummyFile('file');
          testElement.files = testFile;

          const mockedEvent = new Event('change');
          const mockedDataTransfer = new DataTransfer();
          mockedDataTransfer.items.add(testFile);
          testElement.elt.files = mockedDataTransfer.files;
          testElement.elt.dispatchEvent(mockedEvent);
        };
      }
    );

    test('should accept multiple files if specified', function() {
      testElement = myp5.createFileInput(emptyCallback, true);
      assert.isTrue(testElement.elt.multiple);
    });

    testSketchWithPromise(
      'should trigger callback for each file if multiple files are given',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          let totalTriggers = 0;
          let filesCount = 7;

          const handleFiles = event => {
            totalTriggers += 1;
            if (totalTriggers === filesCount) resolve();
          };

          const mockedEvent = new Event('change');
          const mockedDataTransfer = new DataTransfer();
          for (let i = 0; i < filesCount; i += 1) {
            mockedDataTransfer.items.add(createDummyFile(i.toString()));
          }

          testElement = myp5.createFileInput(handleFiles, true);
          testElement.elt.files = mockedDataTransfer.files;
          testElement.elt.dispatchEvent(mockedEvent);
        };
      }
    );
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

  suite('p5.prototype.createDiv', function() {
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
      }
      testElement = null;
    });

    test('should be a function', function() {
      assert.isFunction(myp5.createDiv);
    });

    test('should return a p5.Element of div type', function() {
      testElement = myp5.createDiv();
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLDivElement);
    });

    test('should set given param as innerHTML of div', function() {
      const testHTML = '<p>Hello</p>';
      testElement = myp5.createDiv(testHTML);
      assert.deepEqual(testElement.elt.innerHTML, testHTML);
    });
  });

  suite('p5.prototype.createP', function() {
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
      }
      testElement = null;
    });

    test('should be a function', function() {
      assert.isFunction(myp5.createP);
    });

    test('should return a p5.Element of p type', function() {
      testElement = myp5.createP();
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLParagraphElement);
    });

    test('should set given param as innerHTML of p', function() {
      const testHTML = '<b>Hello</b>';
      testElement = myp5.createP(testHTML);
      assert.deepEqual(testElement.elt.innerHTML, testHTML);
    });
  });

  suite('p5.prototype.createSpan', function() {
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
      }
      testElement = null;
    });

    test('should be a function', function() {
      assert.isFunction(myp5.createSpan);
    });

    test('should return a p5.Element of span type', function() {
      testElement = myp5.createSpan();
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLSpanElement);
    });

    test('should set given param as innerHTML of span', function() {
      const testHTML = '<em>Hello</em>';
      testElement = myp5.createSpan(testHTML);
      assert.deepEqual(testElement.elt.innerHTML, testHTML);
    });
  });

  suite('p5.prototype.createImg', function() {
    let myp5;
    let testElement;
    const imagePath = 'unit/assets/cat.jpg';

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
      }
      testElement = null;
    });

    test('should be a function', function() {
      assert.isFunction(myp5.createImg);
    });

    test('should return p5.Element of image type', function() {
      testElement = myp5.createImg(imagePath, '');
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLImageElement);
    });

    test('should set src of image from params', function() {
      testElement = myp5.createImg(imagePath, '');
      assert.isTrue(testElement.elt.src.endsWith(imagePath));
    });

    test('should set alt from params if given', function() {
      const alternativeText = 'Picture of a cat';
      testElement = myp5.createImg(imagePath, alternativeText);
      assert.deepEqual(testElement.elt.alt, alternativeText);
    });

    test('should set crossOrigin from params if given', function() {
      const crossOrigin = 'anonymous';
      testElement = myp5.createImg(imagePath, '', crossOrigin);
      assert.deepEqual(testElement.elt.crossOrigin, crossOrigin);
    });

    testSketchWithPromise(
      'should trigger callback when image is loaded',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          testElement = sketch.createImg(imagePath, '', '', resolve);
          testElement.elt.dispatchEvent(new Event('load'));
        };
      }
    );
  });

  suite('p5.prototype.createColorPicker', function() {
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
      }
      testElement = null;
    });

    test('should be a function', function() {
      assert.isFunction(myp5.createColorPicker);
    });

    test('should return p5.Element of input[color] type', function() {
      testElement = myp5.createColorPicker();

      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLInputElement);
      assert.deepEqual(testElement.elt.type, 'color');
    });

    test('should accept a p5.Color as param', function() {
      const testColor = myp5.color('red');
      testElement = myp5.createColorPicker(testColor);

      assert.deepEqual(testElement.elt.value, testColor.toString('#rrggbb'));
    });

    test('should accept a string as param', function() {
      const testColorString = '#f00f00';
      testElement = myp5.createColorPicker(testColorString);
      assert.deepEqual(testElement.elt.value, testColorString);
    });

    test('calling color() should return the current color as p5.color', function() {
      const testColorString = 'red';
      const testColor = myp5.color(testColorString);
      testElement = myp5.createColorPicker(testColorString);
      assert.deepEqual(testElement.color(), testColor);
    });

    test('calling value() should return hex string of color', function() {
      const testColor = myp5.color('aqua');
      testElement = myp5.createColorPicker(testColor);
      assert.deepEqual(testElement.value(), testColor.toString('#rrggbb'));
    });
  });

  suite('p5.prototype.createVideo', function() {
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

    const mediaSources = [
      '/test/unit/assets/nyan_cat.gif',
      '/test/unit/assets/target.gif'
    ];

    test('should be a function', function() {
      assert.isFunction(myp5.createVideo);
    });

    test('should return p5.Element of HTMLVideoElement', function() {
      testElement = myp5.createVideo('');
      assert.instanceOf(testElement, p5.MediaElement);
      assert.instanceOf(testElement.elt, HTMLVideoElement);
    });

    test('should accept a singular media source', function() {
      const mediaSource = mediaSources[0];
      testElement = myp5.createVideo(mediaSource);
      const sourceEl = testElement.elt.children[0];

      assert.deepEqual(testElement.elt.childElementCount, 1);
      assert.instanceOf(sourceEl, HTMLSourceElement);
      assert.isTrue(sourceEl.src.endsWith(mediaSource));
    });

    test('should accept multiple media sources', function() {
      testElement = myp5.createVideo(mediaSources);

      assert.deepEqual(testElement.elt.childElementCount, mediaSources.length);
      for (let index = 0; index < mediaSources.length; index += 1) {
        const sourceEl = testElement.elt.children[index];
        assert.instanceOf(sourceEl, HTMLSourceElement);
        assert.isTrue(sourceEl.src.endsWith(mediaSources[index]));
      }
    });

    testSketchWithPromise(
      'should trigger callback on canplaythrough event',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          testElement = myp5.createVideo(mediaSources, resolve);
          testElement.elt.dispatchEvent(new Event('canplaythrough'));
        };
      }
    );
  });

  suite('p5.prototype.createAudio', function() {
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

    const mediaSources = [
      '/test/unit/assets/beat.mp3',
      '/test/unit/assets/beat.mp3'
    ];

    test('should be a function', function() {
      assert.isFunction(myp5.createAudio);
    });

    test('should return p5.Element of HTMLAudioElement', function() {
      testElement = myp5.createAudio('');
      assert.instanceOf(testElement, p5.MediaElement);
      assert.instanceOf(testElement.elt, HTMLAudioElement);
    });

    test('should accept a singular media source', function() {
      const mediaSource = mediaSources[0];
      testElement = myp5.createAudio(mediaSource);
      const sourceEl = testElement.elt.children[0];

      assert.deepEqual(testElement.elt.childElementCount, 1);
      assert.instanceOf(sourceEl, HTMLSourceElement);
      assert.isTrue(sourceEl.src.endsWith(mediaSource));
    });

    test('should accept multiple media sources', function() {
      testElement = myp5.createAudio(mediaSources);

      assert.deepEqual(testElement.elt.childElementCount, mediaSources.length);
      for (let index = 0; index < mediaSources.length; index += 1) {
        const sourceEl = testElement.elt.children[index];
        assert.instanceOf(sourceEl, HTMLSourceElement);
        assert.isTrue(sourceEl.src.endsWith(mediaSources[index]));
      }
    });

    testSketchWithPromise(
      'should trigger callback on canplaythrough event',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          testElement = myp5.createAudio(mediaSources, resolve);
          testElement.elt.dispatchEvent(new Event('canplaythrough'));
        };
      }
    );
  });

  suite('p5.prototype.createElement', function() {
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

    const testData = {
      div: HTMLDivElement,
      p: HTMLParagraphElement,
      button: HTMLButtonElement,
      input: HTMLInputElement,
      video: HTMLVideoElement
    };

    test('should be a function', function() {
      assert.isFunction(myp5.createElement);
    });

    test('should return a p5.Element of appropriate type', function() {
      for (const [tag, domElName] of Object.entries(testData)) {
        testElement = myp5.createElement(tag);
        assert.instanceOf(testElement, p5.Element);
        assert.instanceOf(testElement.elt, domElName);
      }
    });

    test('should set given content as innerHTML', function() {
      const testContent = 'Lorem ipsum';
      testElement = myp5.createElement('div', testContent);
      assert.deepEqual(testElement.elt.innerHTML, testContent);
    });
  });
});
