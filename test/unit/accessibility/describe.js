suite('describe', function() {
  let myp5;
  let myp5Container;
  let myID = 'myCanvasID';
  let a = 'a';
  let b = 'b';
  let c = 'c';
  let time = 0.0005;

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

  suite('p5.prototype.describe', function() {
    let expected = 'a.';
    test('should be a function', function() {
      assert.ok(myp5.describe);
      assert.typeOf(myp5.describe, 'function');
    });
    test('should create description as fallback', function() {
      myp5.describe(a);
      let actual = document.getElementById(myID + '_fallbackDesc').innerHTML;
      assert.deepEqual(actual, expected);
    });
    test('should not add extra period if string ends in "."', function() {
      myp5.describe('a.');
      setTimeout(function() {
        let actual = document.getElementById(myID + '_fallbackDesc').innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    test('should not add period if string ends in "!" or "?', function() {
      myp5.describe('A!');
      setTimeout(function() {
        let actual = document.getElementById(myID + '_fallbackDesc').innerHTML;
        if (actual === 'A!') {
          myp5.describe('A?');
          setTimeout(function() {
            actual = document.getElementById(myID + '_fallbackDesc').innerHTML;
            assert.deepEqual(actual, 'A?');
          }, time);
        }
      }, time);
    });
    test('should create description when called after describeElement()', function() {
      myp5.describeElement(b, c);
      myp5.describe(a);
      setTimeout(function() {
        let actual = document.getElementById(myID + '_fallbackDesc').innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    test('should create Label adjacent to canvas', function() {
      myp5.describe(a, myp5.LABEL);
      setTimeout(function() {
        let actual = document.getElementById(myID + '_labelDesc').innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    test('should create Label adjacent to canvas when label of element already exists', function() {
      myp5.describeElement(b, c, myp5.LABEL);
      myp5.describe(a, myp5.LABEL);
      setTimeout(function() {
        let actual = document.getElementById(myID + '_labelDesc').innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.describe(1, myp5.LABEL);
      });
    });
    test('no params', function() {
      assert.validationError(function() {
        myp5.describe();
      });
    });
    test('err when LABEL at param #0', function() {
      assert.throws(
        function() {
          myp5.describe(myp5.LABEL);
        },
        Error,
        'description should not be LABEL or FALLBACK'
      );
    });
  });

  suite('p5.prototype.describeElement', function() {
    let expected = '<th scope="row">a:</th><td>b.</td>';
    test('should be a function', function() {
      assert.ok(myp5.describeElement);
      assert.typeOf(myp5.describeElement, 'function');
    });
    test('should create element description as fallback', function() {
      myp5.describeElement(a, b);
      setTimeout(function() {
        let actual = document.getElementById(myID + '_fte_' + a).innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    test('should not add extra ":" if element name ends in colon', function() {
      myp5.describeElement('a:', 'b.');
      setTimeout(function() {
        let actual = document.getElementById(myID + '_fte_a:').innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    test('should replace ";", ",", "." for ":" in element name', function() {
      let actual;
      myp5.describeElement('a;', 'b.');
      setTimeout(function() {
        if (document.getElementById(myID + '_fte_a;').innerHTML === expected) {
          myp5.describeElement('a,', 'b.');
          setTimeout(function() {
            if (
              document.getElementById(myID + '_fte_a,').innerHTML === expected
            ) {
              myp5.describeElement('a.', 'b.');
              setTimeout(function() {
                actual = document.getElementById(myID + '_fte_a.').innerHTML;
                assert.deepEqual(actual, expected);
              }, time);
            }
          }, time);
        }
      }, time);
    });
    test('should create element description when called after describe()', function() {
      myp5.describe(c);
      myp5.describeElement(a, b);
      setTimeout(function() {
        let actual = document.getElementById(myID + '_fte_' + a).innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    test('should create element label adjacent to canvas', function() {
      myp5.describeElement(a, b, myp5.LABEL);
      setTimeout(function() {
        const actual = document.getElementById(myID + '_lte_' + a).innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });
    /*test('should create element label adjacent to canvas when called after describe()', function() {
      myp5.describe(c, myp5.LABEL);
      myp5.describeElement(a, b, myp5.LABEL);
      setTimeout(function() {
        const actual = document.getElementById(myID + '_lte_' + a).innerHTML;
        assert.deepEqual(actual, expected);
      }, time);
    });*/
    test('wrong param type at #0 and #1', function() {
      assert.validationError(function() {
        myp5.describeElement(1, 2);
      });
    });
    test('no params', function() {
      assert.validationError(function() {
        myp5.describeElement();
      });
    });
    test('err when LABEL at param #0', function() {
      assert.throws(
        function() {
          myp5.describeElement(myp5.LABEL, b);
        },
        Error,
        'element name should not be LABEL or FALLBACK'
      );
    });
    test('err when LABEL at param #1', function() {
      assert.throws(
        function() {
          myp5.describeElement(a, myp5.LABEL);
        },
        Error,
        'description should not be LABEL or FALLBACK'
      );
    });
  });
});
