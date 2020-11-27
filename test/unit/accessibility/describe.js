suite('describe', function() {
  let myp5;
  let myID = 'myCanvasID';

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        let cnv = p.createCanvas(100, 100);
        cnv.id(myID);
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.describe', function() {
    test('should be a function', function() {
      assert.ok(myp5.describe);
      assert.typeOf(myp5.describe, 'function');
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
    test('should create description as fallback', function() {
      myp5.describe('a');
      let actual = document.getElementById(myID + '_fallbackDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });
    test('should not add extra period if string ends in "."', function() {
      myp5.describe('A.');
      let actual = document.getElementById(myID + '_fallbackDesc');
      assert.deepEqual(actual.innerHTML, 'A.');
    });
    test('should not add period if string ends in "!" or "?', function() {
      myp5.describe('A!');
      let actual = document.getElementById(myID + '_fallbackDesc');
      if (actual.innerHTML === 'A!') {
        myp5.describe('A?');

        actual = document.getElementById(myID + '_fallbackDesc');
        assert.deepEqual(actual.innerHTML, 'A?');
      }
    });
    test('should create description when called after describeElement()', function() {
      myp5.describeElement('b', 'c');
      myp5.describe('a');
      let actual = document.getElementById(myID + '_fallbackDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });
    test('should create Label adjacent to canvas', function() {
      myp5.describe('a', myp5.LABEL);

      let actual = document.getElementById(myID + '_labelDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });
    test('should create Label adjacent to canvas when label of element already exists', function() {
      myp5.describeElement('ba', 'c', myp5.LABEL);
      myp5.describe('a', myp5.LABEL);
      let actual = document.getElementById(myID + '_labelDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });
  });

  suite('p5.prototype.describeElement', function() {
    test('should be a function', function() {
      assert.ok(myp5.describeElement);
      assert.typeOf(myp5.describeElement, 'function');
    });
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
          myp5.describeElement(myp5.LABEL, 'b');
        },
        Error,
        'element name should not be LABEL or FALLBACK'
      );
    });
    test('err when LABEL at param #1', function() {
      assert.throws(
        function() {
          myp5.describeElement('a', myp5.LABEL);
        },
        Error,
        'description should not be LABEL or FALLBACK'
      );
    });
    test('should create element description as fallback', function() {
      myp5.describeElement('az', 'b');
      let actual = document.getElementById(myID + '_fte_az').innerHTML;
      assert.deepEqual(actual, '<th scope="row">az:</th><td>b.</td>');
    });
    test('should not add extra ":" if element name ends in colon', function() {
      myp5.describeElement('ab:', 'b.');
      let actual = document.getElementById(myID + '_fte_ab').innerHTML;
      assert.deepEqual(actual, '<th scope="row">ab:</th><td>b.</td>');
    });
    test('should replace ";", ",", "." for ":" in element name', function() {
      let actual;
      myp5.describeElement('ac;', 'b.');
      if (
        document.getElementById(myID + '_fte_ac').innerHTML ===
        '<th scope="row">ac:</th><td>b.</td>'
      ) {
        myp5.describeElement('ad,', 'b.');
        if (
          document.getElementById(myID + '_fte_ad').innerHTML ===
          '<th scope="row">ad:</th><td>b.</td>'
        ) {
          myp5.describeElement('ae.', 'b.');
          actual = document.getElementById(myID + '_fte_ae').innerHTML;
          assert.deepEqual(actual, '<th scope="row">ae:</th><td>b.</td>');
        }
      }
    });
    test('should create element description when called after describe()', function() {
      myp5.describe('c');
      myp5.describeElement('af', 'b');
      let actual = document.getElementById(myID + '_fte_af').innerHTML;
      assert.deepEqual(actual, '<th scope="row">af:</th><td>b.</td>');
    });
    test('should create element label adjacent to canvas', function() {
      myp5.describeElement('ag', 'b', myp5.LABEL);
      const actual = document.getElementById(myID + '_lte_ag').innerHTML;
      assert.deepEqual(actual, '<th scope="row">ag:</th><td>b.</td>');
    });
    test('should create element label adjacent to canvas when called after describe()', function() {
      myp5.describe('c', myp5.LABEL);
      myp5.describeElement('ah:', 'b', myp5.LABEL);
      const actual = document.getElementById(myID + '_lte_ah').innerHTML;
      assert.deepEqual(actual, '<th scope="row">ah:</th><td>b.</td>');
    });
  });
});
