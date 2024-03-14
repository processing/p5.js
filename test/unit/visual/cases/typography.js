visualSuite('Typography', function() {
  visualSuite('textFont() with default fonts', function() {
    visualTest('With the default font', function (p5, screenshot) {
      p5.createCanvas(50, 50);
      p5.textSize(20);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text('test', 0, 0);
      screenshot();
    });

    visualTest('With the default monospace font', function (p5, screenshot) {
      p5.createCanvas(50, 50);
      p5.textSize(20);
      p5.textFont('monospace');
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text('test', 0, 0);
      screenshot();
    });
  });
}, { focus: true });
