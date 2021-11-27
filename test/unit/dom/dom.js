/* global testSketchWithPromise */
suite('DOM', function() {
  suite('p5.prototype.select', function() {
    /**
     * Uses p5 in instance-mode inside a custom container.
     * All elements are attached inside the container for testing
     * And cleaned up on teardown.
     */
    let myp5;
    let myp5Container;

    setup(function(done) {
      myp5Container = document.createElement('div');
      document.body.appendChild(myp5Container);
      new p5(function(p) {
        p.setup = function() {
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
      p5Container = null;
    });

    test('should return only one p5.element if match is found', function() {
      // Adding 2 buttons to container
      myp5.createCheckbox('Text 1');
      myp5.createCheckbox('Text 2');
      const result = myp5.select('input');

      assert.instanceOf(result, p5.Element);
    });

    const generateButton = (name, className = null) => {
      const button = myp5.createButton(name);
      if (className) {
        button.class(className);
      }
      return button;
    };

    test('should find element by class name', function() {
      // Creates 2 buttons with same class and test if it selects only one.
      const testClassName = 'test-button';
      const testButton = generateButton('Button 1', testClassName);
      generateButton('Button 2', testClassName);

      const result = myp5.select(`.${testClassName}`);
      assert.deepEqual(result.elt, testButton.elt);
    });

    test('should find element by class name from given container', function() {
      // Creates 2 buttons with same class in a container and test if it selects only one.
      const testClassName = 'test-button';
      generateButton('Button 1', testClassName);
      const testButton = generateButton('Button 2', testClassName);
      const testContainer = myp5.createDiv();
      testButton.parent(testContainer);

      const result = myp5.select(`.${testClassName}`, testContainer);
      assert.deepEqual(testButton.elt, result.elt);
    });

    test('should return null when no matches are found by class name', function() {
      // Gives unused className and tests if it returns null
      const testClassName = 'test-button';
      generateButton('Test Button', testClassName);
      const result = myp5.select('.classNameWithTypo');
      assert.isNull(result);
    });

    test('should find element by tag name', function() {
      // Creates 2 similar elements and tests if it selects only one.
      const testButton = generateButton('Button 1');
      generateButton('Button 2');
      const result = myp5.select(`button`);
      assert.deepEqual(result.elt, testButton.elt);
    });

    test('should find element by tag name from given container', function() {
      // Creates 2 elements inside and outside of a container and tests if it
      // selects inside the container
      generateButton('Button 1');
      const testButton = generateButton('Button 2');
      const testDiv = myp5.createDiv();
      testButton.parent(testDiv);

      const result = myp5.select(`button`, testDiv);
      assert.deepEqual(result.elt, testButton.elt);
    });

    test('should return null when no matches are found by tag name', function() {
      generateButton('Test Button');
      const result = myp5.select('video', myp5Container);
      assert.isNull(result);
    });

    const generateDiv = (id = null, className = null) => {
      const div = myp5.createDiv();
      if (id) {
        div.id(id);
      }
      if (className) {
        div.class(className);
      }
      return div;
    };

    test('should select element in container using CSS selector with ID', function() {
      const divID = 'divId';
      const testDiv = generateDiv(divID);
      const testButton = generateButton('Button 1');
      generateButton('Button 2');
      testButton.parent(testDiv);

      const result = myp5.select(`#${divID} button`);
      assert.deepEqual(result.elt, testButton.elt);
    });

    test('should select element in container using CSS selector with class name', function() {
      const divClass = 'divClass';
      const testDiv = generateDiv(null, divClass);
      const testButton = generateButton('Button 1');
      generateButton('Button 2');
      testButton.parent(testDiv);

      const result = myp5.select(`.${divClass} button`);
      assert.deepEqual(result.elt, testButton.elt);
    });
  });

  suite('p5.prototype.selectAll', function() {
    let myp5;
    let myp5Container;

    setup(function(done) {
      myp5Container = document.createElement('div');
      document.body.appendChild(myp5Container);
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          let mydiv = document.createElement('div');
          mydiv.setAttribute('id', 'main');
          let childbutton = document.createElement('button');
          childbutton.setAttribute('class', 'p5button');
          mydiv.append(childbutton);
          let otherbutton = document.createElement('button');
          otherbutton.setAttribute('class', 'p5button');
          myp5Container.append(mydiv, otherbutton);
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

    test('should return an array', function() {
      const elements = myp5.selectAll('button');
      assert.isArray(elements);
    });

    test('should return empty array when no matching classes are found', function() {
      const elements = myp5.selectAll('.randomElements');
      assert.isArray(elements);
      assert.lengthOf(elements, 0);
    });

    const matchResults = (p5Results, domResults) => {
      assert.lengthOf(p5Results, domResults.length);
      for (let i = 0; i < p5Results.length; i += 1) {
        assert.deepEqual(p5Results[i].elt, domResults[i]);
      }
    };

    test('should find all elements with matching class name', function() {
      const testClassName = 'p5button';
      const p5Results = myp5.selectAll(`.${testClassName}`);
      const domResults = myp5Container.getElementsByClassName(testClassName);
      matchResults(p5Results, domResults);
    });

    test('should find all elements with matching class name in given container', function() {
      const testClassName = 'p5button';
      const parentContainerId = 'main';
      const p5Results = myp5.selectAll(
        `.${testClassName}`,
        `#${parentContainerId}`
      );
      const containerElement = document.getElementById(parentContainerId);
      const domResults = containerElement.getElementsByClassName(testClassName);
      matchResults(p5Results, domResults);
    });

    test('should find all elements with matching tag name', function() {
      const testTagName = 'button';
      const p5Results = myp5.selectAll(testTagName);
      const domResults = myp5Container.getElementsByTagName(testTagName);
      matchResults(p5Results, domResults);
    });

    test('should find all elements with matching tag name in given container', function() {
      const testTagName = 'button';
      const parentContainerId = 'main';
      const p5Results = myp5.selectAll(testTagName, `#${parentContainerId}`);
      const containerElement = document.getElementById(parentContainerId);
      const domResults = containerElement.getElementsByTagName(testTagName);
      matchResults(p5Results, domResults);
    });

    test('should find all elements in container using CSS selector with id', function() {
      const testTagName = 'button';
      const parentContainerId = 'main';
      const p5Results = myp5.selectAll(`#${parentContainerId} ${testTagName}`);
      const containerElement = document.getElementById(parentContainerId);
      const domResults = containerElement.getElementsByTagName(testTagName);
      matchResults(p5Results, domResults);
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

  suite('p5.Element.prototype.changed', function() {
    testSketchWithPromise(
      'should trigger callback when element changes',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          const testElement = sketch.createSlider(0, 100, 50, 10);
          testElement.changed(resolve);
          testElement.elt.dispatchEvent(new Event('change'));
        };
      }
    );

    testSketchWithPromise(
      'should not trigger callback after changed(false) is called',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          const testElement = sketch.createSlider(0, 100, 50, 10);
          // if callback is called, there is some error. so reject
          testElement.changed(reject);
          testElement.changed(false);
          testElement.elt.dispatchEvent(new Event('change'));
          resolve();
        };
      }
    );
  });

  suite('p5.Element.prototype.input', function() {
    testSketchWithPromise(
      'should trigger callback when input is provided',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          const testElement = sketch.createElement('input');
          testElement.input(resolve);
          testElement.elt.dispatchEvent(new Event('input'));
        };
      }
    );

    testSketchWithPromise(
      'should not trigger callback after input(false) is called',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          const testElement = sketch.createElement('input');
          // if callback is called, there is some error. so reject
          testElement.input(reject);
          testElement.input(false);
          testElement.elt.dispatchEvent(new Event('input'));
          resolve();
        };
      }
    );
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

  suite('p5.prototype.createA', function() {
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

    test('should return a p5.Element of anchor type', () => {
      testElement = myp5.createA('', '');
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLAnchorElement);
    });

    test('creates anchor with given link & text', function() {
      const testUrl = 'http://p5js.org/';
      const testText = 'p5js website';
      testElement = myp5.createA(testUrl, testText);

      assert.deepEqual(testElement.elt.href, testUrl);
      assert.deepEqual(testElement.elt.text, testText);
    });

    test('creates anchor with given target', function() {
      const testTarget = 'blank';
      testElement = myp5.createA('http://p5js.org', 'p5js website', testTarget);
      assert.deepEqual(testElement.elt.target, testTarget);
    });
  });

  suite('p5.prototype.createSlider', function() {
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

    test('should return a p5.Element of slider type', () => {
      testElement = myp5.createSlider(0, 100, 0, 1);
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLInputElement);
      assert.deepEqual(testElement.elt.type, 'range');
    });

    test('should set min and max values', function() {
      let testElement = myp5.createSlider(20, 80);
      assert.deepEqual(testElement.elt.min, '20');
      assert.deepEqual(testElement.elt.max, '80');
    });

    test('should set slider position', function() {
      let testElement = myp5.createSlider(20, 80, 50);
      assert.deepEqual(testElement.elt.value, '50');
    });

    test('should set step value', function() {
      testElement = myp5.createSlider(20, 80, 10, 5);
      assert.deepEqual(testElement.elt.step, '5');
    });
  });

  suite('p5.prototype.createButton', function() {
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

    test('should return a p5.Element of button type', function() {
      testElement = myp5.createButton('testButton', 'testButton');
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLButtonElement);
    });

    testSketchWithPromise(
      'should trigger callback when mouse is pressed',
      function(sketch, resolve, reject) {
        sketch.setup = function() {
          const testElement = sketch.createButton('test');
          testElement.mousePressed(resolve);
          testElement.elt.dispatchEvent(new Event('mousedown'));
        };
      }
    );
  });

  // Tests for createCheckBox

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

  suite('p5.prototype.createRadio', function() {
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

    // Helper functions
    const createRadioElement = (options = []) => {
      const radioEl = document.createElement('div');
      for (const option of options) {
        const optionEl = document.createElement('input');
        optionEl.setAttribute('type', 'radio');
        optionEl.setAttribute('value', option);
        radioEl.appendChild(optionEl);
      }
      return radioEl;
    };

    const getChildren = radioEl =>
      Array.from(radioEl.children).filter(el => el instanceof HTMLInputElement);

    test('should be a function', function() {
      assert.isFunction(myp5.createRadio);
    });

    test('should return p5.Element of radio type', function() {
      testElement = myp5.createRadio();
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLDivElement);
    });

    test('should return p5.Element from existing radio Element', function() {
      const options = ['Saturday', 'Sunday'];
      const radioElement = createRadioElement(options);
      testElement = myp5.createRadio(radioElement);

      assert.deepEqual(testElement.elt, radioElement);
      for (const radioEl of getChildren(radioElement)) {
        const optionEl = testElement.option(radioEl.value);
        assert.deepEqual(optionEl, radioEl);
      }
    });

    test('calling option(value) should return existing radio element', function() {
      const options = ['Saturday', 'Sunday'];
      const radioElement = createRadioElement(options);
      testElement = myp5.createRadio(radioElement);
      for (const radioInput of getChildren(radioElement)) {
        const optionEl = testElement.option(radioInput.value);
        assert.deepEqual(radioInput, optionEl);
      }
      assert.deepEqual(getChildren(testElement.elt).length, options.length);
    });

    test('calling option(newValue) should create a new radio input', function() {
      const testName = 'defaultRadio';
      const options = ['Saturday', 'Sunday'];
      testElement = myp5.createRadio(testName);
      let count = 0;
      for (const option of options) {
        const optionEl = testElement.option(option);
        assert.instanceOf(optionEl, HTMLInputElement);
        assert.deepEqual(optionEl.type, 'radio');
        assert.deepEqual(optionEl.value, option);
        assert.deepEqual(optionEl.name, testName);
        // Double , one for input and one for label
        count += 2;

        assert.deepEqual(testElement.elt.childElementCount, count);
      }
    });

    test('calling option(value, label) should set label of option', function() {
      const testName = 'defaultRadio';
      const options = ['Saturday', 'Sunday'];
      testElement = myp5.createRadio(testName);
      for (const option of options) {
        const optionLabel = `${option}-label`;
        const optionEl = testElement.option(option, optionLabel);
        assert.deepEqual(optionEl.value, option);
        assert.deepEqual(optionEl.name, testName);
        const labelEl = optionEl.nextElementSibling;
        assert.deepEqual(labelEl.innerHTML, optionLabel);
      }
    });

    test('should use given name for all options', function() {
      const testName = 'defaultRadio';
      const options = ['Saturday', 'Sunday'];
      const radioElement = createRadioElement(options);
      testElement = myp5.createRadio(radioElement, testName);

      for (const option of options) {
        const optionEl = testElement.option(option);
        assert.deepEqual(optionEl.name, testName);
      }
    });

    test('calling remove(value) should remove option', function() {
      const options = ['Monday', 'Friday', 'Saturday', 'Sunday'];
      const radioElement = createRadioElement(options);
      testElement = myp5.createRadio(radioElement);

      // Remove element
      const testValue = 'Friday';
      options.splice(options.indexOf(testValue), 1);
      testElement.remove(testValue);
      // Verify remaining options
      const remainingOptions = Array.from(testElement.elt.children).map(
        el => el.value
      );
      assert.deepEqual(options, remainingOptions);
    });

    test('calling value() should return selected value', function() {
      const options = ['Monday', 'Friday', 'Saturday', 'Sunday'];
      const selectedValue = options[1];
      testElement = myp5.createRadio();
      for (const option of options) testElement.option(option);
      testElement.selected(selectedValue);
      assert.deepEqual(testElement.value(), selectedValue);
    });

    test('calling selected(value) should select a value and return it', function() {
      const options = ['Monday', 'Friday', 'Saturday', 'Sunday'];
      testElement = myp5.createRadio();
      for (const option of options) testElement.option(option);

      for (const option of options) {
        testElement.selected(option);
        const selectedInput = testElement.option(option);
        assert.deepEqual(selectedInput.checked, true);
      }
    });

    test('calling selected() should return the currently selected option', function() {
      const options = ['Monday', 'Friday', 'Saturday', 'Sunday'];
      testElement = myp5.createRadio();
      for (const option of options) testElement.option(option);

      const testOption = getChildren(testElement.elt)[1];
      testOption.setAttribute('checked', true);
      const selectedOption = testElement.selected();
      assert.deepEqual(selectedOption, testOption);
      assert.isTrue(selectedOption.checked);
    });

    test('calling disable() should disable all the radio inputs', function() {
      const options = ['Monday', 'Friday', 'Saturday', 'Sunday'];
      testElement = myp5.createRadio();
      for (const option of options) testElement.option(option);

      testElement.disable();
      for (const option of options) {
        assert.isTrue(testElement.option(option).disabled);
      }
    });
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

  suite('p5.prototype.createInput', function() {
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
      assert.isFunction(myp5.createInput);
    });

    test('should return p5.Element of input type', function() {
      testElement = myp5.createInput();
      assert.instanceOf(testElement, p5.Element);
      assert.instanceOf(testElement.elt, HTMLInputElement);
    });

    test('should set given value as input', function() {
      const testValues = ['123', '', 'Hello world'];
      for (const value of testValues) {
        testElement = myp5.createInput(value);
        assert.deepEqual(testElement.elt.value, value);
      }
    });

    test('should create input of given type and value', function() {
      const testType = 'password';
      const testValue = '1234056789';
      testElement = myp5.createInput(testValue, testType);
      assert.deepEqual(testElement.elt.type, testType);
      assert.deepEqual(testElement.elt.value, testValue);
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

  // p5.Element.prototype.addClass
  suite('p5.Element.prototype.addClass', function() {
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
      // Create any p5.Element
      testElement = myp5.createElement('div');
      assert.isFunction(testElement.addClass);
    });

    test('should add provided string to class names', function() {
      const testClassName = 'jumbotron';
      testElement = myp5.createElement('div');
      testElement.addClass(testClassName);
      assert.deepEqual(testElement.elt.className, testClassName);
    });

    test('should not add class name, if already exists', function() {
      const testClassName1 = 'jumbotron';
      const testClassName2 = 'container-fluid';
      const expectedClassName = testClassName1 + ' ' + testClassName2;

      testElement = myp5.createElement('div');
      testElement.addClass(testClassName1);
      testElement.addClass(testClassName2);

      // Should not add the class name again
      testElement.addClass(testClassName1);
      assert.deepEqual(testElement.elt.className, expectedClassName);
    });
  });

  // p5.Element.prototype.removeClass
  suite('p5.Element.prototype.removeClass', function() {
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
      // Create any p5.Element
      testElement = myp5.createElement('div');
      assert.isFunction(testElement.removeClass);
    });

    test('should remove provided string from class names', function() {
      const defaultClassNames = 'col-md-9 col-sm-12';
      const testClassName = 'jumbotron';

      testElement = myp5.createElement('div');
      testElement.addClass(defaultClassNames);
      testElement.addClass(testClassName);

      // Removing a class name
      testElement.removeClass(testClassName);
      assert.deepEqual(testElement.elt.className, defaultClassNames);
    });

    test('should not throw error if class name not exists', function() {
      const testClassName1 = 'jumbotron';
      const testClassName2 = 'container-fluid';

      testElement = myp5.createElement('div');
      testElement.addClass(testClassName1);

      // Handling the curse of 'this'
      testElement.removeClass = testElement.removeClass.bind(testElement);
      assert.doesNotThrow(testElement.removeClass, testClassName2);
      assert.deepEqual(testElement.elt.className, testClassName1);
    });
  });

  // p5.Element.prototype.hasClass
  suite('p5.Element.prototype.hasClass', function() {
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
      // Create any p5.Element
      testElement = myp5.createElement('div');
      assert.isFunction(testElement.hasClass);
    });

    test('should return true for existing class name', function() {
      const defaultClassNames = 'col-md-9 jumbotron';
      const testClassName = 'jumbotron';

      testElement = myp5.createElement('div');
      testElement.addClass(defaultClassNames);

      assert.isTrue(testElement.hasClass(testClassName));
    });

    test('should return false for non-existing class name', function() {
      const defaultClassNames = 'col-md-9 jumbotron';
      const testClassName = 'container-fluid';

      testElement = myp5.createElement('div');
      testElement.addClass(defaultClassNames);

      assert.isFalse(testElement.hasClass(testClassName));
    });
  });

  // p5.Element.prototype.toggleClass
  suite('p5.Element.prototype.toggleClass', function() {
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
      // Create any p5.Element
      testElement = myp5.createElement('div');
      assert.isFunction(testElement.toggleClass);
    });

    test('should remove an existing class name', function() {
      const defaultClassName = 'container-fluid';
      const testClassName = 'jumbotron';

      testElement = myp5.createElement('div');
      testElement.addClass(defaultClassName);
      testElement.addClass(testClassName);

      testElement.toggleClass(testClassName);
      assert.deepEqual(testElement.elt.className, defaultClassName);
    });

    test('should add an non-existing class name', function() {
      const defaultClassName = 'container-fluid';
      const testClassName = 'jumbotron';

      testElement = myp5.createElement('div');
      testElement.addClass(defaultClassName);

      testElement.toggleClass(testClassName);
      assert.deepEqual(
        testElement.elt.className,
        defaultClassName + ' ' + testClassName
      );
    });
  });

  // p5.Element.prototype.child
  suite('p5.Element.prototype.child', function() {
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
      testElement = myp5.createElement('div');
      assert.isFunction(testElement.child);
    });

    test('should return all child nodes by default', function() {
      testElement = myp5.createElement('div');
      const childElement = myp5.createElement('p');

      // Add child element by using DOM API
      testElement.elt.appendChild(childElement.elt);

      const childNodes = testElement.child();
      assert.deepEqual(childNodes.length, testElement.elt.childElementCount);
      childNodes.forEach((childElement, index) => {
        const domChild = testElement.elt.children[index];
        assert.deepEqual(childElement, domChild);
      });
    });

    test('should append p5 element as child', function() {
      testElement = myp5.createElement('div');
      const childElement = myp5.createElement('p');

      testElement.child(childElement);
      const childNodes = Array.from(testElement.elt.children);
      assert.isTrue(childNodes.includes(childElement.elt));
    });

    test('should append dom element as child', function() {
      testElement = myp5.createElement('div');
      const childElement = myp5.createElement('p');

      testElement.child(childElement.elt);
      const childNodes = Array.from(testElement.elt.children);
      assert.isTrue(childNodes.includes(childElement.elt));
    });

    test('should append element as child from a given id', function() {
      testElement = myp5.createElement('div');
      const childId = 'testChildElement';
      const childElement = myp5.createElement('p');
      childElement.id(childId);

      testElement.child(childId);
      const childNodes = Array.from(testElement.elt.children);
      assert.isTrue(childNodes.includes(childElement.elt));
    });

    test('should not throw error if mathcing element is not found from a given id', function() {
      testElement = myp5.createElement('div');
      const randomChildId = 'testChildElement';
      expect(() => testElement.child(randomChildId)).to.not.throw();
    });
  });

  // p5.Element.prototype.center
  suite('p5.Element.prototype.center', function() {
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
      testElement = myp5.createElement('div');
      assert.isFunction(testElement.center);
    });

    // test('should center an element horizontally', function() {
    //   // center doesn't work.
    // });

    // test('should center an element vertically', function() {
    //   // center doesn't work.
    // });

    // test('should center an element horizontally and vertically', function() {
    //   // center doesn't work.
    // });
  });

  // p5.Element.prototype.html
  suite('p5.Element.prototype.html', function() {
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
      // Create any p5.Element
      testElement = myp5.createElement('a');
      assert.isFunction(testElement.position);
    });

    test('should return the inner HTML of element if no argument is given', function() {
      testElement = myp5.createElement('div');
      const testHTML = '<p>Hello World</p>';

      testElement.elt.innerHTML = testHTML;
      assert.deepEqual(testElement.html(), testHTML);
    });

    test('should replace the inner HTML of element', function() {
      testElement = myp5.createElement('div');
      const initialtestHTML = '<p>Hello World</p>';
      const modifiedtestHTML = '<p>Hello World !!!</p>';

      testElement.html(initialtestHTML);
      assert.deepEqual(testElement.elt.innerHTML, initialtestHTML);

      testElement.html(modifiedtestHTML);
      assert.deepEqual(testElement.elt.innerHTML, modifiedtestHTML);
    });

    test('should append to the inner HTML if second param is true', function() {
      testElement = myp5.createElement('div');
      const testHTML1 = '<p>Hello World</p>';
      const testHTML2 = '<p>Hello World !!!</p>';

      testElement.html(testHTML1);
      assert.deepEqual(testElement.elt.innerHTML, testHTML1);

      testElement.html(testHTML2, true);
      assert.deepEqual(testElement.elt.innerHTML, testHTML1 + testHTML2);
    });

    test('should replace the inner HTML if second param is false', function() {
      testElement = myp5.createElement('div');
      const testHTML1 = '<p>Hello World</p>';
      const testHTML2 = '<p>Hello World !!!</p>';

      testElement.html(testHTML1);
      assert.deepEqual(testElement.elt.innerHTML, testHTML1);

      testElement.html(testHTML2, false);
      assert.deepEqual(testElement.elt.innerHTML, testHTML2);
    });
  });

  // p5.Element.prototype.position
  suite('p5.Element.prototype.position', function() {
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
      // Create any p5.Element
      testElement = myp5.createElement('a');
      assert.isFunction(testElement.position);
    });

    test('should return current position if no args are given', function() {
      testElement = myp5.createButton('testButton');
      const position = testElement.position();
      assert.deepEqual(position.x, testElement.elt.offsetLeft);
      assert.deepEqual(position.y, testElement.elt.offsetTop);
    });

    test('should set default position as absolute', function() {
      testElement = myp5.createButton('testButton');
      testElement.position(20, 70);
      assert.deepEqual(testElement.elt.style.position, 'absolute');
    });

    test('should set given params as properties', function() {
      let testElement = myp5.createButton('testButton');
      testElement.position(20, 80, 'static');

      assert.deepEqual(testElement.elt.style.position, 'static');
      assert.deepEqual(testElement.elt.style.left, '20px');
      assert.deepEqual(testElement.elt.style.top, '80px');
    });
  });

  // p5.Element.prototype._translate

  // p5.Element.prototype._rotate

  // p5.Element.prototype.style

  // p5.Element.prototype.attribute

  // p5.Element.prototype.removeAttribute

  // p5.Element.prototype.value

  // p5.Element.prototype.show

  // p5.Element.prototype.hide

  // p5.Element.prototype.size

  // p5.Element.prototype.remove

  suite('p5.prototype.drop', function() {
    testSketchWithPromise('drop fires multiple events', function(
      sketch,
      resolve,
      reject
    ) {
      let testElement;
      let fileFnCounter = 0;
      let eventFnCounter = 0;
      sketch.setup = function() {
        testElement = sketch.createDiv('Drop files inside');

        // Setup test functions and constants
        const file1 = new File(['foo'], 'foo.txt', { type: 'text/plain' });
        const file2 = new File(['foo'], 'foo.txt', { type: 'text/plain' });
        const hasFinished = () => {
          if (fileFnCounter > 1 && eventFnCounter === 1) resolve();
        };
        const testFileFn = () => {
          fileFnCounter += 1;
          hasFinished();
        };
        const testEventFn = () => {
          eventFnCounter += 1;
          hasFinished();
        };
        testElement.drop(testFileFn, testEventFn);

        // Fire a mock drop and test the method
        const mockedEvent = new Event('drop');
        mockedEvent.dataTransfer = { files: [file1, file2] };
        testElement.elt.dispatchEvent(mockedEvent);
      };
    });
  });

  // p5.MediaElement

  // p5.MediaElement.play

  // p5.MediaElement.stop

  // p5.MediaElement.pause

  // p5.MediaElement.loop

  // p5.MediaElement.noLoop

  // p5.MediaElement.shouldAutoplay

  // p5.MediaElement.autoplay

  // p5.MediaElement.volume

  // p5.MediaElement.speed

  // p5.MediaElement.time

  // p5.MediaElement.prototype.duration

  // p5.MediaElement.prototype._ensureCanvas

  // p5.MediaElement.prototype.loadPixels

  // p5.MediaElement.prototype.updatePixels

  // p5.MediaElement.prototype.get

  // p5.MediaElement.prototype._getPixel

  // p5.MediaElement.prototype.set

  // p5.MediaElement.prototype.copy

  // p5.MediaElement.prototype.mask

  // p5.MediaElement.prototype.isModified

  // p5.MediaElement.prototype.setModified

  // p5.MediaElement.prototype.onended

  // p5.MediaElement.prototype.connect

  // p5.MediaElement.prototype.disconnect

  // p5.MediaElement.prototype.showControls

  // p5.MediaElement.prototype.hideControls

  // p5.MediaElement.prototype.addCue

  // p5.MediaElement.prototype.removeCue

  // p5.MediaElement.prototype.clearCues

  // p5.MediaElement.prototype._onTimeUpdate

  // p5.File

  // p5.File._createLoader

  // p5.File._load
});
