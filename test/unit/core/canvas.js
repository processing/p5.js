suite('Canvas', function() {
  var CORNER = p5.prototype.CORNER;
  var CORNERS = p5.prototype.CORNERS;
  var RADIUS = p5.prototype.RADIUS;
  var CENTER = p5.prototype.CENTER;

  var result;

  suite('canvas.modeAdjust', function() {
    var modeAdjust = p5.prototype._modeAdjust;

    test('should be a function', function() {
      assert.ok(modeAdjust);
      assert.typeOf(modeAdjust, 'function');
    });

    test('should convert numeric strings when rectMode is CORNER', function(done) {
      result = modeAdjust('10', '24', '32', '50', CORNER);
      assert.deepEqual(result, { x: 10, y: 24, w: 32, h: 50 });
    });

    test('should convert numeric strings when rectMode is CORNERS', function(done) {
      result = modeAdjust('10', '24', '32', '50', CORNERS);
      assert.deepEqual(result, { x: 10, y: 24, w: 22, h: 26 });
    });

    test('should convert numeric strings when rectMode is RADIUS', function(done) {
      result = modeAdjust('10', '24', '32', '50', RADIUS);
      assert.deepEqual(result, { x: -22, y: -26, w: 64, h: 100 });
    });

    test('should convert numeric strings when rectMode is CENTER', function(done) {
      result = modeAdjust('10', '24', '32', '50', CENTER);
      assert.deepEqual(result, { x: -6, y: -1, w: 32, h: 50 });
    });
  });

  suite('canvas.arcModeAdjust', function() {
    var arcModeAdjust = p5.prototype._arcModeAdjust;

    test('should be a function', function() {
      assert.ok(arcModeAdjust);
      assert.typeOf(arcModeAdjust, 'function');
    });

    test('should convert numeric strings when ellipseMode is CORNER', function(done) {
      result = arcModeAdjust('10', '24', '32', '50', CORNER);
      assert.deepEqual(result, { x: 26, y: 49, w: 32, h: 50 });
    });

    test('should convert numeric strings when ellipseMode is CORNERS', function(done) {
      result = arcModeAdjust('10', '24', '32', '50', CORNERS);
      assert.deepEqual(result, { x: 10, y: 24, w: 42, h: 74 });
    });

    test('should convert numeric strings when ellipseMode is RADIUS', function(done) {
      result = arcModeAdjust('10', '24', '32', '50', RADIUS);
      assert.deepEqual(result, { x: 10, y: 24, w: 64, h: 100 });
    });

    test('should convert numeric strings when ellipseMode is CENTER', function(done) {
      result = arcModeAdjust('10', '24', '32', '50', CENTER);
      assert.deepEqual(result, { x: 10, y: 24, w: 32, h: 50 });
    });
  });
});
