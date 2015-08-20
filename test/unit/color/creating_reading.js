suite('CreatingReading', function() {
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  var fromColor;
  var toColor;
  suite('p5.prototype.lerpColor', function() {
    setup(function() {
      fromColor = myp5.color(204, 102, 0);
      toColor = myp5.color(0, 102, 153);
    });
    test('should correctly get lerp colors', function() {
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.rgba, [137, 102, 50, 255]);
      assert.deepEqual(interB.rgba, [69, 102, 101, 255]);
    });
  });
});
