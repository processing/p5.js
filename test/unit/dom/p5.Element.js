// import p5 from '../../../src/app.js';
import { mockP5, mockP5Prototype } from '../../js/mocks';
import dom from '../../../src/dom/dom';

suite('p5.Element', function() {
  // const mockP5Prototype = new p5(function(sketch) {
  //   sketch.setup = function() {};
  //   sketch.draw = function() {};
  // });

  // let elt;

  // afterAll(function() {
  //   if (elt && elt.parentNode) {
  //     elt.parentNode.removeChild(elt);
  //     elt = null;
  //   }
  //   mockP5Prototype.remove();
  // });

  beforeAll(() => {
    dom(mockP5, mockP5Prototype);
  });

  suite('p5.Element.prototype.parent', function() {
    let div0, div1;

    beforeEach(() => {
      div0 = mockP5Prototype.createDiv('this is the parent');
      div1 = mockP5Prototype.createDiv('this is the child');
    });

    afterEach(() => {
      div0.remove();
      div1.remove();
    });

    test('attaches child to parent', function() {
      div1.attribute('id', 'child');
      div1.parent(div0); //attaches div1 to div0
      assert.equal(document.getElementById('child').parentElement, div0.elt);
    });

    test('attaches child to parent using classname', function() {
      div0.attribute('id', 'parent');
      div1.parent('parent'); //attaches div1 to div0 using classname
      assert.equal(div1.parent(), div0.elt); //returns parent of div1
    });

    test('attaches child to parent using id', function() {
      div0.attribute('id', 'parent');
      div1.parent('#parent'); //attaches div1 to div0
      assert.equal(div1.parent(), div0.elt); //returns parent of div1 using id
    });

    test('returns the parent', function() {
      let div0 = document.createElement('div');
      let div1 = document.createElement('div');
      div1.setAttribute('id', 'child');
      div0.appendChild(div1);
      document.body.appendChild(div0);
      assert.equal(mockP5Prototype.select('#child').parent(), div0);
    });
  });

  suite('p5.Element.prototype.id', function() {
    test('attaches child to parent', function() {
      const elt = mockP5Prototype.createDiv();
      elt.id('test');
      assert.equal(document.getElementById('test'), elt.elt);
    });

    test('returns the id', function() {
      const elt = document.createElement('div');
      elt.setAttribute('id', 'test');
      document.body.appendChild(elt);
      assert.equal(mockP5Prototype.select('#child').id(), 'child');
    });
  });

  suite.todo('p5.Element.prototype.mousePressed', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mousePressed(myFn);
      assert.isFunction(elt._events.mousedown);
      elt.elt.dispatchEvent(new Event('mousedown'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.mousePressed(myFn);
      elt.mousePressed(myFnOther);
      assert.isFunction(elt._events.mousedown);
      elt.elt.dispatchEvent(new Event('mousedown'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });
  });

  suite('p5.Element.prototype.mouseClicked', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseClicked(myFn);
      assert.isFunction(elt._events.click);
      elt.elt.dispatchEvent(new Event('click'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.mouseClicked(myFn);
      elt.mouseClicked(myFnOther);
      assert.isFunction(elt._events.click);
      elt.elt.dispatchEvent(new Event('click'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseClicked(myFn);
      elt.mouseClicked(false);
      assert.isNull(elt._events.click);
      elt.elt.dispatchEvent(new Event('click'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.doubleClicked', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.doubleClicked(myFn);
      assert.isFunction(elt._events.dblclick);
      elt.elt.dispatchEvent(new Event('dblclick'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.doubleClicked(myFn);
      elt.doubleClicked(myFnOther);
      assert.isFunction(elt._events.dblclick);
      elt.elt.dispatchEvent(new Event('dblclick'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.doubleClicked(myFn);
      elt.doubleClicked(false);
      assert.isNull(elt._events.dblclick);
      elt.elt.dispatchEvent(new Event('dblclick'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseWheel', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function(event) {
        if (event.deltaX > 0) {
          myFnCounter++;
        }
      };

      elt.mouseWheel(myFn);
      assert.isFunction(elt._events.wheel);
      elt.elt.dispatchEvent(new WheelEvent('wheel', { deltaX: 10 }));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.mouseWheel(myFn);
      elt.mouseWheel(myFnOther);
      assert.isFunction(elt._events.wheel);
      elt.elt.dispatchEvent(new Event('wheel'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });
  });

  suite('p5.Element.prototype.mouseReleased', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseReleased(myFn);
      assert.isFunction(elt._events.pointerup);
      elt.elt.dispatchEvent(new Event('pointerup'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.mouseReleased(myFn);
      elt.mouseReleased(myFnOther);
      assert.isFunction(elt._events.pointerup);
      elt.elt.dispatchEvent(new Event('pointerup'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseReleased(myFn);
      elt.mouseReleased(false);
      assert.isNull(elt._events.pointerup);
      elt.elt.dispatchEvent(new Event('pointerup'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseMoved', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseMoved(myFn);
      assert.isFunction(elt._events.pointermove);
      elt.elt.dispatchEvent(new Event('pointermove'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.mouseMoved(myFn);
      elt.mouseMoved(myFnOther);
      assert.isFunction(elt._events.pointermove);
      elt.elt.dispatchEvent(new Event('pointermove'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseMoved(myFn);
      elt.mouseMoved(false);
      assert.isNull(elt._events.pointermove);
      elt.elt.dispatchEvent(new Event('pointermove'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseOver', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOver(myFn);
      assert.isFunction(elt._events.pointerover);
      elt.elt.dispatchEvent(new Event('pointerover'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.mouseOver(myFn);
      elt.mouseOver(myFnOther);
      assert.isFunction(elt._events.pointerover);
      elt.elt.dispatchEvent(new Event('pointerover'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOver(myFn);
      elt.mouseOver(false);
      assert.isNull(elt._events.pointerover);
      elt.elt.dispatchEvent(new Event('pointerover'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseOut', function() {
    test('attaches and gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOut(myFn);
      assert.isFunction(elt._events.pointerout);
      elt.elt.dispatchEvent(new Event('pointerout'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.mouseOut(myFn);
      elt.mouseOut(myFnOther);
      assert.isFunction(elt._events.pointerout);
      elt.elt.dispatchEvent(new Event('pointerout'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOut(myFn);
      elt.mouseOut(false);
      assert.isNull(elt._events.pointerout);
      elt.elt.dispatchEvent(new Event('pointerout'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.dragOver', function() {
    test('attaches and gets events', function() {
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.dragOver(myFn);
      assert.isFunction(elt._events.dragover);
      elt.elt.dispatchEvent(new Event('dragover'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.dragOver(myFn);
      elt.dragOver(myFnOther);
      assert.isFunction(elt._events.dragover);
      elt.elt.dispatchEvent(new Event('dragover'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.dragOver(myFn);
      elt.dragOver(false);
      assert.isNull(elt._events.dragover);
      elt.elt.dispatchEvent(new Event('dragover'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.dragLeave', function() {
    test('attaches and gets events', function() {
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.dragLeave(myFn);
      assert.isFunction(elt._events.dragleave);
      elt.elt.dispatchEvent(new Event('dragleave'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.dragLeave(myFn);
      elt.dragLeave(myFnOther);
      assert.isFunction(elt._events.dragleave);
      elt.elt.dispatchEvent(new Event('dragleave'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      const elt = mockP5Prototype.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.dragLeave(myFn);
      elt.dragLeave(false);
      assert.isNull(elt._events.dragleave);
      elt.elt.dispatchEvent(new Event('dragleave'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('operating with element classes', function() {
    let elt;

    beforeEach(() => {
      elt = document.createElement('div');
    });

    afterEach(() => {
      elt.remove();
    });

    test('should add class to element', function() {
      elt.setAttribute('id', 'testdiv');
      document.body.appendChild(elt);

      mockP5Prototype.select('#testdiv').addClass('testclass');
      assert.strictEqual(elt.getAttribute('class'), 'testclass');
    });

    test('should remove class from element with only one class', function() {
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass');
      document.body.appendChild(elt);

      mockP5Prototype.select('#testdiv').removeClass('testclass');
      assert.strictEqual(elt.getAttribute('class'), '');
    });

    test('should remove class from element with several classes', function() {
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass2 testclass3');
      document.body.appendChild(elt);

      mockP5Prototype.select('#testdiv').removeClass('testclass2');
      assert.strictEqual(elt.getAttribute('class'), 'testclass1 testclass3');
    });

    test('should return true if element has specified class', function() {
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass2 testclass3');
      document.body.appendChild(elt);

      assert.strictEqual(mockP5Prototype.select('#testdiv').hasClass('testclass2'), true);
    });

    test('should return false if element has not specified class', function() {
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass3');
      document.body.appendChild(elt);

      assert.strictEqual(mockP5Prototype.select('#testdiv').hasClass('testclass2'), false);
    });

    test('should return false if element has class that is partially similar as specified class', function() {
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass slideshow newtestsclas');
      document.body.appendChild(elt);

      assert.strictEqual(mockP5Prototype.select('#testdiv').hasClass('show'), false);
      assert.strictEqual(mockP5Prototype.select('#testdiv').hasClass('slide'), false);
      assert.strictEqual(mockP5Prototype.select('#testdiv').hasClass('test'), false);
      assert.strictEqual(mockP5Prototype.select('#testdiv').hasClass('class'), false);
    });

    test('should toggle specified class on element', function() {
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass2');
      document.body.appendChild(elt);

      mockP5Prototype.select('#testdiv').toggleClass('testclass2');
      assert.strictEqual(elt.getAttribute('class'), 'testclass1');

      mockP5Prototype.select('#testdiv').toggleClass('testclass2');
      assert.strictEqual(elt.getAttribute('class'), 'testclass1 testclass2');
    });
  });
});
