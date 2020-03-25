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
    test('should download a gif', function() {
      // create a backup of createObjectURL
      let couBackup = window.URL.createObjectURL;
      let gifBlob;

      // file-saver uses createObjectURL as an intermediate step. If we
      // modify the definition a just a little bit we can capture whenever
      // it is called and also peek in the data that was passed to it
      window.URL.createObjectURL = blob => {
        // now use this gifBlob to verify the downloaded output
        gifBlob = blob;
        return couBackup(blob);
      };

      myp5.saveGif(myGif);
      console.log(gifBlob);
      // restore createObjectURL to the original one
      window.URL.createObjectURL = couBackup;
      assert.strictEqual(gifBlob.type, 'image/gif');
    });
  });
});
