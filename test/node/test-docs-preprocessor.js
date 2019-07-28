import { expect } from 'chai';
import preprocessor from '../../docs/preprocessor';

suite('docs preprocessor', function() {
  suite('mergeOverloadedMethods()', function() {
    const merge = preprocessor.mergeOverloadedMethods;

    const ensureMergeDoesNothing = function(data) {
      const dataCopy = JSON.parse(JSON.stringify(data));
      merge(dataCopy);
      expect(dataCopy).to.eql(data);
    };

    test('should merge methods with the same name', function() {
      const data = {
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

    test('should not merge methods from different classes', function() {
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

    test('should not merge properties', function() {
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

  suite('renderDescriptionsAsMarkdown', function() {
    const render = preprocessor.renderDescriptionsAsMarkdown;

    test('should work', function() {
      const data = {
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
