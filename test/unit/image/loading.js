suite('loading images', function () {
  var myp5 = new p5(function () {
  }, true);
  var imagePath = 'unit/image/nyan_cat.gif';

  test('should call successCallback when image loads', function (done) {
    myp5.loadImage(
      imagePath,
      function (pImg) {
        assert.ok('nyan_cat.gif loaded');
        done();
      },
      function (event) {
        assert.fail();
        done();
      });
  });

  test('should call successCallback when image loads', function (done) {
    myp5.loadImage(
      imagePath,
      function (pImg) {
        assert.isTrue(pImg instanceof p5.Image);
        done();
      },
      function (event) {
        assert.fail();
        done();
      });
  });

  test('should call failureCallback when unable to load image', function (done) {
    myp5.loadImage(
      'invalid path',
      function (pImg) {
        assert.fail();
        done();
      },
      function (event) {
        assert.equal(event.type, 'error');
        done();
      });
  });
});
