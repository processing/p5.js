suite('Version', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  test('exists on p5 object', function() {
    assert.isString(p5.VERSION);
    // ensure the string isn't empty
    assert.isTrue(p5.VERSION.length > 0);
  });

  test('exists on instance of p5 sketch', function() {
    assert.isString(myp5.VERSION);
    // ensure the string isn't empty
    assert.isTrue(myp5.VERSION.length > 0);
  });
});
