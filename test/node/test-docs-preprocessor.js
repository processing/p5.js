var expect = require('chai').expect;

var preprocessor = require('../../docs/preprocessor');

describe('docs preprocessor', function() {
  describe('mergeOverloadedMethods()', function() {
    var merge = preprocessor.mergeOverloadedMethods;

    var ensureMergeDoesNothing = function(data) {
      var dataCopy = JSON.parse(JSON.stringify(data));
      merge(dataCopy);
      expect(dataCopy).to.eql(data);
    };

    it('should merge methods with the same name', function() {
      var data = {
        classes: {
          Bar: {},
          Baz: {}
        },
        classitems: [
          {
            file: 'foo.js',
            line: 1,
            description: 'Does foo.',
            itemtype: 'method',
            name: 'foo',
            class: 'Bar',
            params: [{ name: 'bar', type: 'String' }]
          },
          {
            file: 'foo.js',
            line: 5,
            itemtype: 'method',
            name: 'foo',
            class: 'Bar',
            params: [{ name: 'baz', type: 'Number' }]
          }
        ],
        consts: {}
      };

      merge(data);

      expect(data).to.eql({
        classes: {
          Bar: {},
          Baz: {}
        },
        classitems: [
          {
            file: 'foo.js',
            line: 1,
            description: 'Does foo.',
            itemtype: 'method',
            name: 'foo',
            class: 'Bar',
            overloads: [
              {
                line: 1,
                params: [{ name: 'bar', type: 'String' }]
              },
              {
                line: 5,
                params: [{ name: 'baz', type: 'Number' }]
              }
            ]
          }
        ],
        consts: {}
      });
    });

    it('should not merge methods from different classes', function() {
      ensureMergeDoesNothing({
        classes: {
          Bar: {},
          Baz: {}
        },
        classitems: [
          { itemtype: 'method', class: 'Bar', name: 'foo' },
          { itemtype: 'method', class: 'Baz', name: 'foo' }
        ],
        consts: {}
      });
    });

    it('should not merge properties', function() {
      ensureMergeDoesNothing({
        classes: {
          Bar: {},
          Baz: {}
        },
        classitems: [
          { itemtype: 'property', class: 'Bar', name: 'foo' },
          { itemtype: 'property', class: 'Baz', name: 'foo' }
        ],
        consts: {}
      });
    });
  });

  describe('renderDescriptionsAsMarkdown', function() {
    var render = preprocessor.renderDescriptionsAsMarkdown;

    it('should work', function() {
      var data = {
        modules: {},
        classes: {
          Bar: {},
          Baz: {}
        },
        classitems: [
          {
            description: 'hi `there`',
            params: [{ description: 'what is *up*' }]
          }
        ],
        consts: {}
      };

      render(data);

      expect(data).to.eql({
        modules: {},
        classes: {
          Bar: {},
          Baz: {}
        },
        classitems: [
          {
            description: '<p>hi <code>there</code></p>\n',
            params: [{ description: '<p>what is <em>up</em></p>\n' }]
          }
        ],
        consts: {}
      });
    });
  });
});
