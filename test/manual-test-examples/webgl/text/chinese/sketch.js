let font;

function preload() {
  font = loadFont(
    'https://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Regular.otf'
  );
}

const chars = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(3000);
  textAlign(CENTER, CENTER);
  fill(255);

  textFont(font);
  textSize(100);

  const glyphs = font.font.glyphs.glyphs;
  const glyphNames = Object.getOwnPropertyNames(glyphs);
  for (let ipn = 0; ipn < glyphNames.length; ipn++) {
    const glyph = glyphs[glyphNames[ipn]];
    const char = glyph.unicode;
    if (char) {
      chars.push(String.fromCharCode(char));
    }
  }
}

let ich = 0;
const lines = [];

function addLine() {
  let line = '';
  while (textWidth(line + chars[ich]) < width) {
    line += chars[ich++];
    if (ich > chars.length) {
      ich -= chars.length;
    }
  }
  lines.push(line);
}
let txt;
let yoff = 0;
let timeLast = 0;

function draw() {
  background(0);

  const leading = textLeading();

  const timeNow = millis() / 5;
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
