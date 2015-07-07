var textSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textSize(18);
    p.text("Default Text", 10, 30);
    p.noStroke();
    p.fill(0, 102, 153);
    p.text("Blue No Stroke Text", 10, 60);
    p.textStyle(p.ITALIC);
    p.text("Blue No Stroke Text Italic", 10, 80);
    p.textStyle(p.BOLD);
    p.text("Blue No Stroke Text Bold", 10, 100);
    p.fill(120).textStyle(p.NORMAL).textSize(12).text("Simple long Text: Lorem Ipsum is simply dummy text of the printing and typesetting industry. ", 10, 110, 220, 60);
  };
};

var textLineSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240*4, 160);
    p.textSize(10);
    p.stroke(0);
    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(10, 10, 220, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.text("LEFT TOP is simply dummy text.", 10, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(10, 60, 220, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.TOP);
    p.text("CENTER TOP is simply dummy text.", 10, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(10, 110, 220, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("RIGHT TOP is simply dummy text.", 10, 110);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(250, 10, 470, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("LEFT CENTER is simply dummy text.", 250, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(250, 60, 470, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("CENTER CENTER is simply dummy text.", 250, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(250, 110, 470, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("RIGHT CENTER is simply dummy text.", 250, 110);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(490, 10, 710, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("LEFT BOTTOM is simply dummy text.", 490, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(490, 60, 710, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("CENTER BOTTOM is simply dummy text.", 490, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(490, 110, 710, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text("RIGHT BOTTOM is simply dummy text.", 490, 110);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.line(730, 10, 950, 10);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BASELINE);
    p.text("LEFT BASELINE is simply dummy text.", 730, 10);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.line(730, 60, 950, 60);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text("CENTER BASELINE is simply dummy text.", 730, 60);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.line(730, 110, 950, 110);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text("RIGHT BASELINE is simply dummy text.", 730, 110);
  };
};

var textWrapSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240*4, 160);
    p.textSize(10);
    p.stroke(0);
    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(10, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.text("LEFT TOP is simply dummy text of the printing and typesetting industry. ", 10, 10, 220, 40);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(10, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.TOP);
    p.text("CENTER TOP is simply dummy text of the printing and typesetting industry. ", 10, 60, 220, 40);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(10, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("RIGHT TOP is simply dummy text of the printing and typesetting industry. ", 10, 110, 220, 40);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(250, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("LEFT CENTER is simply dummy text of the printing and typesetting industry. ", 250, 10, 220, 40);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(250, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("CENTER CENTER is simply dummy text of the printing and typesetting industry. ", 250, 60, 220, 40);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(250, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("RIGHT CENTER is simply dummy text of the printing and typesetting industry. ", 250, 110, 220, 40);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(490, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("LEFT BOTTOM is simply dummy text of the printing and typesetting industry. ", 490, 10, 220, 40);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(490, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("CENTER BOTTOM is simply dummy text of the printing and typesetting industry. ", 490, 60, 220, 40);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(490, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text("RIGHT BOTTOM is simply dummy text of the printing and typesetting industry. ", 490, 110, 220, 40);

    //1
    p.fill(255);
    p.strokeWeight(1);
    p.rect(730, 10, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.LEFT, p.BASELINE);
    p.text("LEFT BASELINE is simply dummy text of the printing and typesetting industry. ", 730, 10, 220, 40);
    //2
    p.fill(255);
    p.strokeWeight(1);
    p.rect(730, 60, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text("CENTER BASELINE is simply dummy text of the printing and typesetting industry. ", 730, 60, 220, 40);
    //3
    p.fill(255);
    p.strokeWeight(1);
    p.rect(730, 110, 220, 40);
    p.strokeWeight(0);
    p.fill(0);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text("RIGHT BASELINE is simply dummy text of the printing and typesetting industry. ", 730, 110, 220, 40);
  };
};

var textFontSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.textSize(20);
    p.fill(0);
    p.strokeWeight(0);
    p.textFont('times');
    p.text("Times Font", 10, 30);
    p.textFont('arial');
    p.text("Arial Font", 10, 60);
    p.textFont('Courier');
    p.text("Courier Font", 10, 90);
  };
};

var textAlignSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("Top Right", 120, 30);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Center Center", 120, 60);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Left Bottom", 120, 90);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text("Right Baseline", 120, 90);
    p.strokeWeight(1);
    p.line(120, 0, 120, 160);
  };
};

var textLeadingSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    //leadig
    p.textLeading(10);  // Set leading to 10
    p.text("Leading10px\nLeading10px\nLeading10px", 10, 30);
    p.textLeading(20);  // Set leading to 20
    p.text("Leading20px\nLeading20px\nLeading20px", 90, 30);
    p.textLeading(30);  // Set leading to 30
    p.text("Leading30px\nLeading30px\nLeading30px", 170, 30);
  };
};

var textSizeSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    p.text("Font Size 12", 10, 30);
    p.textSize(14);
    p.text("Font Size 14", 10, 60);
    p.textSize(16);
    p.text("Font Size 16", 10, 90);
  };
};

var textStyleSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    p.textStyle(p.NORMAL);
    p.text("Font Style Normal", 10, 30);
    p.textStyle(p.ITALIC);
    p.text("Font Style Italic", 10, 60);
    p.textStyle(p.BOLD);
    p.text("Font Style Bold", 10, 90);
  };
};

var textWidthSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(12);
    var s = "What's the width of this line?";
    var textWidth = p.textWidth(s);
    p.text(s, 10, 30);
    p.rect(10, 30, textWidth, 2);
    p.text("width: " + textWidth, 10, 60);
  };
};

var textOverlapSketch = function(p) {
  p.setup = function() {
    p.createCanvas(240, 160);
    p.fill(0);
    p.strokeWeight(0);
    p.textSize(72);
    p.fill(0, 160); // Black with low opacity
    p.text("O", 0, 100);
    p.text("V", 30, 100);
    p.text("E", 60, 100);
    p.text("R", 90, 100);
    p.text("L", 120, 100);
    p.text("A", 150, 100);
    p.text("P", 180, 100);
  };
};

var textFlySketch = function(p) {
  var x1 = 100;
  var x2 = 0;
  p.setup = function(){
    p.createCanvas(240, 160);
    p.fill(0);
    p.textSize(48);
  };
  p.draw = function(){
    p.background(204);
    p.text("Left", x1, 50);
    p.text("Right", x2, 150);
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

var textFlickerSketch = function(p) {
  p.setup = function(){
    p.createCanvas(240, 160);
    p.textSize(48);
    p.noStroke();
  };
  p.draw = function(){
    p.fill(204, 24);
    p.rect(0, 0, p.width, p.height);
    p.fill(0);
    p.text("flicker Text", p.random(-100, 240), p.random(-20, 160));
  };
};

var textFadeSketch = function(p) {
  var opacity = 0;
  var direction = 1;
  p.setup = function(){
    p.createCanvas(240, 160);
    p.textSize(72);
    p.noStroke();
  };
  p.draw = function(){
    p.background(204);
    opacity += 4 * direction;
    if ((opacity < 0) || (opacity > 255)) {
      direction = -direction;
    }
    p.fill(0, opacity);
    p.text("fade", 50, 100);
  };
};

var textRotateSketch = function(p) {
  var angle = 0.0;
  p.setup = function(){
    p.createCanvas(240, 160);
    p.textSize(24);
    p.noStroke();
    p.fill(0);
  };
  p.draw = function(){
    p.background(204);
    angle += 0.05;
    p.push();
    p.translate(120, 80);
    p.scale((p.cos(angle / 4.0) + 1.2) * 2.0);
    p.rotate(angle);
    p.text("Rotating", 0, 0);
    p.pop();
  };
};

var textGrowSketch = function(p) {
  var angle = 0.0;
  var str = "GROW";
  p.setup = function(){
    p.createCanvas(240, 160);
    p.textSize(24);
    p.noStroke();
    p.fill(0, 0, 0, 120);
  };
  p.draw = function(){
    p.background(204);
    angle += 0.1;
    for (var i = 0; i < str.length; i++) {
      var c = p.sin(angle + i / p.PI);
      p.textSize((c + 1.0) * 40 + 10);
      p.text(str.charAt(i), i*40 + 20, 100);
    }
  };
};

var textAvoidSketch = function(p) {
  p.setup = function(){
    p.createCanvas(240, 160);
    p.textSize(24);
    p.noStroke();
    p.fill(0);
    p.textAlign(p.CENTER);
  };
  p.draw = function(){
    p.background(204);
    p.text("AVOID", p.width - p.mouseX, p.height - p.mouseY);
  };
};

var textBendSketch = function(p) {
  var str = "Flexibility";
  p.setup = function(){
    p.createCanvas(240, 160);
    p.textSize(30);
    p.noStroke();
    p.fill(0);
  };
  p.draw = function(){
    p.background(204);
    p.push();
    p.translate(0, 33);
    for (var i = 0; i < str.length; i++) {
      var angle = p.map(p.mouseX, 0, p.width, 0, p.PI / 8);
      p.rotate(angle);
      p.text(str[i], 20, 0);
      p.translate(p.textWidth(str[i])*1.5, 0);
    }
    p.pop();
  };
};

var typographyLetterSketch = function(p) {
  var margin = 10;
  var gap = 46;
  var counter = 35;
  p.setup = function(){
    p.createCanvas(720, 320);
    p.background(0);
    p.textFont("Georgia");
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.translate(margin*4, margin*4);
    for (var y = 0; y < p.height-gap; y += gap) {
      for (var x = 0; x < p.width-gap; x += gap) {
        var letter = p.char(counter);
        if (letter == 'P' || letter == '5') {
          p.fill(255, 204, 0);
        }
        else if (letter == 'J' || letter == 'S') {
          p.fill(204, 0, 255);
        }
        else {
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
new p5(textFontSketch, 'textFontSketch');
new p5(textAlignSketch, 'textAlignSketch');
new p5(textLeadingSketch, 'textLeadingSketch');
new p5(textSizeSketch, 'textSizeSketch');
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
