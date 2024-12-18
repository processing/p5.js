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

    visualTest("with a Google Font URL", async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
      );
      p5.textFont(font);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(35);
      p5.text("p5*js", 0, 10, p5.width);
      screenshot();
    });

    visualTest("with a font file", async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont("/unit/assets/Inconsolata-Bold.ttf");
      p5.textFont(font);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(35);
      p5.text("p5*js", 0, 10, p5.width);
      screenshot();
    });

    visualTest("with a font file in WebGL", async function (p5, screenshot) {
      p5.createCanvas(100, 100, p5.WEBGL);
      const font = await p5.loadFont("/unit/assets/Inconsolata-Bold.ttf");
      p5.textFont(font);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(35);
      p5.text("p5*js", -p5.width / 2, -p5.height / 2 + 10, p5.width);
      screenshot();
    });
  });

  visualSuite("textWeight", function () {
    visualTest(
      "can control non-variable fonts",
      async function (p5, screenshot) {
        p5.createCanvas(100, 100);
        const font = await p5.loadFont(
          "https://fonts.googleapis.com/css2?family=Sniglet:wght@400;800&display=swap"
        );

        for (const weight of [400, 800]) {
          p5.background(255);
          p5.textFont(font);
          p5.textAlign(p5.LEFT, p5.TOP);
          p5.textSize(35);
          p5.textWeight(weight);
          p5.text("p5*js", 0, 10, p5.width);
          screenshot();
        }
      }
    );

    visualTest("can control variable fonts", async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
      );

      for (let weight = 400; weight <= 800; weight += 100) {
        p5.background(255);
        p5.textFont(font);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textSize(35);
        p5.textWeight(weight);
        p5.text("p5*js", 0, 10, p5.width);
        screenshot();
      }
    });

    visualTest(
      "can control variable fonts from files",
      async function (p5, screenshot) {
        p5.createCanvas(100, 100);
        const font = await p5.loadFont(
          "/unit/assets/BricolageGrotesque-Variable.ttf",
          { weight: "200 800" }
        );

        for (let weight = 400; weight <= 800; weight += 100) {
          p5.background(255);
          p5.textFont(font);
          p5.textAlign(p5.LEFT, p5.TOP);
          p5.textSize(35);
          p5.textWeight(weight);
          p5.text("p5*js", 0, 10, p5.width);
          screenshot();
        }
      }
    );
  });

  visualSuite("textAlign", function () {
    visualTest("all alignments with single word", function (p5, screenshot) {
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
        { alignX: p5.LEFT, alignY: p5.BASELINE },
        { alignX: p5.CENTER, alignY: p5.BASELINE },
        { alignX: p5.RIGHT, alignY: p5.BASELINE },
      ];

      p5.createCanvas(300, 200);
      p5.textSize(20);
      alignments.forEach((alignment) => {
        p5.textAlign(alignment.alignX, alignment.alignY);
        p5.text("Word", 0, 0);
        const bb = p5.textBounds("Word", 0, 0);
        p5.noFill();
        p5.stroke("red");
        p5.rect(bb.x, bb.y, bb.w, bb.h);
      });
      screenshot();
    });

    visualTest("all alignments with single line", function (p5, screenshot) {
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
        { alignX: p5.LEFT, alignY: p5.BASELINE },
        { alignX: p5.CENTER, alignY: p5.BASELINE },
        { alignX: p5.RIGHT, alignY: p5.BASELINE },
      ];

      p5.createCanvas(300, 200);
      p5.textSize(20);
      alignments.forEach((alignment) => {
        p5.textAlign(alignment.alignX, alignment.alignY);
        p5.text("Single Line", 0, 0);
        const bb = p5.textBounds("Single Line", 0, 0);
        p5.noFill();
        p5.stroke("red");
        p5.rect(bb.x, bb.y, bb.w, bb.h);
      });
      screenshot();
    });

    visualTest(
      "all alignments with multi-lines and wrap word",
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
          { alignX: p5.LEFT, alignY: p5.BASELINE },
          { alignX: p5.CENTER, alignY: p5.BASELINE },
          { alignX: p5.RIGHT, alignY: p5.BASELINE },
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
          { alignX: p5.LEFT, alignY: p5.BASELINE },
          { alignX: p5.CENTER, alignY: p5.BASELINE },
          { alignX: p5.RIGHT, alignY: p5.BASELINE },
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
          { alignX: p5.LEFT, alignY: p5.BASELINE },
          { alignX: p5.CENTER, alignY: p5.BASELINE },
          { alignX: p5.RIGHT, alignY: p5.BASELINE },
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

  // (Previous content continues...)

  visualSuite("textBaseline", function () {
    visualTest(
      "baseline alignment with different font sizes",
      function (p5, screenshot) {
        p5.createCanvas(400, 200);
        p5.background(255);

        p5.stroke(200);
        p5.line(20, 100, 380, 100);

        const fontSizes = [12, 16, 24, 32];
        let xPos = 40;

        fontSizes.forEach((size) => {
          p5.textSize(size);
          p5.textAlign(p5.LEFT, p5.BASELINE);
          p5.noStroke();
          p5.fill(0);
          p5.text(`Size ${size}`, xPos, 100);

          const bb = p5.textBounds(`Size ${size}`, xPos, 100);
          p5.noFill();
          p5.stroke("red");
          p5.rect(bb.x, bb.y, bb.w, bb.h);

          xPos += 90;
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

  visualSuite("textToPoints", function () {
    visualTest(
      "Fonts can be converted to points",
      async function (p5, screenshot) {
        p5.createCanvas(100, 100);
        const font = await p5.loadFont("/unit/assets/Inconsolata-Bold.ttf");
        p5.background(255);
        p5.strokeWeight(2);
        p5.textSize(50);
        const pts = font.textToPoints("p5*js", 0, 50);
        p5.beginShape(p5.POINTS);
        for (const { x, y } of pts) p5.vertex(x, y);
        p5.endShape();
        screenshot();
      }
    );

    visualTest(
      "Sampling density can be changed",
      async function (p5, screenshot) {
        p5.createCanvas(100, 100);
        const font = await p5.loadFont("/unit/assets/Inconsolata-Bold.ttf");
        p5.background(255);
        p5.strokeWeight(2);
        p5.textSize(50);
        const pts = font.textToPoints("p5*js", 0, 50, { sampleFactor: 0.5 });
        p5.beginShape(p5.POINTS);
        for (const { x, y } of pts) p5.vertex(x, y);
        p5.endShape();
        screenshot();
      }
    );
  });

  visualSuite("textToContours", function () {
    visualTest(
      "Fonts can be converted to points grouped by contour",
      async function (p5, screenshot) {
        p5.createCanvas(100, 100);
        const font = await p5.loadFont("/unit/assets/Inconsolata-Bold.ttf");
        p5.background(200);
        p5.strokeWeight(2);
        p5.textSize(50);
        const contours = font.textToContours("p5*js", 0, 50, {
          sampleFactor: 0.5,
        });
        p5.beginShape();
        for (const pts of contours) {
          p5.beginContour();
          for (const { x, y } of pts) p5.vertex(x, y);
          p5.endContour(p5.CLOSE);
        }
        p5.endShape();
        screenshot();
      }
    );
  });

  visualSuite("textToPaths", function () {
    visualTest(
      "Fonts can be converted to drawing context commands",
      async function (p5, screenshot) {
        p5.createCanvas(100, 100);
        const font = await p5.loadFont("/unit/assets/Inconsolata-Bold.ttf");
        p5.background(200);
        p5.strokeWeight(2);
        p5.textSize(50);
        const cmds = font.textToPaths("p5*js", 0, 50);
        p5.drawingContext.beginPath();
        for (const [type, ...args] of cmds) {
          if (type === "M") {
            p5.drawingContext.moveTo(...args);
          } else if (type === "L") {
            p5.drawingContext.lineTo(...args);
          } else if (type === "C") {
            p5.drawingContext.bezierCurveTo(...args);
          } else if (type === "Q") {
            p5.drawingContext.quadraticCurveTo(...args);
          } else if (type === "Z") {
            p5.drawingContext.closePath();
          }
        }
        p5.drawingContext.fill();
        p5.drawingContext.stroke();
        screenshot();
      }
    );
  });

  // New sections from the second file
  visualSuite("fontProperties", function () {
    visualTest("font stretch values", function (p5, screenshot) {
      p5.createCanvas(400, 300);
      const stretches = [
        "ultra-condensed",
        "extra-condensed",
        "condensed",
        "semi-condensed",
        "normal",
        "semi-expanded",
        "expanded",
        "extra-expanded",
        "ultra-expanded",
      ];
      let yPos = 30;

      stretches.forEach((stretch) => {
        p5.textSize(20);
        p5.textProperty("fontStretch", stretch);
        p5.text(`Hello world (${stretch})`, 20, yPos);
        yPos += 30;
      });
      screenshot();
    });

    visualTest("font kerning", function (p5, screenshot) {
      p5.createCanvas(400, 150);
      p5.textFont("serif", 24);
      const kerningOptions = ["auto", "normal", "none"];
      let yPos = 40;

      kerningOptions.forEach((kerning) => {
        p5.textProperty("fontKerning", kerning);
        p5.text(`AVA Ta We (fontKerning: ${kerning})`, 20, yPos);
        yPos += 40;
      });
      screenshot();
    });

    visualTest("font variant caps", function (p5, screenshot) {
      p5.createCanvas(400, 250);
      p5.textFont("serif", 24);
      const variants = [
        "normal",
        "small-caps",
        "all-small-caps",
        "petite-caps",
        "all-petite-caps",
        "unicase",
        "titling-caps",
      ];
      let yPos = 40;

      variants.forEach((variant) => {
        p5.textProperty("fontVariantCaps", variant);
        p5.text(`Hello World (${variant})`, 20, yPos);
        yPos += 35;
      });
      screenshot();
    });
  });

  visualSuite("textSpacing", function () {
    visualTest("letter spacing", function (p5, screenshot) {
      p5.createCanvas(500, 300);
      p5.textSize(24);
      let yPos = 40;

      for (let i = 0; i < 8; i++) {
        const spacing = p5.map(i, 0, 8, -3, 7) + "px";
        p5.textProperty("letterSpacing", spacing);
        p5.text(`Hello world (spacing: ${spacing})`, 20, yPos);
        yPos += 35;
      }
      screenshot();
    });

    visualTest("word spacing", function (p5, screenshot) {
      p5.createCanvas(500, 300);
      p5.textSize(24);
      let yPos = 40;

      for (let i = 0; i < 8; i++) {
        const spacing = p5.map(i, 0, 8, 0, 60) + "px";
        p5.textProperty("wordSpacing", spacing);
        p5.text(`Hello world (spacing: ${spacing})`, 20, yPos);
        yPos += 35;
      }
      screenshot();
    });
  });

  visualSuite("textBounds", function () {
    visualTest(
      "single line bounds with different rect modes",
      function (p5, screenshot) {
        p5.createCanvas(500, 400);
        const modes = [p5.CORNER, p5.CORNERS, p5.CENTER, p5.RADIUS];
        const modeNames = ["CORNER", "CORNERS", "CENTER", "RADIUS"];
        let yPos = 50;

        modes.forEach((mode, i) => {
          p5.rectMode(mode);
          const text = `Mode: ${modeNames[i]}`;
          const bb = p5.textBounds(text, 100, yPos);

          p5.noFill();
          p5.stroke("red");
          p5.rect(bb.x, bb.y, bb.w, bb.h);

          p5.fill(0);
          p5.noStroke();
          p5.text(text, 100, yPos);

          yPos += 80;
        });
        screenshot();
      }
    );

    visualTest("RTL text bounds", function (p5, screenshot) {
      p5.createCanvas(400, 200);
      const rtlText = "السلام عليكم";
      p5.textSize(24);

      p5.textAlign(p5.LEFT);
      const bbLeft = p5.textBounds(rtlText, 50, 50);
      p5.text(rtlText, 50, 50);
      p5.noFill();
      p5.stroke("red");
      p5.rect(bbLeft.x, bbLeft.y, bbLeft.w, bbLeft.h);

      p5.textAlign(p5.RIGHT);
      const bbRight = p5.textBounds(rtlText, 350, 150);
      p5.text(rtlText, 350, 150);
      p5.noFill();
      p5.stroke("red");
      p5.rect(bbRight.x, bbRight.y, bbRight.w, bbRight.h);

      screenshot();
    });
  });
});
