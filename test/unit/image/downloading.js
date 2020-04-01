suite('downloading animated gifs', function() {
  let myp5;
  let myGif;

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

  let imagePath = 'unit/assets/nyan_cat.gif';

  setup(function disableFileLoadError() {
    sinon.stub(p5, '_friendlyFileLoadError');
  });

  teardown(function restoreFileLoadError() {
    p5._friendlyFileLoadError.restore();
  });

  setup(function loadMyGif(done) {
    myp5.loadImage(imagePath, function(pImg) {
      myGif = pImg;
      done();
    });
  });

  suite('p5.prototype.saveGif', function() {
    test('should be a function', function() {
      assert.ok(myp5.saveGif);
      assert.typeOf(myp5.saveGif, 'function');
    });
    test('should not throw an error', function() {
      myp5.saveGif(myGif);
    });
    testWithDownload('should download a gif', function(blobContainer) {
      myp5.saveGif(myGif);
      let gifBlob = blobContainer.blob;
      assert.strictEqual(gifBlob.type, 'image/gif');
    });
  });
});
