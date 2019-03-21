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
  });

  suite('with no events', function() {
    test('attaches and gets events', function() {
      // setup
      var myElt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      myElt.mouseClicked(myFn);
      assert.isFunction(myElt._events.click);
      myElt.elt.dispatchEvent(new Event('click'));
      assert.equal(myFnCounter, 1);
    });
    test('attaches mutiple handlers and only latest gets events', function() {
      // setup
      var myElt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };
      var myFnCounterOther = 0;
      var myFnOther = function() {
        myFnCounterOther++;
      };

      myElt.mouseClicked(myFn);
      myElt.mouseClicked(myFnOther);
      assert.isFunction(myElt._events.click);
      myElt.elt.dispatchEvent(new Event('click'));
      assert.equal(myFnCounter, 0);
      assert.equal(myFnCounterOther, 1);
    });
    test('detaches and doesnt get events', function() {
      // setup
      var myElt = myp5.createDiv('hello');
      var myFnCounter = 0;
      var myFn = function() {
        myFnCounter++;
      };

      myElt.mouseClicked(myFn);
      myElt.mouseClicked(false);
      assert.isNull(myElt._events.click);
      myElt.elt.dispatchEvent(new Event('click'));
      assert.equal(myFnCounter, 0);
    });
  });

  suite('operating with elemet classes', function() {
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
