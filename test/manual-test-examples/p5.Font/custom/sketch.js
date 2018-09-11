const textSketch = function(p) {
  let font, font2;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
    font2 = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    //p.ellipse(20,20,50,70);
    p.textFont(font);
    p.textSize(18);
    p.text('Default Text', 10, 30);
    p.textFont(font2);
    p.noStroke();
    p.fill(0, 102, 153);
    p.text('Blue No Stroke Text', 10, 60);
    p.stroke(0, 200, 0);
    p.strokeWeight(0.5);
    p.text('Blue with Green Stroked Text', 10, 90);
    p.noStroke();
    p.textSize(12);
    p.fill(120);
    p.text(
      'Simple long Text: Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
      10,
      90,
      220,
      60
    );
  };
};

const textLineSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240 * 4, 160);
    p.textFont(font);
    p.textSize(10);
    p.stroke(0);
    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(10, 10, 220, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.text('LEFT TOP is simply dummy text.', 10, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(10, 60, 220, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.TOP);
    p.text('CENTER TOP is simply dummy text.', 10, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(10, 110, 220, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.TOP);
    p.text('RIGHT TOP is simply dummy text.', 10, 110);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(250, 10, 470, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.text('LEFT CENTER is simply dummy text.', 250, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(250, 60, 470, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('CENTER CENTER is simply dummy text.', 250, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(250, 110, 470, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text('RIGHT CENTER is simply dummy text.', 250, 110);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(490, 10, 710, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text('LEFT BOTTOM is simply dummy text.', 490, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(490, 60, 710, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text('CENTER BOTTOM is simply dummy text.', 490, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(490, 110, 710, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text('RIGHT BOTTOM is simply dummy text.', 490, 110);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(730, 10, 950, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BASELINE);
    p.text('LEFT BASELINE is simply dummy text.', 730, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(730, 60, 950, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text('CENTER BASELINE is simply dummy text.', 730, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(730, 110, 950, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text('RIGHT BASELINE is simply dummy text.', 730, 110);
  };
};

const textWrapSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240 * 4, 160);
    p.textFont(font);
    p.textSize(10);
    p.stroke(0);
    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(10, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.text(
      'LEFT TOP is simply dummy text of the printing and typesetting industry. ',
      10,
      10,
      220,
      40
    );
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(10, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.TOP);
    p.text(
      'CENTER TOP is simply dummy text of the printing and typesetting industry. ',
      10,
      60,
      220,
      40
    );
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(10, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(
      'RIGHT TOP is simply dummy text of the printing and typesetting industry. ',
      10,
      110,
      220,
      40
    );

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(250, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(
      'LEFT CENTER is simply dummy text of the printing and typesetting industry. ',
      250,
      10,
      220,
      40
    );
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(250, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      'CENTER CENTER is simply dummy text of the printing and typesetting industry. ',
      250,
      60,
      220,
      40
    );
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(250, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(
      'RIGHT CENTER is simply dummy text of the printing and typesetting industry. ',
      250,
      110,
      220,
      40
    );

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(490, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(
      'LEFT BOTTOM is simply dummy text of the printing and typesetting industry. ',
      490,
      10,
      220,
      40
    );
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(490, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(
      'CENTER BOTTOM is simply dummy text of the printing and typesetting industry. ',
      490,
      60,
      220,
      40
    );
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(490, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text(
      'RIGHT BOTTOM is simply dummy text of the printing and typesetting industry. ',
      490,
      110,
      220,
      40
    );

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(730, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BASELINE);
    p.text(
      'LEFT BASELINE is simply dummy text of the printing and typesetting industry. ',
      730,
      10,
      220,
      40
    );
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(730, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text(
      'CENTER BASELINE is simply dummy text of the printing and typesetting industry. ',
      730,
      60,
      220,
      40
    );
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(730, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text(
      'RIGHT BASELINE is simply dummy text of the printing and typesetting industry. ',
      730,
      110,
      220,
      40
    );
  };
};

const textAlignSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    p.textAlign(p.RIGHT, p.TOP);
    p.text('Top Right', 120, 30);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Center Center', 120, 60);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text('Left Bottom', 120, 90);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text('Right Baseline', 120, 90);
    p.strokeWeight(1);
    p.line(120, 0, 120, 160);
  };
};

const textLeadingSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(400, 200);
    p.textFont(font);
    p.fill(0);
    p.textSize(12);

    p.line(0, 100, p.width, 100);
    p.textAlign(p.LEFT, p.TOP);
    p.strokeWeight(0);

    const s10 = 'LEFT/TOP@10px',
      s20 = s10.replace('1', '2'),
      s30 = s10.replace('1', '3');

    p.textLeading(10); // Set leading to 10
    p.text(s10 + '\n' + s10 + '\n' + s10, 10, 100);
    p.textLeading(20); // Set leading to 20
    p.text(s20 + '\n' + s20 + '\n' + s20, 140, 100);
    p.textLeading(30); // Set leading to 30
    p.text(s30 + '\n' + s30 + '\n' + s30, 270, 100);
  };
};

const textLeadingSketch2 = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(400, 200);
    p.textFont(font);
    p.fill(0);
    p.textSize(12);

    p.line(0, 100, p.width, 100);
    p.textAlign(p.LEFT, p.CENTER);
    p.strokeWeight(0);

    const s10 = 'LEFT/CENTER@10px',
      s20 = s10.replace('1', '2'),
      s30 = s10.replace('1', '3');

    p.textLeading(10); // Set leading to 10
    p.text(s10 + '\n' + s10 + '\n' + s10, 10, 100);
    p.textLeading(20); // Set leading to 20
    p.text(s20 + '\n' + s20 + '\n' + s20, 140, 100);
    p.textLeading(30); // Set leading to 30
    p.text(s30 + '\n' + s30 + '\n' + s30, 270, 100);
  };
};

const textLeadingSketch3 = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(400, 200);
    p.textFont(font);
    p.fill(0);
    p.textSize(12);

    p.line(0, 100, p.width, 100);
    p.textAlign(p.LEFT, p.BASELINE);
    p.strokeWeight(0);

    const s10 = 'LEFT/BASELINE@10px',
      s20 = s10.replace('1', '2'),
      s30 = s10.replace('1', '3');

    p.textLeading(10); // Set leading to 10
    p.text(s10 + '\n' + s10 + '\n' + s10, 10, 100);
    p.textLeading(20); // Set leading to 20
    p.text(s20 + '\n' + s20 + '\n' + s20, 140, 100);
    p.textLeading(30); // Set leading to 30
    p.text(s30 + '\n' + s30 + '\n' + s30, 270, 100);
  };
};

const textLeadingSketch4 = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(400, 200);
    p.textFont(font);
    p.fill(0);
    p.textSize(12);

    p.line(0, 100, p.width, 100);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.strokeWeight(0);

    const s10 = 'LEFT/BOTTOM@10px',
      s20 = s10.replace('1', '2'),
      s30 = s10.replace('1', '3');

    p.textLeading(10); // Set leading to 10
    p.text(s10 + '\n' + s10 + '\n' + s10, 10, 100);
    p.textLeading(20); // Set leading to 20
    p.text(s20 + '\n' + s20 + '\n' + s20, 140, 100);
    p.textLeading(30); // Set leading to 30
    p.text(s30 + '\n' + s30 + '\n' + s30, 270, 100);
  };
};

const textAlignmentSketch = function(p) {
  let font1, font2, font3, font4;
  const hAligns = [p.LEFT, p.CENTER, p.RIGHT];
  const vAligns = [p.TOP, p.CENTER, p.BASELINE, p.BOTTOM];
  const textString = 'Hello p5';
  const padding = 10;
  p.preload = function() {
    font1 = p.loadFont('../SourceSansPro-Regular.otf');
    font2 = p.loadFont('../FiraSans-Book.otf');
    font3 = p.loadFont('../Inconsolata-Bold.ttf');
    font4 = p.loadFont('../PlayfairDisplay-Regular.ttf');
  };
  const drawFontAlignments = function(font, xOff, yOff) {
    p.textFont(font);
    p.textSize(20);
    for (let h = 0; h < hAligns.length; h += 1) {
      for (let v = 0; v < vAligns.length; v += 1) {
        // Distribute words across the screen
        const x =
          xOff + p.map(h, 0, hAligns.length - 1, padding, 400 - padding);
        const y =
          yOff + p.map(v, 0, vAligns.length - 1, padding, 200 - padding);

        p.stroke(200);
        p.line(0, y, p.width, y);
        p.line(x, 0, x, p.height);

        // Align the text & calculate the bounds
        p.textAlign(hAligns[h], vAligns[v]);

        // Draw the text
        p.fill(255, 0, 0);
        p.noStroke();
        p.text(textString, x, y);

        // Draw the (x, y) coordinates
        p.stroke(0);
        p.fill('#FF8132');
        p.ellipse(x, y, 3, 3);
      }
    }
  };
  p.setup = function() {
    const renderer = p.createCanvas(400, 800);
    renderer.elt.style.position = 'absolute';
    renderer.elt.style.top = '0';
    renderer.elt.style.left = '0';
    drawFontAlignments(font1, 0, 0);
    drawFontAlignments(font2, 0, 200);
    drawFontAlignments(font3, 0, 400);
    drawFontAlignments(font4, 0, 600);
  };
};

const textVertAlignmentSketch = function(p) {
  const fontNames = [
    'acmesa.ttf',
    'FiraSans-Book.otf',
    'Lato-Black.ttf',
    'Inconsolata-Bold.ttf',
    'Merriweather-LightItalic.ttf',
    'Montserrat-Regular.ttf',
    'OpenSans-Regular.ttf',
    'SourceSansPro-Regular.otf'
  ];
  const fonts = [];
  const vAligns = [p.TOP, p.CENTER, p.BASELINE, p.BOTTOM];
  p.preload = function() {
    for (let i = 0; i < fontNames.length; i += 1) {
      fonts.push(p.loadFont('../' + fontNames[i]));
    }
  };
  const drawFontAlignments = function(font, xOff, yOff) {
    p.textFont(font);
    p.textSize(20);
    for (let v = 0; v < vAligns.length; v += 1) {
      // Distribute words across the screen
      const x = xOff;
      const y = yOff + p.map(v, 0, vAligns.length - 1, 10, p.height - 10);

      p.stroke(200);
      p.line(0, y, p.width, y);

      // Align the text & calculate the bounds
      p.textAlign(p.CENTER, vAligns[v]);

      // Draw the text
      p.fill(255, 0, 0);
      p.noStroke();
      p.text('Hello p5', x, y);

      // Draw the (x, y) coordinates
      p.stroke(0);
      p.fill('#FF8132');
      p.ellipse(x, y, 3, 3);
    }
  };
  p.setup = function() {
    const renderer = p.createCanvas(1000, 200);
    renderer.elt.style.position = 'absolute';
    renderer.elt.style.top = '0';
    renderer.elt.style.left = '0';
    for (let i = 0; i < fonts.length; i += 1) {
      const x = p.map(i, 0, fonts.length - 1, 100, p.width - 100);
      drawFontAlignments(fonts[i], x, 0);
    }
  };
};

const textSizeSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    p.text('Font Size 12', 10, 30);
    p.textSize(14);
    p.text('Font Size 14', 10, 60);
    p.textSize(16);
    p.text('Font Size 16', 10, 90);
  };
};

const textBoundsSketch = function(p) {
  let font;
  const text = 'Lorem ipsum dolor sit amet.';
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.strokeWeight(1);
    p.textSize(16);
    const bbox = font.textBounds(text, 30, 60, 16);
    p.fill(255);
    p.stroke(0);
    p.rect(bbox.x, bbox.y, bbox.w, bbox.h);
    p.fill(0);
    p.strokeWeight(0);
    p.text(text, 30, 60);
  };
};

const textStyleSketch = function(p) {
  let font;
  p.preload = function() {
    fontRegular = p.loadFont('../SourceSansPro-Regular.otf');
    fontItalic = p.loadFont('../SourceSansPro-Italic.ttf');
    fontBold = p.loadFont('../SourceSansPro-Bold.ttf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p
      .fill(0)
      .strokeWeight(0)
      .textSize(24);
    p.textFont(fontRegular);
    p.text('Font Style Normal', 30, 50);
    p.textFont(fontItalic);
    p.text('Font Style Italic', 30, 80);
    p.textFont(fontBold);
    p.text('Font Style Bold', 30, 110);
  };
};

const textWidthSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    const s = "What's the width of this line?";
    const textWidth = p.textWidth(s);
    p.text(s, 10, 30);
    p.rect(10, 30, textWidth, 2);
    p.text('width: ' + textWidth, 10, 60);
  };
};

const textOverlapSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../SourceSansPro-Regular.otf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(72);
    p.fill(0, 160); // Black with low opacity
    p.text('O', 0, 100);
    p.text('V', 30, 100);
    p.text('E', 60, 100);
    p.text('R', 90, 100);
    p.text('L', 120, 100);
    p.text('A', 150, 100);
    p.text('P', 180, 100);
  };
};

const textFlySketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  let x1 = 100;
  let x2 = 0;
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.fill(0);
    p.textSize(48);
  };
  p.draw = function() {
    p.background(204);
    p.text('Left', x1, 50);
    p.text('Right', x2, 150);
    x2 += 2.0;
    if (x2 > 240) {
      x2 = -100;
    }
    x1 -= 1.0;
    if (x1 < -100) {
      x1 = 240;
    }
  };
};

const textFlickerSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.textSize(48);
    p.noStroke();
  };
  p.draw = function() {
    p.fill(204, 24);
    p.rect(0, 0, p.width, p.height);
    p.fill(0);
    p.text('flicker Text', p.random(-100, 240), p.random(-20, 160));
  };
};

const textFadeSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  let opacity = 0;
  let direction = 1;
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.textSize(72);
    p.noStroke();
  };
  p.draw = function() {
    p.background(204);
    opacity += 4 * direction;
    if (opacity < 0 || opacity > 255) {
      direction = -direction;
    }
    p.fill(0, opacity);
    p.text('fade', 50, 100);
  };
};

const textRotateSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  let angle = 0.0;
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.textSize(24);
    p.noStroke();
    p.fill(0);
  };
  p.draw = function() {
    p.background(204);
    angle += 0.05;
    p.push();
    p.translate(120, 80);
    p.scale((p.cos(angle / 4.0) + 1.2) * 2.0);
    p.rotate(angle);
    p.text('Rotating', 0, 0);
    p.pop();
  };
};

const textGrowSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  let angle = 0.0;
  const str = 'GROW';
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.textSize(24);
    p.noStroke();
    p.fill(0, 0, 0, 120);
  };
  p.draw = function() {
    p.background(204);
    angle += 0.1;
    for (let i = 0; i < str.length; i++) {
      const c = p.sin(angle + i / p.PI);
      p.textSize((c + 1.0) * 40 + 10);
      p.text(str.charAt(i), i * 40 + 20, 100);
    }
  };
};

const textAvoidSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.textSize(24);
    p.noStroke();
    p.fill(0);
    p.textAlign(p.CENTER);
  };
  p.draw = function() {
    p.background(204);
    p.text('AVOID', p.width - p.mouseX, p.height - p.mouseY);
  };
};

const textBendSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  const str = 'Flexibility';
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textFont(font);
    p.textSize(30);
    p.noStroke();
    p.fill(0);
  };
  p.draw = function() {
    p.background(204);
    p.push();
    p.translate(0, 33);
    for (let i = 0; i < str.length; i++) {
      const angle = p.map(p.mouseX, 0, p.width, 0, p.PI / 8);
      p.rotate(angle);
      p.text(str[i], 20, 0);
      p.translate(p.textWidth(str[i]) * 1.5, 0);
    }
    p.pop();
  };
};

const typographyLetterSketch = function(p) {
  let font;
  p.preload = function() {
    font = p.loadFont('../acmesa.ttf');
  };
  const margin = 10;
  const gap = 46;
  let counter = 35;
  p.setup = function() {
    p.createCanvas(720, 320);
    p.textFont(font);
    p.background(0);
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.translate(margin * 4, margin * 4);
    for (let y = 0; y < p.height - gap; y += gap) {
      for (let x = 0; x < p.width - gap; x += gap) {
        const letter = p.char(counter);
        if (letter === 'P' || letter === '5') {
          p.fill(255, 204, 0);
        } else if (letter === 'J' || letter === 'S') {
          p.fill(204, 0, 255);
        } else {
          p.fill(255);
        }
        p.text(letter, x, y);
        counter++;
      }
    }
  };
};

new p5(textSketch, 'textSketch');
new p5(textLineSketch, 'textLineSketch');
new p5(textWrapSketch, 'textWrapSketch');
new p5(textAlignSketch, 'textAlignSketch');
new p5(textLeadingSketch, 'textLeadingSketch');
new p5(textLeadingSketch2, 'textLeadingSketch2');
new p5(textLeadingSketch3, 'textLeadingSketch3');
new p5(textLeadingSketch4, 'textLeadingSketch4');
new p5(textAlignmentSketch, 'textAlignmentSketch');
new p5(textVertAlignmentSketch, 'textVertAlignmentSketch');
new p5(textSizeSketch, 'textSizeSketch');
new p5(textBoundsSketch, 'textBoundsSketch');
new p5(textStyleSketch, 'textStyleSketch');
new p5(textWidthSketch, 'textWidthSketch');
new p5(textOverlapSketch, 'textOverlapSketch');
new p5(textFlySketch, 'textFlySketch');
new p5(textFlickerSketch, 'textFlickerSketch');
new p5(textFadeSketch, 'textFadeSketch');
new p5(textRotateSketch, 'textRotateSketch');
new p5(textGrowSketch, 'textGrowSketch');
new p5(textAvoidSketch, 'textAvoidSketch');
new p5(textBendSketch, 'textBendSketch');
new p5(typographyLetterSketch, 'typographyLetterSketch');
