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
        classitems: [
          {
            file: 'foo.js',
            line: 1,
            description: 'Does foo.',
            itemtype: 'method',
            name: 'foo',
            params: [{ name: 'bar', type: 'String' }]
          },
          {
            file: 'foo.js',
            line: 5,
            itemtype: 'method',
            name: 'foo',
            params: [{ name: 'baz', type: 'Number' }]
          }
        ],
        consts: {}
      };

      merge(data);

      expect(data).to.eql({
        classitems: [
          {
            file: 'foo.js',
            line: 1,
            description: 'Does foo.',
            itemtype: 'method',
            name: 'foo',
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
        classitems: [
          { itemtype: 'method', class: 'Bar', name: 'foo' },
          { itemtype: 'method', class: 'Baz', name: 'foo' }
        ],
        consts: {}
      });
    });

    it('should not merge properties', function() {
      ensureMergeDoesNothing({
        classitems: [
          { itemtype: 'property', name: 'foo' },
          { itemtype: 'property', name: 'foo' }
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
        classes: {},
        classitems: [
          {
            description: 'hi `there`',
            params: [
              {
                description: 'what is *up*'
              }
            ]
          }
        ],
        consts: {}
      };

      render(data);

      expect(data).to.eql({
        modules: {},
        classes: {},
        classitems: [
          {
            description: '<p>hi <code>there</code></p>\n',
            params: [
              {
                description: '<p>what is <em>up</em></p>\n'
              }
            ]
          }
        ],
        consts: {}
      });
    });
  });
});
