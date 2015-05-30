// In this example, we want to load a font
// image and use it in setup().
//
// Since setup() happens quickly at the beginning, the font doesn't
// have time to properly load before setup() is done.
//
// We are introducing preload() where you can run load
// operations that are guaranteed to complete by setup().
// This is called asynchronous loading, because it happens whenever
// the computer is done and ready, not necessarily when you call it.

var font1, font2, x=30, y=80, words = 'cean eans';

function preload() {
  font1 = loadFont('SourceSansPro-Regular.otf');
  font2 = loadFont('acmesa.ttf');
};

function setup() {

  createCanvas(400, 200);

  textFont(font1, 58);
  text(words, x, y);

  // metrics
  var ascent = textAscent();
  var descent = textDescent();
  var tw = textWidth(words);

  line(0,y,width,y);
  line(x+tw,0,x+tw,200);
  line(0,y-ascent,width,y-ascent);
  line(0,y+descent,width,y+descent);
  line(x,0,x,200);

  var tb = font1.textBounds(words, x, y); // tight
  noFill();
  stroke(200,0,0);
  rect(tb.x,tb.y,tb.w,tb.h);

  //fill(0);
  fill(100);
  stroke(100,0,0);
  textSize(40);
  textFont(font2);
  text('sleep furiously', x+20, y+80);
};
