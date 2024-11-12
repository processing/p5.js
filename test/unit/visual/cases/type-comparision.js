import { visualSuite, visualTest } from "../visualTest";
import { server } from "@vitest/browser/context";
const { readFile, readdir } = server.commands;

const combinedTests = {
  textFont: ["with the default font", "with the default monospace font"],
  //   textAlign: [
  //     "all alignments with single word",
  //     "all alignments with single line",
  //     "all alignments with multi-lines and wrap word",
  //     "all alignments with multi-lines and wrap char",
  //     "all alignments with multi-line manual text",
  //   ],
  textStyle: ["all text styles"],
  textSize: ["text sizes comparison"],
  textLeading: ["text leading with different values"],
  textWidth: ["verify width of a string"],
};

visualSuite("Type Comparison", function () {
  Object.keys(combinedTests).forEach((suite) => {
    visualSuite(suite, function () {
      combinedTests[suite].forEach((testName) => {
        visualTest(`compare ${testName}`, async function (p5, screenshot) {
          try {
            const v1Path = `/unit/visual/screenshots/Type.v1/${suite}/${testName}/000.png`;
            const v2Path = `/unit/visual/screenshots/Type.v2/${suite}/${testName}/000.png`;

            const v1Image = await p5.loadImage(v1Path);
            const v2Image = await p5.loadImage(v2Path);

            const totalWidth = v1Image.width + v2Image.width + 1;
            const maxHeight = Math.max(v1Image.height, v2Image.height);

            p5.createCanvas(totalWidth, maxHeight);
            p5.background(255);

            p5.image(v1Image, 0, 0);
            p5.stroke("red");
            p5.line(v1Image.width, 0, v1Image.width, maxHeight);
            p5.image(v2Image, v1Image.width + 1, 0);

            screenshot();
          } catch (err) {
            console.error(`Error comparing ${suite}/${testName}:`, err);
            throw err;
          }
        });
      });
    });
  });
});
