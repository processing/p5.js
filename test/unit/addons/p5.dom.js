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
});
