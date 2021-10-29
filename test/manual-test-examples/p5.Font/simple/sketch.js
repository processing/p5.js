var _setup = function(p, font) {
  var txt,
    tb,
    tw,
    x = 20,
    y = 50;

  p.createCanvas(240, 160);
  p.textFont(font);
  p.textSize(20);

  p.stroke('blue');
  p.line(x, 0, x, p.height);

  txt = ' leading space';
  tb = font.textBounds(txt, x, y);
  tw = p.textWidth(txt);
  p.stroke('black');
  p.rect(tb.x, tb.y, tb.w, tb.h);
  p.noStroke();
  p.text(txt, x, y);
  p.stroke('red');
  p.line(x, y + 6, x + tw, y + 6);

  y = 80;
  txt = 'traction waste';
  tb = font.textBounds(txt, x, y);
  tw = p.textWidth(txt);
  p.stroke('black');
  p.rect(tb.x, tb.y, tb.w, tb.h);
  p.noStroke();
  p.text(txt, x, y);
  p.stroke('red');
  p.line(x, y + 6, x + tw, y + 6);

  y = 110;
  txt = 'trailing space ';
  tb = font.textBounds(txt, x, y);
  tw = p.textWidth(txt);
  p.stroke('black');
  p.rect(tb.x, tb.y, tb.w, tb.h);
  p.noStroke();
  p.text(txt, x, y);
  p.stroke('red');
  p.line(x, y + 6, x + tw, y + 6);

  y = 140;
  txt = ' ';
  tb = font.textBounds(txt, x, y);
  tw = p.textWidth(txt);
  p.stroke('black');
  p.rect(tb.x, tb.y, tb.w, p.max(tb.h, 3));
  p.noStroke();
  p.text(txt, x, y);
  p.stroke('red');
  p.line(x, y + 6, x + tw, y + 6);
};

var textSketch = function(p) {
  p.setup = function() {
    p.loadFont('../acmesa.ttf', function(f) {
      _setup(p, f);
    });
  };
};

var textSketchMono = function(p) {
  p.setup = function() {
    p.loadFont('../AndaleMono.ttf', function(f) {
      _setup(p, f);
    });
  };
};

var textSketch1958 = function(p) {
  // issue #1958
  var font,
    lineW,
    words = 'swimming back to the rock';

  p.preload = function() {
    font = p.loadFont('../OpenSans-Regular.ttf');
  };

  p.setup = function() {
    function textAsWords(words, x, y) {
      var tw,
        spaceW = p.textWidth(' ');
      //console.log(spaceW);
      for (var i = 0; i < words.length; i++) {
        if (i !== 0) {
          tw = p.textWidth(words[i - 1]);
          x += tw + spaceW;
          p.stroke(0);
          p.noFill();
          p.rect(x - spaceW, y + 5, spaceW, -25);
        }
        p.fill(0);
        p.noStroke();
        p.text(words[i], x, y);
      }
    }

    p.createCanvas(300, 200);
    p.background(255);

    p.textSize(20); // Case 1: Default font
    p.noStroke();
    p.text(words, 20, 50);
    textAsWords(words.split(' '), 20, 80);

    p.stroke(255, 0, 0);
    p.line(20, 0, 20, p.height);

    lineW = p.textWidth(words);
    p.line(20 + lineW, 0, 20 + lineW, 90);

    p.textFont(font, 20); // Case 2: OpenSans
    p.noStroke();
    p.text(words, 20, 120);
    textAsWords(words.split(' '), 20, 150);

    p.stroke(255, 0, 0);
    lineW = p.textWidth(words);
    p.line(20 + lineW, 100, 20 + lineW, p.height - 20);

    p.stroke(0);
    p.line(20, 160, 20 + p.textWidth(' '), 160);
  };
};

/*var textSketch1957 = function(p) { // issue #1957
  var font;
  p.preload = function() {
    font = p.loadFont("../AndaleMono.ttf");
  };
  p.setup = function() {

    p.createCanvas(300, 400);
    p.textFont(font, 80);

    p.text("a", 0, 100);
    p.text("b", 0, 200);
    p.text("c", 0, 300);

    p.stroke(255,0,0);
    p.line(p.textWidth("a"), 0, p.textWidth("a"), p.height);
    p.line(p.textWidth("b"), 0, p.textWidth("b"), p.height);
    p.line(p.textWidth("c"), 0, p.textWidth("c"), p.height);
    p.noStroke();
    p.textSize(10);
    p.text("a="+p.textWidth("a")+" b="+p.textWidth("b")+" c="+p.textWidth("c"), 10, 350);
    console.log(font);
  }
}
new p5(textSketch1957, "textSketch1957");*/

var textSketch5181 = function(p) {
  // issue #5181
  var font,
    txt =
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";

  p.preload = function() {
    font = p.loadFont('../OpenSans-Regular.ttf');
  };

  p.setup = function() {
    p.createCanvas(300, 700);
    p.background(255);

    let bounds = [20, 10, 250, 130];
    p.textFont(font, 12);
    p.rect(...bounds);
    p.text('Default Size/Lead (12/15): ' + txt, ...bounds);

    bounds = [20, 150, 250, 230];
    p.textFont(font, 16);
    p.rect(...bounds);
    p.text('Default Size/Lead (16/20): ' + txt, ...bounds);

    bounds = [20, 390, 250, 105];
    p.textLeading(12);
    p.textFont(font, 12);
    p.rect(...bounds);
    p.text('User-set Size/Lead (12/12): ' + txt, ...bounds);

    bounds = [20, 505, 250, 185];
    p.textFont(font, 20);
    p.rect(...bounds);
    p.text('Maintain Custom Leading (20/12): ' + txt, ...bounds);
  };
};

new p5(textSketch, 'textSketch');
new p5(textSketchMono, 'textSketchMono');
new p5(textSketch1958, 'textSketch1958');
new p5(textSketch5181, 'textSketch5181');
