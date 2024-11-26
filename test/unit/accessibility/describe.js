import { mockP5, mockP5Prototype } from '../../js/mocks';
import describe from '../../../src/accessibility/describe';

suite('describe', function() {
  let myID = 'myCanvasID';

  beforeAll(function() {
    describe(mockP5, mockP5Prototype);

    mockP5Prototype.LABEL = 'label';
    mockP5Prototype.FALLBACK = 'fallback';
  });

  suite('p5.prototype.describe', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.describe);
      assert.typeOf(mockP5Prototype.describe, 'function');
    });

    test('err when LABEL at param #0', function() {
      assert.throws(
        function() {
          mockP5Prototype.describe(mockP5Prototype.LABEL);
        },
        Error,
        'description should not be LABEL or FALLBACK'
      );
    });

    test('should create description as fallback', function() {
      mockP5Prototype.describe('a');
      let actual = document.getElementById(myID + '_fallbackDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });

    test('should not add extra period if string ends in "."', function() {
      mockP5Prototype.describe('A.');
      let actual = document.getElementById(myID + '_fallbackDesc');
      assert.deepEqual(actual.innerHTML, 'A.');
    });

    test('should not add period if string ends in "!" or "?', function() {
      mockP5Prototype.describe('A!');
      let actual = document.getElementById(myID + '_fallbackDesc');
      if (actual.innerHTML === 'A!') {
        mockP5Prototype.describe('A?');

        actual = document.getElementById(myID + '_fallbackDesc');
        assert.deepEqual(actual.innerHTML, 'A?');
      }
    });

    test('should create description when called after describeElement()', function() {
      mockP5Prototype.describeElement('b', 'c');
      mockP5Prototype.describe('a');
      let actual = document.getElementById(myID + '_fallbackDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });

    test('should create Label adjacent to canvas', function() {
      mockP5Prototype.describe('a', mockP5Prototype.LABEL);

      let actual = document.getElementById(myID + '_labelDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });

    test('should create Label adjacent to canvas when label of element already exists', function() {
      mockP5Prototype.describeElement('ba', 'c', mockP5Prototype.LABEL);
      mockP5Prototype.describe('a', mockP5Prototype.LABEL);
      let actual = document.getElementById(myID + '_labelDesc');
      assert.deepEqual(actual.innerHTML, 'a.');
    });
  });

  suite('p5.prototype.describeElement', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.describeElement);
      assert.typeOf(mockP5Prototype.describeElement, 'function');
    });

    test('err when LABEL at param #0', function() {
      assert.throws(
        function() {
          mockP5Prototype.describeElement(mockP5Prototype.LABEL, 'b');
        },
        Error,
        'element name should not be LABEL or FALLBACK'
      );
    });

    test('err when LABEL at param #1', function() {
      assert.throws(
        function() {
          mockP5Prototype.describeElement('a', mockP5Prototype.LABEL);
        },
        Error,
        'description should not be LABEL or FALLBACK'
      );
    });

    test('should create element description as fallback', function() {
      mockP5Prototype.describeElement('az', 'b');
      let actual = document.getElementById(myID + '_fte_az').innerHTML;
      assert.deepEqual(actual, '<th scope="row">az:</th><td>b.</td>');
    });

    test('should not add extra ":" if element name ends in colon', function() {
      mockP5Prototype.describeElement('ab:', 'b.');
      let actual = document.getElementById(myID + '_fte_ab').innerHTML;
      assert.deepEqual(actual, '<th scope="row">ab:</th><td>b.</td>');
    });

    test('should replace ";", ",", "." for ":" in element name', function() {
      let actual;
      mockP5Prototype.describeElement('ac;', 'b.');
      if (
        document.getElementById(myID + '_fte_ac').innerHTML ===
        '<th scope="row">ac:</th><td>b.</td>'
      ) {
        mockP5Prototype.describeElement('ad,', 'b.');
        if (
          document.getElementById(myID + '_fte_ad').innerHTML ===
          '<th scope="row">ad:</th><td>b.</td>'
        ) {
          mockP5Prototype.describeElement('ae.', 'b.');
          actual = document.getElementById(myID + '_fte_ae').innerHTML;
          assert.deepEqual(actual, '<th scope="row">ae:</th><td>b.</td>');
        }
      }
    });

    test('should create element description when called after describe()', function() {
      mockP5Prototype.describe('c');
      mockP5Prototype.describeElement('af', 'b');
      let actual = document.getElementById(myID + '_fte_af').innerHTML;
      assert.deepEqual(actual, '<th scope="row">af:</th><td>b.</td>');
    });

    test('should create element label adjacent to canvas', function() {
      mockP5Prototype.describeElement('ag', 'b', mockP5Prototype.LABEL);
      const actual = document.getElementById(myID + '_lte_ag').innerHTML;
      assert.deepEqual(actual, '<th scope="row">ag:</th><td>b.</td>');
    });

    test('should create element label adjacent to canvas when called after describe()', function() {
      mockP5Prototype.describe('c', mockP5Prototype.LABEL);
      mockP5Prototype.describeElement('ah:', 'b', mockP5Prototype.LABEL);
      const actual = document.getElementById(myID + '_lte_ah').innerHTML;
      assert.deepEqual(actual, '<th scope="row">ah:</th><td>b.</td>');
    });
  });
});
