// In this example, we want to load a font image and use it in setup().
//
// Since setup() happens quickly at the beginning, the font doesn't
// have time to properly load before setup() is done.
//
// So we use preload() for this type of load operations, which guarantees
// such functions will complete before setup() is called.
//
var font1, font2,
  x=30, y=80,
  x2=50, y2=160,
  words = 'clean ideas',
  words2 = 'sleep furiously';

function preload() {
  font1 = loadFont('SourceSansPro-Regular.otf');
  font2 = loadFont('acmesa.ttf');
};

function setup() {

  createCanvas(400, 200);

  fill(0,100,0);
  textFont(font1, 58);
  text(words, x, y);

  // metrics
  var ascent = textAscent();
  var descent = textDescent();
  var tw = textWidth(words);

  line(0,y,width,y);
  line(x+tw,30,x+tw,100);
  line(0,y-ascent,width,y-ascent);
  line(0,y+descent,width,y+descent);
  line(x,30,x,100);

  // tight bounds
  var tb = font1.textBounds(words, x, y);
  noFill();
  stroke(200,0,0);
  rect(tb.x,tb.y,tb.w,tb.h);

  textFont(font2, 40);

  // metrics
  ascent = textAscent();
  descent = textDescent();
  tw = textWidth(words2);

  stroke(0);
  line(0,y2,width,y2);
  line(x2+tw,120,x2+tw,180);
  line(0,y2-ascent,width,y2-ascent);
  line(0,y2+descent,width,y2+descent);
  line(x2,120,x2,180);

  // tight bounds
  stroke(200,0,0);
  tb = font2.textBounds(words2, x2, y2); // tight bounds
  rect(tb.x,tb.y,tb.w,tb.h);

  fill(0,100,0);
  noStroke();
  text(words2, x2, y2);
};
