
var textSketch = function(p) {

  var font, txt, tb;

  p.preload = function() {
    font = p.loadFont("../acmesa.ttf");
  };

  p.setup = function() {

    p.createCanvas(240, 160);
    p.textFont(font);
    p.textSize(20);

    txt = ' space first';
    var tb = font.textBounds(txt,50,50,20);
    p.rect(tb.x,tb.y,tb.w,tb.h);
    p.text(txt, 50, 50);

    txt = 'trailing space?'
    tb = font.textBounds(txt,50,80,20);
    p.rect(tb.x,tb.y,tb.w,tb.h);
    p.text(txt, 50, 80);

    txt = 'trailing space? '
    tb = font.textBounds(txt,50,110,20);
    p.rect(tb.x,tb.y,tb.w,tb.h);
    p.text(txt, 50, 110);

    var tw = font._textWidth(txt);
    tb = font.textBounds(' ',50,140,20);
    p.rect(tb.x,tb.y,tb.w,tb.h);
  };

};


new p5(textSketch, 'textSketch');
