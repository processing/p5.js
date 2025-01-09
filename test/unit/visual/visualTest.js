import p5 from '../../../src/app.js';
import { server } from '@vitest/browser/context'
import { THRESHOLD, DIFFERENCE, ERODE } from '../../../src/core/constants.js';
const { readFile, writeFile } = server.commands

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
const BG = '#F0F';

function writeImageFile(filename, base64Data) {
  const prefix = /^data:image\/\w+;base64,/;
  writeFile(filename, base64Data.replace(prefix, ''), 'base64');
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
export function visualSuite(
  name,
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
  suiteFn(name, () => {
    let lastPrefix;
    let lastDeviceRatio = window.devicePixelRatio;
    beforeAll(() => {
      lastPrefix = namePrefix;
      namePrefix += escapeName(name) + '/';

      // Force everything to be 1x
      window.devicePixelRatio = 1;
    })

    callback()

    afterAll(() => {
      namePrefix = lastPrefix;
      window.devicePixelRatio = lastDeviceRatio;
    });
  });
}

export async function checkMatch(actual, expected, p5) {
  let scale = Math.min(MAX_SIDE/expected.width, MAX_SIDE/expected.height);

  // Long screenshots end up super tiny when fit to a small square, so we
  // can double the max side length for these
  const ratio = expected.width / expected.height;
  const narrow = ratio < 0.5 || ratio > 2;
  if (narrow) {
    scale *= 2;
  }

  for (const img of [actual, expected]) {
    img.resize(
      Math.ceil(img.width * scale),
      Math.ceil(img.height * scale)
    );
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
      if (diff.pixels[i+off] > COLOR_THRESHOLD) {
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

  suiteFn(testName, function() {
    let name;
    let myp5;

    beforeAll(function() {
      name = namePrefix + escapeName(testName);
      return new Promise(res => {
        myp5 = new p5(function(p) {
          p.setup = function() {
            res();
          };
        });
      });
    });

    afterAll(function() {
      myp5.remove();
    });

    test('matches expected screenshots', async function() {
      let expectedScreenshots;
      try {
        const metadata = JSON.parse(await readFile(
          `../screenshots/${name}/metadata.json`
        ));
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
        throw new Error('No screenshots were generated. Check if your test generates screenshots correctly. If the test includes asynchronous operations, ensure they complete before the test ends.');
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
        (_, i) => `../screenshots/${name}/${i.toString().padStart(3, '0')}.png`
      );
      const expected = expectedScreenshots
        ? (
          await Promise.all(
            expectedFilenames.map(path => myp5.loadImage('/unit/visual' + path.slice(2)))
          )
        )
        : [];

      for (let i = 0; i < actual.length; i++) {
        if (expected[i]) {
          const result = await checkMatch(actual[i], expected[i], myp5);
          if (!result.ok) {
            throw new Error(
              `Screenshots do not match! Expected:\n${toBase64(expected[i])}\n\nReceived:\n${toBase64(actual[i])}\n\nDiff:\n${toBase64(result.diff)}\n\n` +
              'If this is unexpected, paste these URLs into your browser to inspect them.\n\n' +
              `If this change is expected, please delete the screenshots/${name} folder and run tests again to generate a new screenshot.`,
            );
          }
        } else {
          writeImageFile(expectedFilenames[i], toBase64(actual[i]));
        }
      }
    });
  });
}
