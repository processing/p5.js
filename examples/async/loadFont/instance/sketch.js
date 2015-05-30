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
  
    font1 = p.loadFont(opentype, 'SourceSansPro-Regular.otf');
    font2 = p.loadFont(opentype, 'acmesa.ttf'); 
  };

  p.setup = function() {
  
    p.createCanvas(600, 600);
    p.fill(20);
    
    p.textFont('times', 64);
    p.text("Lexical Rejection", 30, 50);
    
    /*p.textFont(font1, 70);
    p.text("Lexical Injection", 30, 120);
    
    // TODO: this is a bug... (should still be at 120)
    p.textFont(font2, 64);
    p.text("Lexical Projection", 30, 120, 200, 200);*/
  };

}

var myp5 = new p5(sketch);
