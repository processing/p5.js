// In this example, we want to load a *very large* (123MegaPixels)
// image and display it in setup().
//
// Since setup() happens quickly at the beginning, the image doesn't
// have time to properly load before setup() is done.
//
// We are introducing preload() where you can run load
// operations that are guaranteed to complete by setup().
// This is called asynchronous loading, because it happens whenever
// the computer is done and ready, not necessarily when you call it.

var sketch = function(p) {
  var font1, font2;

  p.preload = function() {

    font1 = p.loadFont('SourceSansPro-Regular.otf');
    font2 = p.loadFont('acmesa.ttf');
  };

  p.setup = function() {

    p.createCanvas(600, 200);
    p.fill(20);

    p.textSize(64);
    p.textFont('times');
    p.text("Lexical Projection...", 30, 50);

    p.textFont(font2, 48);
    p.text("Indexical Rejection", 30, 100);
  };

}

var myp5 = new p5(sketch);
