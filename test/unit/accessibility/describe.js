suite('describe', function() {
  let myp5;
  let myp5Container;
  let myID = 'myCanvasID';
  let a = 'a';
  let b = 'b';
  let c = 'c';

  setup(function(done) {
    myp5Container = document.createElement('div');
    document.body.appendChild(myp5Container);
    new p5(function(p) {
      p.setup = function() {
        let cnv = p.createCanvas(100, 100);
        cnv.id(myID);
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

  const getInner = elID => {
    return document.getElementById(elID).innerHTML;
  };

  suite('p5.prototype.describe', function() {
    let expected = 'A.';
    test('should be a function', function() {
      assert.ok(myp5.describe);
      assert.typeOf(myp5.describe, 'function');
    });
    test('should create description as fallback', function() {
      myp5.describe(a);
      let actual = getInner(myID + '_dsc');
      assert.equal(actual, expected);
    });
    test('should create description when called after describeElement()', function() {
      myp5.describeElement(b, c);
      myp5.describe(a);
      let actual = getInner(myID + '_dsc');
      assert.equal(actual, expected);
    });
    test('should create Label adjacent to canvas', function() {
      myp5.describe(a, myp5.LABEL);
      let actual = getInner(myID + '_dLbl');
      assert.equal(actual, expected);
    });
    test('should create Label adjacent to canvas when label of element already exists', function() {
      myp5.describeElement(b, c, myp5.LABEL);
      myp5.describe(a, myp5.LABEL);
      let actual = getInner(myID + '_dLbl');
      assert.equal(actual, expected);
    });
  });

  suite('p5.prototype.describeElement', function() {
    let expected = '<th scope="row">A:</th><td>B.</td>';
    test('should be a function', function() {
      assert.ok(myp5.describeElement);
      assert.typeOf(myp5.describeElement, 'function');
    });
    test('should create element description as fallback', function() {
      myp5.describeElement(a, b);
      let actual = getInner(myID + '_fte_' + a);
      assert.equal(actual, expected);
    });
    test('should create element description when called after describe()', function() {
      myp5.describe(c);
      myp5.describeElement(a, b);
      let actual = getInner(myID + '_fte_' + a);
      assert.equal(actual, expected);
    });
    test('should create element label adjacent to canvas', function() {
      myp5.describeElement(a, b, myp5.LABEL);
      const actual = getInner(myID + '_lte_' + a);
      assert.equal(actual, expected);
    });
    test('should create element label adjacent to canvas when label of describe() already exists', function() {
      myp5.describe(c, myp5.LABEL);
      myp5.describeElement(a, b, myp5.LABEL);
      const actual = getInner(myID + '_lte_' + a);
      assert.equal(actual, expected);
    });
  });
});
