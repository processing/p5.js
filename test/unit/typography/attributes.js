
    test('should restore text style', function() {
      myp5.textSize(200);
      myp5.resizeCanvas(10, 10);
      assert.match(myp5.drawingContext.font, /200px/);
    });

suite('typography attributes', function() {

  var result;

  suite('p5.prototype.append', function() {
    var append = p5.prototype.append;
    suite('append()', function() {
      test('should be a function', function() {
        assert.ok(append);
        assert.typeOf(append, 'function');
      });
      test('should return an array with appended value', function() {
        result = append([], 1);
        assert.typeOf(result, 'Array');
        assert.deepEqual(result, [1]);
      });
    });
  });



    });
  });

});
