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

    visualTest('with a Google Font URL', async function (p5, screenshot) {
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

    visualTest('with a font file', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.textFont(font);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(35);
      p5.text('p5*js', 0, 10, p5.width);
      screenshot();
    });

    visualTest('with a woff font file', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        '/unit/assets/Lato-Regular.woff'
      );
      p5.textFont(font);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(35);
      p5.text('p5*js', 0, 10, p5.width);
      screenshot();
    });

    visualTest('with a directly set font string', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      p5.textFont(`italic bold 32px serif`);
      p5.text('p5*js', 0, 10, p5.width);
      screenshot();
    });

    visualTest('with a font file in WebGL', async function (p5, screenshot) {
      p5.createCanvas(100, 100, p5.WEBGL);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.textFont(font);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(35);
      p5.text('p5*js', -p5.width / 2, -p5.height / 2 + 10, p5.width);
      screenshot();
    });
  });

  visualSuite('textWeight', function () {
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

    visualTest('can control variable fonts from files in WebGL', async function (p5, screenshot) {
      p5.createCanvas(100, 100, p5.WEBGL);
      const font = await p5.loadFont(
        '/unit/assets/BricolageGrotesque-Variable.ttf',
      );
      for (let weight = 400; weight <= 800; weight += 100) {
        p5.push();
        p5.background(255);
        p5.translate(-p5.width/2, -p5.height/2);
        p5.textFont(font);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textSize(35);
        p5.textWeight(weight);
        p5.text('p5*js', 0, 10, p5.width);
        p5.pop();
        screenshot();
      }
    });
  });

  visualSuite("textAlign", function () {
    for (const mode of ['2d', 'webgl']) {
      visualSuite(`${mode} mode`, () => {
        visualTest("all alignments with single word", async function (p5, screenshot) {
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

          p5.createCanvas(300, 300, mode === 'webgl' ? p5.WEBGL : undefined);
          if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
          p5.textSize(60);
          const font = await p5.loadFont(
            '/unit/assets/Inconsolata-Bold.ttf'
          );
          p5.textFont(font);
          alignments.forEach((alignment) => {
            p5.background(255);
            p5.textAlign(alignment.alignX, alignment.alignY);
            p5.text("Single Line", p5.width / 2, p5.height / 2);
            const bb = p5.textBounds("Single Line", p5.width / 2, p5.height / 2);
            p5.push();
            p5.noFill();
            p5.stroke("red");
            p5.rect(bb.x, bb.y, bb.w, bb.h);
            p5.pop();
            screenshot();
          })
        });

        visualTest("all alignments with single line", async function (p5, screenshot) {
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

          p5.createCanvas(300, 300, mode === 'webgl' ? p5.WEBGL : undefined);
          if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
          p5.textSize(45);
          const font = await p5.loadFont(
            '/unit/assets/Inconsolata-Bold.ttf'
          );
          p5.textFont(font);
          alignments.forEach((alignment) => {
            p5.background(255);
            p5.textAlign(alignment.alignX, alignment.alignY);
            p5.text("Single Line", p5.width / 2, p5.height / 2);
            const bb = p5.textBounds("Single Line", p5.width / 2, p5.height / 2);
            p5.push();
            p5.noFill();
            p5.stroke("red");
            p5.rect(bb.x, bb.y, bb.w, bb.h);
            p5.pop();
            screenshot();
          });
        });

        visualTest("all alignments with multi-lines and wrap word",
          async function (p5, screenshot) {
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

            p5.createCanvas(150, 100, mode === 'webgl' ? p5.WEBGL : undefined);
            if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
            p5.textSize(20);
            p5.textWrap(p5.WORD);
            const font = await p5.loadFont(
              '/unit/assets/Inconsolata-Bold.ttf'
            );
            p5.textFont(font);

            let xPos = 20;
            let yPos = 20;
            const boxWidth = 100;
            const boxHeight = 60;

            alignments.forEach((alignment, i) => {
              p5.background(255);
              p5.push();
              p5.textAlign(alignment.alignX, alignment.alignY);

              p5.noFill();
              p5.strokeWeight(2);
              p5.stroke(200);
              p5.rect(xPos, yPos, boxWidth, boxHeight);

              p5.fill(0);
              p5.noStroke();
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
              p5.pop();

              screenshot();
            });
          }
        );

        visualTest(
          "all alignments with multi-lines and wrap char",
          async function (p5, screenshot) {
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

            p5.createCanvas(150, 100, mode === 'webgl' ? p5.WEBGL : undefined);
            if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
            p5.textSize(19);
            p5.textWrap(p5.CHAR);
            const font = await p5.loadFont(
              '/unit/assets/Inconsolata-Bold.ttf'
            );
            p5.textFont(font);

            let xPos = 20;
            let yPos = 20;
            const boxWidth = 100;
            const boxHeight = 60;

            alignments.forEach((alignment, i) => {
              p5.background(255);
              p5.push();
              p5.textAlign(alignment.alignX, alignment.alignY);

              p5.noFill();
              p5.strokeWeight(2);
              p5.stroke(200);
              p5.rect(xPos, yPos, boxWidth, boxHeight);

              p5.fill(0);
              p5.noStroke();
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
              p5.pop();

              screenshot();
            });
          }
        );

        visualTest(
          "all alignments with multi-line manual text",
          async function (p5, screenshot) {
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

            p5.createCanvas(150, 100, mode === 'webgl' ? p5.WEBGL : undefined);
            if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
            p5.textSize(20);

            const font = await p5.loadFont(
              '/unit/assets/Inconsolata-Bold.ttf'
            );
            p5.textFont(font);

            let xPos = 20;
            let yPos = 20;
            const boxWidth = 100;
            const boxHeight = 60;

            alignments.forEach((alignment, i) => {
              p5.background(255);
              p5.push();
              p5.textAlign(alignment.alignX, alignment.alignY);

              p5.noFill();
              p5.stroke(200);
              p5.strokeWeight(2);
              p5.rect(xPos, yPos, boxWidth, boxHeight);

              p5.fill(0);
              p5.noStroke();
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
              p5.pop();

              screenshot();
            });
          }
        );
      });
    }
  });

  visualSuite("textStyle", function () {
    visualTest("all text styles", async function (p5, screenshot) {
      p5.createCanvas(150, 150);
      const font = await p5.loadFont(
        'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap'
      );
      p5.textSize(20);
      p5.textFont(font);
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
      p5.createCanvas(100, 100);
      p5.textSize(20);
      const text = "Width Test";
      const width = p5.textWidth(text);
      p5.text(text, 0, 30);
      p5.noFill();
      p5.stroke("red");
      p5.rect(0, 30 - 20, width, 20);
      screenshot();
    });
  });

  visualSuite('textToPoints', function () {
    visualTest('Fonts can be converted to points', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.background(255);
      p5.strokeWeight(2);
      p5.textSize(50);
      const pts = font.textToPoints('p5*js', 0, 50);
      p5.beginShape(p5.POINTS);
      for (const { x, y } of pts) p5.vertex(x, y);
      p5.endShape();
      screenshot();
    });

    visualTest('Sampling density can be changed', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.background(255);
      p5.strokeWeight(2);
      p5.textSize(50);
      const pts = font.textToPoints('p5*js', 0, 50, { sampleFactor: 0.5 });
      p5.beginShape(p5.POINTS);
      for (const { x, y } of pts) p5.vertex(x, y);
      p5.endShape();
      screenshot();
    });

    for (const mode of ['RADIANS', 'DEGREES']) {
      visualTest(`Fonts point angles work in ${mode} mode`, async function (p5, screenshot) {
        p5.createCanvas(100, 100);
        const font = await p5.loadFont(
          '/unit/assets/Inconsolata-Bold.ttf'
        );
        p5.background(255);
        p5.strokeWeight(2);
        p5.textSize(50);
        p5.angleMode(p5[mode]);
        const pts = font.textToPoints('p5*js', 0, 50, { sampleFactor: 0.25 });
        p5.beginShape(p5.LINES);
        for (const { x, y, angle } of pts) {
          p5.vertex(
            x - 5 * p5.cos(angle),
            y - 5 * p5.sin(angle)
          );
          p5.vertex(
            x + 5 * p5.cos(angle),
            y + 5 * p5.sin(angle)
          );
        }
        p5.endShape();
        screenshot();
      });
    }
  });

  visualSuite('textToContours', function () {
    visualTest('Fonts can be converted to points grouped by contour', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.background(200);
      p5.strokeWeight(2);
      p5.textSize(50);
      const contours = font.textToContours('p5*js', 0, 50, { sampleFactor: 0.5 })
      p5.beginShape();
      for (const pts of contours) {
        p5.beginContour();
        for (const { x, y } of pts) p5.vertex(x, y);
        p5.endContour(p5.CLOSE);
      }
      p5.endShape();
      screenshot();
    });
  });

  visualSuite('textToPaths', function () {
    visualTest('Fonts can be converted to drawing context commands', async function (p5, screenshot) {
      p5.createCanvas(100, 100);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.background(200);
      p5.strokeWeight(2);
      p5.textSize(50);
      const cmds = font.textToPaths('p5*js', 0, 50)
      p5.drawingContext.beginPath();
      for (const [type, ...args] of cmds) {
        if (type === 'M') {
          p5.drawingContext.moveTo(...args);
        } else if (type === 'L') {
          p5.drawingContext.lineTo(...args);
        } else if (type === 'C') {
          p5.drawingContext.bezierCurveTo(...args);
        } else if (type === 'Q') {
          p5.drawingContext.quadraticCurveTo(...args);
        } else if (type === 'Z') {
          p5.drawingContext.closePath();
        }
      }
      p5.drawingContext.fill();
      p5.drawingContext.stroke();
      screenshot();
    });
  });
}, { shiftThreshold: 3 });
