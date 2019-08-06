suite('p5.Element', function() {
  var myp5 = new p5(function(sketch) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  var elt;

  teardown(function() {
    if (elt && elt.parentNode) {
      elt.parentNode.removeChild(elt);
      elt = null;
    }
    myp5.remove();
  });

  suite('p5.Element.prototype.parent', function() {
    test('attaches child to parent', function() {
      let div0 = myp5.createDiv('this is the parent');
      let div1 = myp5.createDiv('this is the child');
      div1.attribute('id', 'child');
      div1.parent(div0); //attaches div1 to div0
      assert.equal(document.getElementById('child').parentElement, div0.elt);
    });

    test('attaches child to parent using classname', function() {
      let div0 = myp5.createDiv('this is the parent');
      let div1 = myp5.createDiv('this is the child');
      div0.attribute('id', 'parent');
      div1.parent('parent'); //attaches div1 to div0 using classname
      assert.equal(div1.parent(), div0.elt); //returns parent of div1
    });

    test('attaches child to parent using classname', function() {
      let div0 = myp5.createDiv('this is the parent');
      let div1 = myp5.createDiv('this is the child');
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
      assert.equal(myp5.select('#child').parent(), div0);
    });
  });

  suite('p5.Element.prototype.id', function() {
    test('attaches child to parent', function() {
      elt = myp5.createDiv();
      elt.id('test');
      assert.equal(document.getElementById('test'), elt.elt);
    });

    test('returns the id', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'test');
      document.body.appendChild(elt);
      assert.equal(myp5.select('#child').id(), 'child');
    });
  });

  suite('p5.Element.prototype.mousePressed', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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

  suite('p5.Element.prototype.touchStarted', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function(event) {
        myFnCounter++;
      };

      elt.touchStarted(myFn);
      assert.isFunction(elt._events.touchstart);
      elt.elt.dispatchEvent(new Event('touchstart'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.touchStarted(myFn);
      elt.touchStarted(myFnOther);
      assert.isFunction(elt._events.touchstart);
      elt.elt.dispatchEvent(new Event('touchstart'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.touchStarted(myFn);
      elt.touchStarted(false);
      assert.isNull(elt._events.touchstart);
      elt.elt.dispatchEvent(new Event('touchstart'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.touchMoved', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function(event) {
        myFnCounter++;
      };

      elt.touchMoved(myFn);
      assert.isFunction(elt._events.touchmove);
      elt.elt.dispatchEvent(new Event('touchmove'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.touchMoved(myFn);
      elt.touchMoved(myFnOther);
      assert.isFunction(elt._events.touchmove);
      elt.elt.dispatchEvent(new Event('touchmove'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.touchMoved(myFn);
      elt.touchMoved(false);
      assert.isNull(elt._events.touchmove);
      elt.elt.dispatchEvent(new Event('touchmove'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.touchEnded', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function(event) {
        myFnCounter++;
      };

      elt.touchEnded(myFn);
      assert.isFunction(elt._events.touchend);
      elt.elt.dispatchEvent(new Event('touchend'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      elt.touchEnded(myFn);
      elt.touchEnded(myFnOther);
      assert.isFunction(elt._events.touchend);
      elt.elt.dispatchEvent(new Event('touchend'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.touchEnded(myFn);
      elt.touchEnded(false);
      assert.isNull(elt._events.touchend);
      elt.elt.dispatchEvent(new Event('touchend'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseReleased', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseReleased(myFn);
      assert.isFunction(elt._events.mouseup);
      elt.elt.dispatchEvent(new Event('mouseup'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
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
      assert.isFunction(elt._events.mouseup);
      elt.elt.dispatchEvent(new Event('mouseup'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseReleased(myFn);
      elt.mouseReleased(false);
      assert.isNull(elt._events.mouseup);
      elt.elt.dispatchEvent(new Event('mouseup'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseMoved', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseMoved(myFn);
      assert.isFunction(elt._events.mousemove);
      elt.elt.dispatchEvent(new Event('mousemove'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
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
      assert.isFunction(elt._events.mousemove);
      elt.elt.dispatchEvent(new Event('mousemove'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseMoved(myFn);
      elt.mouseMoved(false);
      assert.isNull(elt._events.mousemove);
      elt.elt.dispatchEvent(new Event('mousemove'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseOver', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOver(myFn);
      assert.isFunction(elt._events.mouseover);
      elt.elt.dispatchEvent(new Event('mouseover'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
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
      assert.isFunction(elt._events.mouseover);
      elt.elt.dispatchEvent(new Event('mouseover'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOver(myFn);
      elt.mouseOver(false);
      assert.isNull(elt._events.mouseover);
      elt.elt.dispatchEvent(new Event('mouseover'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.mouseOut', function() {
    test('attaches and gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOut(myFn);
      assert.isFunction(elt._events.mouseout);
      elt.elt.dispatchEvent(new Event('mouseout'));
      assert.equal(myFnCounter, 1);
    });

    test('attaches multiple handlers and only latest gets events', function() {
      // setup
      elt = myp5.createDiv('hello');
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
      assert.isFunction(elt._events.mouseout);
      elt.elt.dispatchEvent(new Event('mouseout'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });

    test('detaches and does not get events', function() {
      // setup
      elt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      elt.mouseOut(myFn);
      elt.mouseOut(false);
      assert.isNull(elt._events.mouseout);
      elt.elt.dispatchEvent(new Event('mouseout'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('p5.Element.prototype.dragOver', function() {
    test('attaches and gets events', function() {
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
      elt = myp5.createDiv('hello');
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
    test('should add class to element', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'testdiv');
      document.body.appendChild(elt);

      myp5.select('#testdiv').addClass('testclass');
      assert.strictEqual(elt.getAttribute('class'), 'testclass');
    });

    test('should remove class from element with only one class', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass');
      document.body.appendChild(elt);

      myp5.select('#testdiv').removeClass('testclass');
      assert.strictEqual(elt.getAttribute('class'), '');
    });

    test('should remove class from element with several classes', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass2 testclass3');
      document.body.appendChild(elt);

      myp5.select('#testdiv').removeClass('testclass2');
      assert.strictEqual(elt.getAttribute('class'), 'testclass1 testclass3');
    });

    test('should return true if element has specified class', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass2 testclass3');
      document.body.appendChild(elt);

      assert.strictEqual(myp5.select('#testdiv').hasClass('testclass2'), true);
    });

    test('should return false if element has not specified class', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass3');
      document.body.appendChild(elt);

      assert.strictEqual(myp5.select('#testdiv').hasClass('testclass2'), false);
    });

    test('should return false if element has class that is partially similar as specified class', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass slideshow newtestsclas');
      document.body.appendChild(elt);

      assert.strictEqual(myp5.select('#testdiv').hasClass('show'), false);
      assert.strictEqual(myp5.select('#testdiv').hasClass('slide'), false);
      assert.strictEqual(myp5.select('#testdiv').hasClass('test'), false);
      assert.strictEqual(myp5.select('#testdiv').hasClass('class'), false);
    });

    test('should toggle specified class on element', function() {
      elt = document.createElement('div');
      elt.setAttribute('id', 'testdiv');
      elt.setAttribute('class', 'testclass1 testclass2');
      document.body.appendChild(elt);

      myp5.select('#testdiv').toggleClass('testclass2');
      assert.strictEqual(elt.getAttribute('class'), 'testclass1');

      myp5.select('#testdiv').toggleClass('testclass2');
      assert.strictEqual(elt.getAttribute('class'), 'testclass1 testclass2');
    });
  });
});
