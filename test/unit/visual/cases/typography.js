import { visualSuite, visualTest } from "../visualTest";

visualSuite("Typography", function () {
  visualSuite("textFont", function () {
    visualTest("with the default font", function (p5, screenshot) {
      p5.createCanvas(50, 50);
      p5.textSize(20);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text("test", 0, 0);
      screenshot();
    });

    visualTest("with the default monospace font", function (p5, screenshot) {
      p5.createCanvas(50, 50);
      p5.textSize(20);
      p5.textFont("monospace");
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text("test", 0, 0);
      screenshot();
    });

    visualTest('with a Google Font URL', async function(p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap'
      );
      p5.textFont(font);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(35);
      p5.text('p5*js', 0, 10, p5.width);
      screenshot();
    });
  });

  visualSuite('textWeight', function() {
    visualTest('can control non-variable fonts', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        'https://fonts.googleapis.com/css2?family=Sniglet:wght@400;800&display=swap'
      );

      for (const weight of [400, 800]) {
        p5.background(255);
        p5.textFont(font);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textSize(35);
        p5.textWeight(weight);
        p5.text('p5*js', 0, 10, p5.width);
        screenshot();
      }
    });

    visualTest('can control variable fonts', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
      );

      for (let weight = 400; weight <= 800; weight += 100) {
        p5.background(255);
        p5.textFont(font);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textSize(35);
        p5.textWeight(weight);
        p5.text('p5*js', 0, 10, p5.width);
        screenshot();
      }
    });

    visualTest('can control variable fonts from files', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        '/unit/assets/BricolageGrotesque-Variable.ttf',
        { weight: '200 800' }
      );

      for (let weight = 400; weight <= 800; weight += 100) {
        p5.background(255);
        p5.textFont(font);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textSize(35);
        p5.textWeight(weight);
        p5.text('p5*js', 0, 10, p5.width);
        screenshot();
      }
    });
  });

  visualSuite("textAlign", function () { // TEMPORARY SKIP
    /*visualTest.skip("all alignments with single word", function (p5, screenshot) {
      const alignments = [
        { alignX: p5.LEFT, alignY: p5.TOP },
        { alignX: p5.CENTER, alignY: p5.TOP },
        { alignX: p5.RIGHT, alignY: p5.TOP },
        { alignX: p5.LEFT, alignY: p5.CENTER },
        { alignX: p5.CENTER, alignY: p5.CENTER },
        { alignX: p5.RIGHT, alignY: p5.CENTER },
        { alignX: p5.LEFT, alignY: p5.BOTTOM },
        { alignX: p5.CENTER, alignY: p5.BOTTOM },
        { alignX: p5.RIGHT, alignY: p5.BOTTOM },
      ];

      p5.createCanvas(300, 80);
      p5.textSize(60);
      alignments.forEach((alignment) => {
        p5.textAlign(alignment.alignX, alignment.alignY);
        p5.text("Single Line", 0, 0);
        const bb = p5.textBounds("Single Line", 0, 0);
        p5.noFill();
        p5.stroke("red");
        p5.rect(bb.x, bb.y, bb.w, bb.h);
      })
      screenshot();
    });

    visualTest.skip("all alignments with single line", function (p5, screenshot) {
      const alignments = [
        { alignX: p5.LEFT, alignY: p5.TOP },
        { alignX: p5.CENTER, alignY: p5.TOP },
        { alignX: p5.RIGHT, alignY: p5.TOP },
        { alignX: p5.LEFT, alignY: p5.CENTER },
        { alignX: p5.CENTER, alignY: p5.CENTER },
        { alignX: p5.RIGHT, alignY: p5.CENTER },
        { alignX: p5.LEFT, alignY: p5.BOTTOM },
        { alignX: p5.CENTER, alignY: p5.BOTTOM },
        { alignX: p5.RIGHT, alignY: p5.BOTTOM },
      ];

      p5.createCanvas(300, 80);
      p5.textSize(60);
      alignments.forEach((alignment) => {
        p5.textAlign(alignment.alignX, alignment.alignY);
        p5.text("Single Line", 0, 0);
        const bb = p5.textBounds("Single Line", 0, 0);
        p5.noFill();
        p5.stroke("red");
        p5.rect(bb.x, bb.y, bb.w, bb.h);
      });
      screenshot();
    });*/

    visualTest("all alignments with multi-lines and wrap word",
      function (p5, screenshot) {
        const alignments = [
          { alignX: p5.LEFT, alignY: p5.TOP },
          { alignX: p5.CENTER, alignY: p5.TOP },
          { alignX: p5.RIGHT, alignY: p5.TOP },
          { alignX: p5.LEFT, alignY: p5.CENTER },
          { alignX: p5.CENTER, alignY: p5.CENTER },
          { alignX: p5.RIGHT, alignY: p5.CENTER },
          { alignX: p5.LEFT, alignY: p5.BOTTOM },
          { alignX: p5.CENTER, alignY: p5.BOTTOM },
          { alignX: p5.RIGHT, alignY: p5.BOTTOM },
        ];

        p5.createCanvas(300, 200);
        p5.textSize(20);
        p5.textWrap(p5.WORD);

        let xPos = 20;
        let yPos = 20;
        const boxWidth = 100;
        const boxHeight = 60;

        alignments.forEach((alignment, i) => {
          if (i % 3 === 0 && i !== 0) {
            yPos += 70;
            xPos = 20;
          }

          p5.textAlign(alignment.alignX, alignment.alignY);

          p5.noFill();
          p5.stroke(200);
          p5.rect(xPos, yPos, boxWidth, boxHeight);

          p5.fill(0);
          p5.text(
            "A really long text that should wrap automatically as it reaches the end of the box",
            xPos,
            yPos,
            boxWidth,
            boxHeight
          );
          const bb = p5.textBounds(
            "A really long text that should wrap automatically as it reaches the end of the box",
            xPos,
            yPos,
            boxWidth,
            boxHeight
          );
          p5.noFill();
          p5.stroke("red");
          p5.rect(bb.x, bb.y, bb.w, bb.h);

          xPos += 120;
        });
        screenshot();
      }
    );

    visualTest(
      "all alignments with multi-lines and wrap char",
      function (p5, screenshot) {
        const alignments = [
          { alignX: p5.LEFT, alignY: p5.TOP },
          { alignX: p5.CENTER, alignY: p5.TOP },
          { alignX: p5.RIGHT, alignY: p5.TOP },
          { alignX: p5.LEFT, alignY: p5.CENTER },
          { alignX: p5.CENTER, alignY: p5.CENTER },
          { alignX: p5.RIGHT, alignY: p5.CENTER },
          { alignX: p5.LEFT, alignY: p5.BOTTOM },
          { alignX: p5.CENTER, alignY: p5.BOTTOM },
          { alignX: p5.RIGHT, alignY: p5.BOTTOM },
        ];

        p5.createCanvas(300, 200);
        p5.textSize(20);
        p5.textWrap(p5.CHAR);

        let xPos = 20;
        let yPos = 20;
        const boxWidth = 100;
        const boxHeight = 60;

        alignments.forEach((alignment, i) => {
          if (i % 3 === 0 && i !== 0) {
            yPos += 70;
            xPos = 20;
          }

          p5.textAlign(alignment.alignX, alignment.alignY);

          p5.noFill();
          p5.stroke(200);
          p5.rect(xPos, yPos, boxWidth, boxHeight);

          p5.fill(0);
          p5.text(
            "A really long text that should wrap automatically as it reaches the end of the box",
            xPos,
            yPos,
            boxWidth,
            boxHeight
          );
          const bb = p5.textBounds(
            "A really long text that should wrap automatically as it reaches the end of the box",
            xPos,
            yPos,
            boxWidth,
            boxHeight
          );
          p5.noFill();
          p5.stroke("red");
          p5.rect(bb.x, bb.y, bb.w, bb.h);

          xPos += 120;
        });
        screenshot();
      }
    );

    visualTest(
      "all alignments with multi-line manual text",
      function (p5, screenshot) {
        const alignments = [
          { alignX: p5.LEFT, alignY: p5.TOP },
          { alignX: p5.CENTER, alignY: p5.TOP },
          { alignX: p5.RIGHT, alignY: p5.TOP },
          { alignX: p5.LEFT, alignY: p5.CENTER },
          { alignX: p5.CENTER, alignY: p5.CENTER },
          { alignX: p5.RIGHT, alignY: p5.CENTER },
          { alignX: p5.LEFT, alignY: p5.BOTTOM },
          { alignX: p5.CENTER, alignY: p5.BOTTOM },
          { alignX: p5.RIGHT, alignY: p5.BOTTOM },
        ];

        p5.createCanvas(300, 200);
        p5.textSize(20);

        let xPos = 20;
        let yPos = 20;
        const boxWidth = 100;
        const boxHeight = 60;

        alignments.forEach((alignment, i) => {
          if (i % 3 === 0 && i !== 0) {
            yPos += 70;
            xPos = 20;
          }

          p5.textAlign(alignment.alignX, alignment.alignY);

          p5.noFill();
          p5.stroke(200);
          p5.rect(xPos, yPos, boxWidth, boxHeight);

          p5.fill(0);
          p5.text("Line 1\nLine 2\nLine 3", xPos, yPos, boxWidth, boxHeight);
          const bb = p5.textBounds(
            "Line 1\nLine 2\nLine 3",
            xPos,
            yPos,
            boxWidth,
            boxHeight
          );
          p5.noFill();
          p5.stroke("red");
          p5.rect(bb.x, bb.y, bb.w, bb.h);

          xPos += 120;
        });
        screenshot();
      }
    );
  });

  visualSuite("textStyle", function () {
    visualTest("all text styles", function (p5, screenshot) {
      p5.createCanvas(300, 100);
      p5.textSize(20);
      p5.textAlign(p5.LEFT, p5.TOP);

      p5.text("Regular Text", 0, 0);
      p5.textStyle(p5.BOLD);
      p5.text("Bold Text", 0, 30);
      p5.textStyle(p5.ITALIC);
      p5.text("Italic Text", 0, 60);
      p5.textStyle(p5.BOLDITALIC);
      p5.text("Bold Italic Text", 0, 90);
      screenshot();
    });
  });

  visualSuite("textSize", function () {
    const units = ["px"];
    const sizes = [12, 16, 20, 24, 30];

    visualTest("text sizes comparison", function (p5, screenshot) {
      p5.createCanvas(300, 200);
      let yOffset = 0;

      units.forEach((unit) => {
        sizes.forEach((size) => {
          p5.textSize(size);
          p5.textAlign(p5.LEFT, p5.TOP);
          p5.text(`Size: ${size}${unit}`, 0, yOffset);
          yOffset += 30;
        });
      });
      screenshot();
    });
  });

  visualSuite("textLeading", function () {
    visualTest("text leading with different values", function (p5, screenshot) {
      p5.createCanvas(300, 200);
      const leadingValues = [10, 20, 30];
      let yOffset = 0;

      p5.textSize(20);
      p5.textAlign(p5.LEFT, p5.TOP);

      leadingValues.forEach((leading) => {
        p5.textLeading(leading);
        p5.text(`Leading: ${leading}`, 0, yOffset);
        p5.text("This is a line of text.", 0, yOffset + 30);
        p5.text("This is another line of text.", 0, yOffset + 30 + leading);
        yOffset += 30 + leading;
      });
      screenshot();
    });
  });

  visualSuite("textWidth", function () {
    visualTest("verify width of a string", function (p5, screenshot) {
      p5.createCanvas(300, 100);
      p5.textSize(20);
      const text = "Width Test";
      const width = p5.textWidth(text);
      p5.text(text, 0, 50);
      p5.noFill();
      p5.stroke("red");
      p5.rect(0, 50 - 20, width, 20);
      screenshot();
    });
  });
});
