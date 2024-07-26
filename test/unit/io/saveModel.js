suite('saveModel',function() {
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
  testWithDownload(
    'should download an .obj file with expected contents',
    async function(blobContainer) {
      //.obj content as a string
      const objContent = `v 100 0 0
      v 0 -100 0
      v 0 0 -100
      v 0 100 0
      v 100 0 0
      v 0 0 -100
      v 0 100 0
      v 0 0 100
      v 100 0 0
      v 0 100 0
      v 0 0 -100
      v -100 0 0
      v -100 0 0
      v 0 -100 0
      v 0 0 100
      v 0 0 -100
      v 0 -100 0
      v -100 0 0
      v 0 100 0
      v -100 0 0
      v 0 0 100
      v 0 0 100
      v 0 -100 0
      v 100 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vt 0 0
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      vn 0 0 1
      f 1 2 3
      f 4 5 6
      f 7 8 9
      f 10 11 12
      f 13 14 15
      f 16 17 18
      f 19 20 21
      f 22 23 24
      `;

      const objBlob = new Blob([objContent], { type: 'text/plain' });

      myp5.downloadFile(objBlob, 'model', 'obj');

      let myBlob = blobContainer.blob;

      let text = await myBlob.text();

      assert.strictEqual(text, objContent);
    },
    true
  );

});
