suite('p5.Element', function() {
  var myp5 = new p5(function(sketch) {
    sketch.setup = function() {};
    sketch.draw = function() {};
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
});
