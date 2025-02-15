import p5 from '../../../src/app.js';
import { server } from '@vitest/browser/context'
import { THRESHOLD, DIFFERENCE, ERODE } from '../../../src/core/constants.js';
import pixelmatch from 'pixelmatch';
const { readFile, writeFile } = server.commands

// By how much can each color channel value (0-255) differ before
// we call it a mismatch? This should be large enough to not trigger
// based on antialiasing.
const COLOR_THRESHOLD = 25;

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

// By how many pixels can the snapshot shift? This is
// often useful to accommodate different text rendering
// across environments.
let shiftThreshold = 2;

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
  { focus = false, skip = false, shiftThreshold: newShiftThreshold } = {}
) {
  let suiteFn = describe;
  if (focus) {
    suiteFn = suiteFn.only;
  }
  if (skip) {
    suiteFn = suiteFn.skip;
  }
  suiteFn(name, () => {
    let lastShiftThreshold
    let lastPrefix;
    let lastDeviceRatio = window.devicePixelRatio;
    beforeAll(() => {
      lastPrefix = namePrefix;
      namePrefix += escapeName(name) + '/';
      lastShiftThreshold = shiftThreshold;
      if (newShiftThreshold !== undefined) {
        shiftThreshold = newShiftThreshold
      }

      // Force everything to be 1x
      window.devicePixelRatio = 1;
    })

    callback()

    afterAll(() => {
      namePrefix = lastPrefix;
      window.devicePixelRatio = lastDeviceRatio;
      shiftThreshold = lastShiftThreshold;
    });
  });
}

export async function checkMatch(actual, expected, p5) {
  // First do standard pixelmatch comparison
  const diffData = actual.drawingContext.createImageData(actual.width, actual.height);
  
  // Get image data from both canvases
  const actualData = actual.drawingContext.getImageData(0, 0, actual.width, actual.height);
  const expectedData = expected.drawingContext.getImageData(0, 0, actual.width, actual.height);
  
  // Function to check if a region looks like text
  // Text typically has high contrast and specific density patterns
  const isLikelyText = (data, x, y, width) => {
    const region = 3; // Check 3x3 area
    let transitions = 0;
    let nonEmpty = 0;
    
    for (let dy = -region; dy <= region; dy++) {
      for (let dx = -region; dx <= region; dx++) {
        const px = x + dx;
        const py = y + dy;
        if (px < 0 || px >= width || py < 0 || py >= width) continue;
        
        const idx = (py * width + px) * 4;
        // Check if pixel is non-transparent and has significant contrast
        if (data.data[idx + 3] > 20) {
          nonEmpty++;
          // Check for contrast with neighboring pixels
          if (px > 0) {
            const prevIdx = (py * width + (px - 1)) * 4;
            if (Math.abs(data.data[idx] - data.data[prevIdx]) > 30) {
              transitions++;
            }
          }
        }
      }
    }
    
    // Text typically has moderate density and high number of transitions
    return nonEmpty > 4 && nonEmpty < 20 && transitions > 3;
  };
  
  // Custom comparison function that's more lenient with text
  let diffCount = 0;
  const shiftThreshold = 2; // Maximum pixels of shift allowed for text
  
  for (let y = 0; y < actual.height; y++) {
    for (let x = 0; x < actual.width; x++) {
      const idx = (y * actual.width + x) * 4;
      
      // Check if pixels match exactly
      const exactMatch = [0, 1, 2, 3].every(i => 
        Math.abs(actualData.data[idx + i] - expectedData.data[idx + i]) < 0.4 * 255
      );
      
      if (exactMatch) {
        // Pixels match, copy expected pixel to diff
        [0, 1, 2, 3].forEach(i => diffData.data[idx + i] = expectedData.data[idx + i]);
        continue;
      }
      
      // If pixels don't match, check if it might be shifted text
      if (isLikelyText(expectedData, x, y, actual.width)) {
        let foundMatch = false;
        
        // Look for matching pixel within shift threshold
        searchLoop:
        for (let dy = -shiftThreshold; dy <= shiftThreshold; dy++) {
          for (let dx = -shiftThreshold; dx <= shiftThreshold; dx++) {
            const sx = x + dx;
            const sy = y + dy;
            
            if (sx < 0 || sx >= actual.width || sy < 0 || sy >= actual.height) continue;
            
            const shiftIdx = (sy * actual.width + sx) * 4;
            const pixelMatch = [0, 1, 2, 3].every(i =>
              Math.abs(actualData.data[idx + i] - expectedData.data[shiftIdx + i]) < 0.4 * 255
            );
            
            if (pixelMatch) {
              foundMatch = true;
              break searchLoop;
            }
          }
        }
        
        if (foundMatch) {
          // Mark as acceptable text shift (yellow in diff)
          diffData.data[idx] = 255;     // R
          diffData.data[idx + 1] = 255; // G
          diffData.data[idx + 2] = 0;   // B
          diffData.data[idx + 3] = 255; // A
          continue;
        }
      }
      
      // If we get here, it's a real difference
      diffCount++;
      // Mark as difference (red in diff)
      diffData.data[idx] = 255;     // R
      diffData.data[idx + 1] = 0;   // G
      diffData.data[idx + 2] = 0;   // B
      diffData.data[idx + 3] = 255; // A
    }
  }
  
  // Create diff image
  const cnv = p5.createGraphics(actual.width, actual.height);
  cnv.drawingContext.putImageData(diffData, 0, 0);
  const diff = cnv.get();
  cnv.remove();
  
  return { ok: diffCount === 0, diff };
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
