suite('Calculation', function() {

  suite('p5.prototype.colorMode', function() {
    var colorMode = p5.prototype.colorMode;
    var p = {}; // new p5();
    console.log('hi');
    console.log(p);
    suite('colorMode(RGB)', function() {
      test('should be a function', function() {
        assert.ok(colorMode);
        assert.typeOf(colorMode, 'function');
      });
      // test('should be a function', function() {
      //   assert.ok(p);
      //   assert.typeOf(p, 'Object');
      // });
      // test('should set mode to RGB', function() {
      //   p.colorMode(p5.prototype.RGB);
      //   assert.equal(p.settings.colorMode, p5.prototype.RGB);
      // });
    });
  });

});
