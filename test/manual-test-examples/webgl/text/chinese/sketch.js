var font;

function preload() {
  font = loadFont(
    'https://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Regular.otf'
  );
}

var chars = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(3000);
  textAlign(CENTER, CENTER);
  fill(255);

  textFont(font);
  textSize(100);

  var glyphs = font.font.glyphs.glyphs;
  var glyphNames = Object.getOwnPropertyNames(glyphs);
  for (var ipn = 0; ipn < glyphNames.length; ipn++) {
    var glyph = glyphs[glyphNames[ipn]];
    var char = glyph.unicode;
    if (char) {
      chars.push(String.fromCharCode(char));
    }
  }
}

var ich = 0;
var lines = [];

function addLine() {
  var line = '';
  while (textWidth(line + chars[ich]) < width) {
    line += chars[ich++];
    if (ich > chars.length) {
      ich -= chars.length;
    }
  }
  lines.push(line);
}
var txt;
var yoff = 0;
var timeLast = 0;

function draw() {
  background(0);

  var leading = textLeading();

  var timeNow = millis() / 5;
  yoff += timeNow - timeLast;
  timeLast = timeNow;

  while (yoff > leading) {
    yoff -= leading;
    lines.shift();
  }

  while ((lines.length - 1) * leading < height) {
    addLine();
    txt = null;
  }

  if (!txt) {
    txt = lines.join('\n');
  }

  text(txt, 0, -yoff);
}
