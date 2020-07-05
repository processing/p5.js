suite('describe', function() {
  let myp5;
  let myp5Container;

  setup(function(done) {
    myp5Container = document.createElement('div');
    document.body.appendChild(myp5Container);
    new p5(function(p) {
      p.setup = function() {
        let cnv = p.createCanvas(100, 100);
        cnv.id('myID');
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

  suite('p5.prototype.describe', function() {
    let expectedElement = 'A.';
    test('should be a function', function() {
      assert.ok(myp5.describe);
      assert.typeOf(myp5.describe, 'function');
    });
    test('should create description as fallback', function() {
      myp5.describe('a');
      let actualElement = document.getElementById('myID_dsc').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
    test('should create description when called after describeElement()', function() {
      myp5.describeElement('b', 'c');
      myp5.describe('a');
      let actualElement = document.getElementById('myID_dsc').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
    test('should create Label adjacent to canvas', function() {
      myp5.describe('a', myp5.LABEL);
      let actualElement = document.getElementById('myID_dLbl').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
    test('should create Label adjacent to canvas when label of element already exists', function() {
      myp5.describeElement('b', 'c', myp5.LABEL);
      myp5.describe('a', myp5.LABEL);
      let actualElement = document.getElementById('myID_dLbl').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
  });

  suite('p5.prototype.describeElement', function() {
    let expectedElement = '<th scope="row">A:</th><td>B.</td>';
    test('should be a function', function() {
      assert.ok(myp5.describeElement);
      assert.typeOf(myp5.describeElement, 'function');
    });
    test('should create element description as fallback', function() {
      myp5.describeElement('a', 'b');
      let actualElement = document.getElementById('myIDa').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
    test('should create element description when called after describe()', function() {
      myp5.describe('c');
      myp5.describeElement('a', 'b');
      let actualElement = document.getElementById('myIDa').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
    test('should create element label adjacent to canvas', function() {
      myp5.describeElement('a', 'b', myp5.LABEL);
      const actualElement = document.getElementById('myIDaLbl').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
    test('should create element label adjacent to canvas when label of describe() already exists', function() {
      myp5.describe('c', myp5.LABEL);
      myp5.describeElement('a', 'b', myp5.LABEL);
      const actualElement = document.getElementById('myIDaLbl').innerHTML;
      assert.equal(actualElement, expectedElement, 'works as expected');
    });
  });
});
