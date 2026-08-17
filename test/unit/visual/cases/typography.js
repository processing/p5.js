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

  visualSuite('JUSTIFIED alignment', function() {
    visualTest('WORD wrap justified non-final lines', function (p5, screenshot) {
      p5.createCanvas(300, 160);
      p5.textSize(16);
      p5.textAlign(p5.JUSTIFIED, p5.TOP);
      p5.textWrap(p5.WORD);
      const s = 'This is a line of text that should justify on non-final lines.';
      p5.text(s, 10, 10, 280, 140);
      screenshot();
    });
  });

  visualSuite('PRETTY/BALANCE wrap', function() {
    visualTest('PRETTY wrap LEFT', function (p5, screenshot) {
      p5.createCanvas(300, 160);
      p5.textSize(16);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textWrap(p5.PRETTY);
      const s = 'Balanced wrapping aims to reduce raggedness of lines.';
      p5.text(s, 10, 10, 280, 140);
      screenshot();
    });
    visualTest('BALANCE wrap RIGHT', function (p5, screenshot) {
      p5.createCanvas(300, 160);
      p5.textSize(16);
      p5.textAlign(p5.RIGHT, p5.TOP);
      p5.textWrap(p5.BALANCE);
      const s = 'Balanced wrapping aims to reduce raggedness of lines.';
      p5.text(s, 290, 10, 280, 140);
      screenshot();
    });
    visualTest('PRETTY wrap with JUSTIFIED', function (p5, screenshot) {
      p5.createCanvas(300, 160);
      p5.textSize(16);
      p5.textAlign(p5.JUSTIFIED, p5.TOP);
      p5.textWrap(p5.PRETTY);
      const s = 'Pretty wrapping combined with justification for non-final lines.';
      p5.text(s, 10, 10, 280, 140);
      screenshot();
    });
  });
});
