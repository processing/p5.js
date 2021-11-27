var font,
  lineW,
  words = 'swimming back to the rock';

function preload() {
  font = loadFont('../Helvetica.ttf');
}

function setup() {
  function textAsWords(words, x, y) {
    var tw,
      spaceW = textWidth(' ');
    //console.log('space=' + spaceW);
    for (var i = 0; i < words.length; i++) {
      fill(0);
      noStroke();
      text(words[i], x, y);
      x += textWidth(words[i]);
      //console.log(words[i] + '=' + x);

      if (i < words.length - 1) {
        stroke(0);
        noFill();
        rect(x, y + 5, spaceW, -25);
        x += spaceW;
      }
    }
    stroke(0, 0, 255);
    line(x, y - 45, x, y + 5);
    fill(0);
    noStroke();
  }

  createCanvas(300, 280);
  background(255);

  textSize(20); // Case 1: Default font
  noStroke();
  //console.log('default');
  text(words, 20, 50);
  textAsWords(words.split(' '), 20, 80);

  stroke(255, 0, 0);
  line(20, 0, 20, height);

  textFont(font, 20); // Case 2: OpenSans
  noStroke();
  //console.log('\np5/loaded');
  text(words, 20, 120);

  textAsWords(words.split(' '), 20, 150);
  stroke(0);
}

setTimeout(function() {
  function _textAsWords(ctx, font, text, x, y, fontSize) {
    var tw,
      spaceW = font.getAdvanceWidth(' ', fontSize);
    //console.log('space=' + spaceW);

    for (var i = 0; i < text.length; i++) {
      var pth = font.getPath(text[i], x, y, fontSize);
      pth.draw(ctx);
      x += font.getAdvanceWidth(text[i], fontSize);
      //console.log(text[i] + '=' + x);
      if (i < text.length - 1) {
        ctx.strokeRect(x, y + 5, spaceW, -25);
        x += spaceW;
      }
    }
    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.moveTo(x, y - 45);
    ctx.lineTo(x, y + 5);
    ctx.stroke();
  }

  opentype.load('../Helvetica.ttf', function(err, font) {
    if (err) throw 'Font could not be loaded: ' + err;
    var ctx = document.getElementById('defaultCanvas0').getContext('2d');
    font.getPath(words, 20, 190, 20).draw(ctx);
    //console.log('\nopentype/loaded');
    _textAsWords(ctx, font, words.split(' '), 20, 220, 20);
  });
}, 100);
