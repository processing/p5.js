suite('DOM', function(){
  suite('p5.prototype.select', function() {
    var select = p5.prototype.select;

    suite('select()', function() {
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

        assert.strictEqual(select('#blarg').elt, elt);
      });

      test('should return null when elements by ID are not found', function() {
        assert.isNull(select('#blarg'));
      });

      test('should find elements by class', function() {
        elt = document.createElement('div');
        elt.setAttribute('class', 'blarg');
        document.body.appendChild(elt);

        assert.strictEqual(select('.blarg').elt, elt);
      });

      test('should return null when elements by class are not found', function() {
        assert.isNull(select('.blarg'));
      });

      test('should find elements by tag name', function() {
        elt = document.createElement('aside');
        document.body.appendChild(elt);

        assert.strictEqual(select('aside').elt, elt);
      });

      test('should return null when elements by tag name are not found', function() {
        assert.isNull(select('aside'));
      });
    });
  });
});
