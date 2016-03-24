suite('Structure', function() {

  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  teardown(function(){
    myp5.clear();
  });

  suite('p5.prototype.push and p5.prototype.pop', function() {
    test('should save and restore _fillSet', function() {
      var originalFillSet = myp5._renderer._fillSet;
      myp5.push();
      myp5._renderer._fillSet = !originalFillSet;
      assert.not.equal(myp5._renderer._fillSet, originalFillSet);
      myp5.pop();
      assert.equal(myp5._renderer._fillSet, originalFillSet);
    });

    test('should save and restore _strokeSet', function() {
      var originalStrokeSet = myp5._renderer._strokeSet;
      myp5.push();
      myp5._renderer._strokeSet = !originalStrokeSet;
      assert.not.equal(myp5._renderer._strokeSet, originalStrokeSet);
      myp5.pop();
      assert.equal(myp5._renderer._strokeSet, originalStrokeSet);
    });
  });

});
