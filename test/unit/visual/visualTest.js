/**
 * A helper class to contain an error and also the screenshot data that
 * caused the error.
 */
class ScreenshotError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.actual = actual;
    this.expected = expected;
  }
}

function toBase64(img) {
  return img.canvas.toDataURL();
}

function escapeName(name) {
  // Encode slashes as `encodeURIComponent('/')`
  return name.replace(/\//g, '%2F');
}

let namePrefix = '';

/**
 * A helper to define a category of visual tests.
 *
 * @param name The name of the category of test.
 * @param callback A callback that calls `visualTest` a number of times to define
 * visual tests within this suite.
 * @param [options] An options object with optional additional settings. Set its
 * key `focus` to true to only run this test, or its `skip` key to skip it.
 */
window.visualSuite = function(
  name,
  callback,
  { focus = false, skip = false } = {}
) {
  const lastPrefix = namePrefix;
  namePrefix += escapeName(name) + '/';

  let suiteFn = suite;
  if (focus) {
    suiteFn = suiteFn.only;
  }
  if (skip) {
    suiteFn = suiteFn.skip;
  }
  suiteFn(name, callback);

  namePrefix = lastPrefix;
};

window.checkMatch = function(actual, expected, p5) {
  const maxSide = 50;
  const scale = Math.min(maxSide/expected.width, maxSide/expected.height);
  for (const img of [actual, expected]) {
    img.resize(
      Math.ceil(img.width * scale),
      Math.ceil(img.height * scale)
    );
  }
  const diff = p5.createImage(actual.width, actual.height);
  diff.drawingContext.drawImage(actual.canvas, 0, 0);
  diff.drawingContext.globalCompositeOperation = 'difference';
  diff.drawingContext.drawImage(expected.canvas, 0, 0);
  diff.filter(p5.ERODE, false);
  diff.loadPixels();

  let ok = true;
  for (let i = 0; i < diff.pixels.length; i++) {
    if (i % 4 === 3) continue; // Skip alpha checks
    if (Math.abs(diff.pixels[i]) > 10) {
      ok = false;
      break;
    }
  }
  return { ok, diff };
};

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
window.visualTest = function(
  testName,
  callback,
  { focus = false, skip = false } = {}
) {
  const name = namePrefix + escapeName(testName);
  let suiteFn = suite;
  if (focus) {
    suiteFn = suiteFn.only;
  }
  if (skip) {
    suiteFn = suiteFn.skip;
  }

  suiteFn(testName, function() {
    let myp5;

    setup(function() {
      return new Promise(res => {
        myp5 = new p5(function(p) {
          p.setup = function() {
            res();
          };
        });
      });
    });

    teardown(function() {
      myp5.remove();
    });

    test('matches expected screenshots', async function() {
      let expectedScreenshots;
      try {
        metadata = await fetch(
          `unit/visual/screenshots/${name}/metadata.json`
        ).then(res => res.json());
        expectedScreenshots = metadata.numScreenshots;
      } catch (e) {
        expectedScreenshots = 0;
      }

      if (!window.shouldGenerateScreenshots && !expectedScreenshots) {
        // If running on CI, all expected screenshots should already
        // be generated
        throw new Error('No expected screenshots found');
      }

      const actual = [];

      // Generate screenshots
      await callback(myp5, () => {
        actual.push(myp5.get());
      });


      if (actual.length === 0) {
        throw new Error('No screenshots were generated. Check if your test generates screenshots correctly. If the test includes asynchronous operations, ensure they complete before the test ends.');
      }
      if (expectedScreenshots && actual.length !== expectedScreenshots) {
        throw new Error(
          `Expected ${expectedScreenshots} screenshot(s) but generated ${actual.length}`
        );
      }
      if (!expectedScreenshots) {
        writeTextFile(
          `unit/visual/screenshots/${name}/metadata.json`,
          JSON.stringify({ numScreenshots: actual.length }, null, 2)
        );
      }

      const expectedFilenames = actual.map(
        (_, i) => `unit/visual/screenshots/${name}/${i.toString().padStart(3, '0')}.png`
      );
      const expected = expectedScreenshots
        ? (
          await Promise.all(
            expectedFilenames.map(path => new Promise((resolve, reject) => {
              myp5.loadImage(path, resolve, reject);
            }))
          )
        )
        : [];

      for (let i = 0; i < actual.length; i++) {
        if (expected[i]) {
          if (!checkMatch(actual[i], expected[i], myp5).ok) {
            throw new ScreenshotError(
              `Screenshots do not match! Expected:\n${toBase64(expected[i])}\n\nReceived:\n${toBase64(actual[i])}\n\n` +
              'If this is unexpected, paste these URLs into your browser to inspect them, or run grunt yui:dev and go to http://127.0.0.1:9001/test/visual.html.\n\n' +
              `If this change is expected, please delete the test/unit/visual/screenshots/${name} folder and run tests again to generate a new screenshot.`,
              actual[i],
              expected[i]
            );
          }
        } else {
          writeImageFile(expectedFilenames[i], toBase64(actual[i]));
        }
      }
    });
  });
};
