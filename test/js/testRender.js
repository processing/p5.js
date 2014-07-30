/**
 * Expects an image file and a p5 instance and checks that they are
 * similar.  Sends result to the callback.
 */
var testRender = function(file, sketch, callback) {
  sketch.loadPixels();
  var p = sketch.pixels;
  var ctx = sketch;

  sketch.clear();

  sketch.loadImage(file, function(img) { // TODO: Handle case where file doesn't load
    ctx.image(img, 0, 0, 100, 100);

    ctx.loadPixels();
    var n = 0;
    for (var i=0; i<p.length; i++) {
      for (var j=0; j<4; j++) {
        var diff = Math.abs(p[i][j] - ctx.pixels[i][j]);
        n += diff;
      }
    }
    var same = (n/(256*4*p.length)) < 0.015;
    same = same && (ctx.pixels.length === p.length);
    callback(same);
  });
}