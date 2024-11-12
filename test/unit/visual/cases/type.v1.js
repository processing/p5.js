// import p5 from "../../../../src/app.js";
import p5 from "https://cdn.jsdelivr.net/npm/p5@1.11.1/+esm"; // v1
import { server } from "@vitest/browser/context";
import {
  THRESHOLD,
  DIFFERENCE,
  ERODE,
} from "../../../../src/core/constants.js";
const { readFile, writeFile } = server.commands;

// import { visualSuite, visualTest } from "../visualTest";

visualSuite("Type.v1", function () {
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
  });

  //   visualSuite("textAlign", function () {
  //     visualTest("all alignments with single word", function (p5, screenshot) {
  //       const alignments = [
  //         { alignX: p5.LEFT, alignY: p5.TOP },
  //         { alignX: p5.CENTER, alignY: p5.TOP },
  //         { alignX: p5.RIGHT, alignY: p5.TOP },
  //         { alignX: p5.LEFT, alignY: p5.CENTER },
  //         { alignX: p5.CENTER, alignY: p5.CENTER },
  //         { alignX: p5.RIGHT, alignY: p5.CENTER },
  //         { alignX: p5.LEFT, alignY: p5.BOTTOM },
  //         { alignX: p5.CENTER, alignY: p5.BOTTOM },
  //         { alignX: p5.RIGHT, alignY: p5.BOTTOM },
  //       ];

  //       p5.createCanvas(300, 200);
  //       p5.textSize(20);
  //       alignments.forEach((alignment) => {
  //         p5.textAlign(alignment.alignX, alignment.alignY);
  //         p5.text("Word", 0, 0);
  //         const bb = p5.textBounds("Word", 0, 0);
  //         p5.noFill();
  //         p5.stroke("red");
  //         p5.rect(bb.x, bb.y, bb.w, bb.h);
  //       });
  //       screenshot();
  //     });

  //     visualTest("all alignments with single line", function (p5, screenshot) {
  //       const alignments = [
  //         { alignX: p5.LEFT, alignY: p5.TOP },
  //         { alignX: p5.CENTER, alignY: p5.TOP },
  //         { alignX: p5.RIGHT, alignY: p5.TOP },
  //         { alignX: p5.LEFT, alignY: p5.CENTER },
  //         { alignX: p5.CENTER, alignY: p5.CENTER },
  //         { alignX: p5.RIGHT, alignY: p5.CENTER },
  //         { alignX: p5.LEFT, alignY: p5.BOTTOM },
  //         { alignX: p5.CENTER, alignY: p5.BOTTOM },
  //         { alignX: p5.RIGHT, alignY: p5.BOTTOM },
  //       ];

  //       p5.createCanvas(300, 200);
  //       p5.textSize(20);
  //       alignments.forEach((alignment) => {
  //         p5.textAlign(alignment.alignX, alignment.alignY);
  //         p5.text("Single Line", 0, 0);
  //         const bb = p5.textBounds("Single Line", 0, 0);
  //         p5.noFill();
  //         p5.stroke("red");
  //         p5.rect(bb.x, bb.y, bb.w, bb.h);
  //       });
  //       screenshot();
  //     });

  //     visualTest(
  //       "all alignments with multi-lines and wrap word",
  //       function (p5, screenshot) {
  //         const alignments = [
  //           { alignX: p5.LEFT, alignY: p5.TOP },
  //           { alignX: p5.CENTER, alignY: p5.TOP },
  //           { alignX: p5.RIGHT, alignY: p5.TOP },
  //           { alignX: p5.LEFT, alignY: p5.CENTER },
  //           { alignX: p5.CENTER, alignY: p5.CENTER },
  //           { alignX: p5.RIGHT, alignY: p5.CENTER },
  //           { alignX: p5.LEFT, alignY: p5.BOTTOM },
  //           { alignX: p5.CENTER, alignY: p5.BOTTOM },
  //           { alignX: p5.RIGHT, alignY: p5.BOTTOM },
  //         ];

  //         p5.createCanvas(300, 200);
  //         p5.textSize(20);
  //         p5.textWrap(p5.WORD);

  //         let xPos = 20;
  //         let yPos = 20;
  //         const boxWidth = 100;
  //         const boxHeight = 60;

  //         alignments.forEach((alignment, i) => {
  //           if (i % 3 === 0 && i !== 0) {
  //             yPos += 70;
  //             xPos = 20;
  //           }

  //           p5.textAlign(alignment.alignX, alignment.alignY);

  //           p5.noFill();
  //           p5.stroke(200);
  //           p5.rect(xPos, yPos, boxWidth, boxHeight);

  //           p5.fill(0);
  //           p5.text(
  //             "A really long text that should wrap automatically as it reaches the end of the box",
  //             xPos,
  //             yPos,
  //             boxWidth,
  //             boxHeight
  //           );
  //           const bb = p5.textBounds(
  //             "A really long text that should wrap automatically as it reaches the end of the box",
  //             xPos,
  //             yPos,
  //             boxWidth,
  //             boxHeight
  //           );
  //           p5.noFill();
  //           p5.stroke("red");
  //           p5.rect(bb.x, bb.y, bb.w, bb.h);

  //           xPos += 120;
  //         });
  //         screenshot();
  //       }
  //     );

  // visualTest(
  //   "all alignments with multi-lines and wrap char",
  //   function (p5, screenshot) {
  //     const alignments = [
  //       { alignX: p5.LEFT, alignY: p5.TOP },
  //       { alignX: p5.CENTER, alignY: p5.TOP },
  //       { alignX: p5.RIGHT, alignY: p5.TOP },
  //       { alignX: p5.LEFT, alignY: p5.CENTER },
  //       { alignX: p5.CENTER, alignY: p5.CENTER },
  //       { alignX: p5.RIGHT, alignY: p5.CENTER },
  //       { alignX: p5.LEFT, alignY: p5.BOTTOM },
  //       { alignX: p5.CENTER, alignY: p5.BOTTOM },
  //       { alignX: p5.RIGHT, alignY: p5.BOTTOM },
  //     ];

  //     p5.createCanvas(300, 200);
  //     p5.textSize(20);
  //     p5.textWrap(p5.CHAR);

  //     let xPos = 20;
  //     let yPos = 20;
  //     const boxWidth = 100;
  //     const boxHeight = 60;

  //     alignments.forEach((alignment, i) => {
  //       if (i % 3 === 0 && i !== 0) {
  //         yPos += 70;
  //         xPos = 20;
  //       }

  //       p5.textAlign(alignment.alignX, alignment.alignY);

  //       p5.noFill();
  //       p5.stroke(200);
  //       p5.rect(xPos, yPos, boxWidth, boxHeight);

  //       p5.fill(0);
  //       p5.text(
  //         "A really long text that should wrap automatically as it reaches the end of the box",
  //         xPos,
  //         yPos,
  //         boxWidth,
  //         boxHeight
  //       );
  //       const bb = p5.textBounds(
  //         "A really long text that should wrap automatically as it reaches the end of the box",
  //         xPos,
  //         yPos,
  //         boxWidth,
  //         boxHeight
  //       );
  //       p5.noFill();
  //       p5.stroke("red");
  //       p5.rect(bb.x, bb.y, bb.w, bb.h);

  //       xPos += 120;
  //     });
  //     screenshot();
  //   }
  // );

  //     visualTest(
  //       "all alignments with multi-line manual text",
  //       function (p5, screenshot) {
  //         const alignments = [
  //           { alignX: p5.LEFT, alignY: p5.TOP },
  //           { alignX: p5.CENTER, alignY: p5.TOP },
  //           { alignX: p5.RIGHT, alignY: p5.TOP },
  //           { alignX: p5.LEFT, alignY: p5.CENTER },
  //           { alignX: p5.CENTER, alignY: p5.CENTER },
  //           { alignX: p5.RIGHT, alignY: p5.CENTER },
  //           { alignX: p5.LEFT, alignY: p5.BOTTOM },
  //           { alignX: p5.CENTER, alignY: p5.BOTTOM },
  //           { alignX: p5.RIGHT, alignY: p5.BOTTOM },
  //         ];

  //         p5.createCanvas(300, 200);
  //         p5.textSize(20);

  //         let xPos = 20;
  //         let yPos = 20;
  //         const boxWidth = 100;
  //         const boxHeight = 60;

  //         alignments.forEach((alignment, i) => {
  //           if (i % 3 === 0 && i !== 0) {
  //             yPos += 70;
  //             xPos = 20;
  //           }

  //           p5.textAlign(alignment.alignX, alignment.alignY);

  //           p5.noFill();
  //           p5.stroke(200);
  //           p5.rect(xPos, yPos, boxWidth, boxHeight);

  //           p5.fill(0);
  //           p5.text("Line 1\nLine 2\nLine 3", xPos, yPos, boxWidth, boxHeight);
  //           const bb = p5.textBounds(
  //             "Line 1\nLine 2\nLine 3",
  //             xPos,
  //             yPos,
  //             boxWidth,
  //             boxHeight
  //           );
  //           p5.noFill();
  //           p5.stroke("red");
  //           p5.rect(bb.x, bb.y, bb.w, bb.h);

  //           xPos += 120;
  //         });
  //         screenshot();
  //       }
  //     );
  //   });

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

// ------------

// By how much can each color channel value (0-255) differ before
// we call it a mismatch? This should be large enough to not trigger
// based on antialiasing.
const COLOR_THRESHOLD = 15;

// By how many pixels can the snapshot shift? This is
// often useful to accommodate different text rendering
// across environments.
const SHIFT_THRESHOLD = 1;

// The max side length to shrink test images down to before
// comparing, for performance.
const MAX_SIDE = 50;

// The background color to composite test cases onto before
// diffing. This is used because canvas DIFFERENCE blend mode
// does not handle alpha well. This should be a color that is
// unlikely to be in the images originally.
const BG = "#F0F";

function writeImageFile(filename, base64Data) {
  const prefix = /^data:image\/\w+;base64,/;
  writeFile(filename, base64Data.replace(prefix, ""), "base64");
}

function toBase64(img) {
  return img.canvas.toDataURL();
}

function escapeName(name) {
  // Encode slashes as `encodeURIComponent('/')`
  return name.replace(/\//g, "%2F");
}

let namePrefix = "";

/**
 * A helper to define a category of visual tests.
 *
 * @param name The name of the category of test.
 * @param callback A callback that calls `visualTest` a number of times to define
 * visual tests within this suite.
 * @param [options] An options object with optional additional settings. Set its
 * key `focus` to true to only run this test, or its `skip` key to skip it.
 */
function visualSuite(name, callback, { focus = false, skip = false } = {}) {
  let suiteFn = describe;
  if (focus) {
    suiteFn = suiteFn.only;
  }
  if (skip) {
    suiteFn = suiteFn.skip;
  }
  suiteFn(name, () => {
    let lastPrefix;
    let lastDeviceRatio = window.devicePixelRatio;
    beforeAll(() => {
      lastPrefix = namePrefix;
      namePrefix += escapeName(name) + "/";

      // Force everything to be 1x
      window.devicePixelRatio = 1;
    });

    callback();

    afterAll(() => {
      namePrefix = lastPrefix;
      window.devicePixelRatio = lastDeviceRatio;
    });
  });
}

export async function checkMatch(actual, expected, p5) {
  const scale = Math.min(MAX_SIDE / expected.width, MAX_SIDE / expected.height);

  for (const img of [actual, expected]) {
    img.resize(Math.ceil(img.width * scale), Math.ceil(img.height * scale));
  }

  const expectedWithBg = p5.createGraphics(expected.width, expected.height);
  expectedWithBg.pixelDensity(1);
  expectedWithBg.background(BG);
  expectedWithBg.image(expected, 0, 0);

  const cnv = p5.createGraphics(actual.width, actual.height);
  cnv.pixelDensity(1);
  cnv.background(BG);
  cnv.image(actual, 0, 0);
  cnv.blendMode(DIFFERENCE);
  cnv.image(expectedWithBg, 0, 0);
  for (let i = 0; i < SHIFT_THRESHOLD; i++) {
    cnv.filter(ERODE, false);
    cnv.filter(ERODE, false);
  }
  const diff = cnv.get();
  cnv.remove();
  diff.loadPixels();
  expectedWithBg.remove();

  let ok = true;
  for (let i = 0; i < diff.pixels.length; i += 4) {
    for (let off = 0; off < 3; off++) {
      if (diff.pixels[i + off] > COLOR_THRESHOLD) {
        ok = false;
        break;
      }
    }
    if (!ok) break;
  }

  return { ok, diff };
}

/**
 * A helper to define a visual test, where we will assert that a sketch matches
 * screenshots saved ahead of time of what the test should look like.
 *
 * When defining a new test, run the tests once to generate initial screenshots.
 *
 * To regenerate screenshots for a test, delete its screenshots folder in
 * the test/unit/visual/screenshots directory, and rerun the tests.
 *
 * @param testName The display name of a test. This also links the test to its
 * expected screenshot, so make sure to rename the screenshot folder after
 * renaming a test.
 * @param callback A callback to set up the test case. It takes two parameters:
 * first is `p5`, a reference to the p5 instance, and second is `screenshot`, a
 * function to grab a screenshot of the canvas. It returns either nothing, or a
 * Promise that resolves when all screenshots have been taken.
 * @param [options] An options object with optional additional settings. Set its
 * key `focus` to true to only run this test, or its `skip` key to skip it.
 */
export function visualTest(
  testName,
  callback,
  { focus = false, skip = false } = {}
) {
  let suiteFn = describe;
  if (focus) {
    suiteFn = suiteFn.only;
  }
  if (skip) {
    suiteFn = suiteFn.skip;
  }

  suiteFn(testName, function () {
    let name;
    let myp5;

    beforeAll(function () {
      name = namePrefix + escapeName(testName);
      return new Promise((res) => {
        myp5 = new p5(function (p) {
          p.setup = function () {
            res();
          };
        });
      });
    });

    afterAll(function () {
      myp5.remove();
    });

    test("matches expected screenshots", async function () {
      let expectedScreenshots;
      try {
        const metadata = JSON.parse(
          await readFile(`../screenshots/${name}/metadata.json`)
        );
        expectedScreenshots = metadata.numScreenshots;
      } catch (e) {
        console.log(e);
        expectedScreenshots = 0;
      }

      const actual = [];

      // Generate screenshots
      await callback(myp5, () => {
        const img = myp5.get();
        img.pixelDensity(1);
        actual.push(img);
      });

      if (actual.length === 0) {
        throw new Error(
          "No screenshots were generated. Check if your test generates screenshots correctly. If the test includes asynchronous operations, ensure they complete before the test ends."
        );
      }
      if (expectedScreenshots && actual.length !== expectedScreenshots) {
        throw new Error(
          `Expected ${expectedScreenshots} screenshot(s) but generated ${actual.length}`
        );
      }
      if (!expectedScreenshots) {
        await writeFile(
          `../screenshots/${name}/metadata.json`,
          JSON.stringify({ numScreenshots: actual.length }, null, 2)
        );
      }

      const expectedFilenames = actual.map(
        (_, i) => `../screenshots/${name}/${i.toString().padStart(3, "0")}.png`
      );
      const expected = expectedScreenshots
        ? await Promise.all(
            expectedFilenames.map((path) =>
              myp5.loadImage("/unit/visual" + path.slice(2))
            )
          )
        : [];

      for (let i = 0; i < actual.length; i++) {
        if (expected[i]) {
          const result = await checkMatch(actual[i], expected[i], myp5);
          if (!result.ok) {
            throw new Error(
              `Screenshots do not match! Expected:\n${toBase64(
                expected[i]
              )}\n\nReceived:\n${toBase64(actual[i])}\n\nDiff:\n${toBase64(
                result.diff
              )}\n\n` +
                "If this is unexpected, paste these URLs into your browser to inspect them.\n\n" +
                `If this change is expected, please delete the screenshots/${name} folder and run tests again to generate a new screenshot.`
            );
          }
        } else {
          writeImageFile(expectedFilenames[i], toBase64(actual[i]));
        }
      }
    });
  });
}
