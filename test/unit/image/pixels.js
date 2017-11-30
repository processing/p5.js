suite('pixels', function() {
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

  suite('p5.Image.get', function() {
    var img;

    setup(function() {
      //create a 50 x 50 half red half green image
      img = myp5.createImage(50, 50);
      img.loadPixels();

      for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {
          var col;

          if (j <= 25) {
            col = myp5.color(255, 0, 0);
          } else {
            col = myp5.color(0, 0, 255);
          }

          img.set(i, j, col);
        }
      }

      img.updatePixels();
    });

    test('works with integers', function() {
      assert.deepEqual(img.get(25, 25), [255, 0, 0, 255]);
      assert.deepEqual(img.get(25, 26), [0, 0, 255, 255]);
    });

    test('rounds down when given decimal numbers', function() {
      assert.deepEqual(img.get(25, 25.999), img.get(25, 25));
    });
  });
});
