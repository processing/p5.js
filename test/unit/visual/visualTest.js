import p5 from '../../../src/app.js';
import { server } from '@vitest/browser/context'
import { THRESHOLD, DIFFERENCE, ERODE } from '../../../src/core/constants.js';
const { readFile, writeFile } = server.commands
import pixelmatch from 'pixelmatch';

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

/**
 * Image Diff Algorithm for p5.js Visual Tests
 * 
 * This algorithm addresses the challenge of cross-platform rendering differences in p5.js visual tests.
 * Different operating systems and browsers render graphics with subtle variations, particularly with
 * anti-aliasing, text rendering, and sub-pixel positioning. This can cause false negatives in tests
 * when the visual differences are acceptable rendering variations rather than actual bugs.
 * 
 * Key components of the approach:
 * 
 * 1. Initial pixel-by-pixel comparison:
 *    - Uses pixelmatch to identify differences between expected and actual images
 *    - Sets a moderate threshold (0.5) to filter out minor color/intensity variations
 *    - Produces a diff image with red pixels marking differences
 * 
 * 2. Cluster identification using BFS (Breadth-First Search):
 *    - Groups connected difference pixels into clusters
 *    - Uses a queue-based BFS algorithm to find all connected pixels
 *    - Defines connectivity based on 8-way adjacency (all surrounding pixels)
 * 
 * 3. Cluster categorization by type:
 *    - Analyzes each pixel's neighborhood characteristics
 *    - Specifically identifies "line shift" clusters - differences that likely represent
 *      the same visual elements shifted by 1px due to platform rendering differences
 *    - Line shifts are identified when >80% of pixels in a cluster have ≤2 neighboring diff pixels
 * 
 * 4. Intelligent failure criteria:
 *    - Filters out clusters smaller than MIN_CLUSTER_SIZE pixels (noise reduction)
 *    - Applies different thresholds for regular differences vs. line shifts
 *    - Considers both the total number of significant pixels and number of distinct clusters
 * 
 * This approach balances the need to catch genuine visual bugs (like changes to shape geometry, 
 * colors, or positioning) while tolerating acceptable cross-platform rendering variations.
 * 
 * Parameters:
 * - MIN_CLUSTER_SIZE: Minimum size for a cluster to be considered significant (default: 4)
 * - MAX_TOTAL_DIFF_PIXELS: Maximum allowed non-line-shift difference pixels (default: 40)
 * Note: These can be adjusted for further updation
 * 
 * Note for contributors: When running tests locally, you may not see these differences as they
 * mainly appear when tests run on different operating systems or browser rendering engines.
 * However, the same code may produce slightly different renderings on CI environments, particularly
 * with text positioning, thin lines, or curved shapes. This algorithm helps distinguish between
 * these acceptable variations and actual visual bugs.
 */

export async function checkMatch(actual, expected, p5) {
  let scale = Math.min(MAX_SIDE/expected.width, MAX_SIDE/expected.height);
  const ratio = expected.width / expected.height;
  const narrow = ratio !== 1;
  if (narrow) {
    scale *= 2;
  }
  
  for (const img of [actual, expected]) {
    img.resize(
      Math.ceil(img.width * scale),
      Math.ceil(img.height * scale)
    );
  }

  // Ensure both images have the same dimensions
  const width = expected.width;
  const height = expected.height;
  
  // Create canvases with background color
  const actualCanvas = p5.createGraphics(width, height);
  const expectedCanvas = p5.createGraphics(width, height);
  actualCanvas.pixelDensity(1);
  expectedCanvas.pixelDensity(1);
  
  actualCanvas.background(BG);
  expectedCanvas.background(BG);
  
  actualCanvas.image(actual, 0, 0);
  expectedCanvas.image(expected, 0, 0);
  
  // Load pixel data
  actualCanvas.loadPixels();
  expectedCanvas.loadPixels();
  
  // Create diff output canvas
  const diffCanvas = p5.createGraphics(width, height);
  diffCanvas.pixelDensity(1);
  diffCanvas.loadPixels();
  
  // Run pixelmatch
  const diffCount = pixelmatch(
    actualCanvas.pixels,
    expectedCanvas.pixels,
    diffCanvas.pixels,
    width,
    height,
    { 
      threshold: 0.5,
      includeAA: false,
      alpha: 0.1
    }
  );
  
  // If no differences, return early
  if (diffCount === 0) {
    actualCanvas.remove();
    expectedCanvas.remove();
    diffCanvas.updatePixels();
    return { ok: true, diff: diffCanvas };
  }
  
  // Post-process to identify and filter out isolated differences
  const visited = new Set();
  const clusterSizes = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = (y * width + x) * 4;
      
      // If this is a diff pixel (red in pixelmatch output) and not yet visited
      if (
        diffCanvas.pixels[pos] === 255 && 
        diffCanvas.pixels[pos + 1] === 0 && 
        diffCanvas.pixels[pos + 2] === 0 &&
        !visited.has(pos)
      ) {
        // Find the connected cluster size using BFS
        const clusterSize = findClusterSize(diffCanvas.pixels, x, y, width, height, 1, visited);
        clusterSizes.push(clusterSize);
      }
    }
  }
  
  // Define significance thresholds
  const MIN_CLUSTER_SIZE = 4;  // Minimum pixels in a significant cluster
  const MAX_TOTAL_DIFF_PIXELS = 40;  // Maximum total different pixels

  // Determine if the differences are significant
  const nonLineShiftClusters = clusterSizes.filter(c => !c.isLineShift && c.size >= MIN_CLUSTER_SIZE);
  
  // Calculate significant differences excluding line shifts
  const significantDiffPixels = nonLineShiftClusters.reduce((sum, c) => sum + c.size, 0);

  // Update the diff canvas
  diffCanvas.updatePixels();
  
  // Clean up canvases
  actualCanvas.remove();
  expectedCanvas.remove();
  
  // Determine test result
  const ok = (
    diffCount === 0 ||  
    (
      significantDiffPixels === 0 ||  
      (
        (significantDiffPixels <= MAX_TOTAL_DIFF_PIXELS) &&  
        (nonLineShiftClusters.length <= 2)  // Not too many significant clusters
      )
    )
  );

  return { 
    ok,
    diff: diffCanvas,
    details: {
      totalDiffPixels: diffCount,
      significantDiffPixels,
      clusters: clusterSizes
    }
  };
}

/**
 * Find the size of a connected cluster of diff pixels using BFS
 */
function findClusterSize(pixels, startX, startY, width, height, radius, visited) {
  const queue = [{x: startX, y: startY}];
  let size = 0;
  const clusterPixels = [];
  
  while (queue.length > 0) {
    const {x, y} = queue.shift();
    const pos = (y * width + x) * 4;
    
    // Skip if already visited
    if (visited.has(pos)) continue;
    
    // Skip if not a diff pixel
    if (pixels[pos] !== 255 || pixels[pos + 1] !== 0 || pixels[pos + 2] !== 0) continue;
    
    // Mark as visited
    visited.add(pos);
    size++;
    clusterPixels.push({x, y});
    
    // Add neighbors to queue
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        
        // Skip if out of bounds
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        
        // Skip if already visited
        const npos = (ny * width + nx) * 4;
        if (!visited.has(npos)) {
          queue.push({x: nx, y: ny});
        }
      }
    }
  }

  let isLineShift = false;
  if (clusterPixels.length > 0) {
    // Count pixels with limited neighbors (line-like characteristic)
    let linelikePixels = 0;
    
    for (const {x, y} of clusterPixels) {
      // Count neighbors
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue; // Skip self
          
          const nx = x + dx;
          const ny = y + dy;
          
          // Skip if out of bounds
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          
          const npos = (ny * width + nx) * 4;
          // Check if neighbor is a diff pixel
          if (pixels[npos] === 255 && pixels[npos + 1] === 0 && pixels[npos + 2] === 0) {
            neighbors++;
          }
        }
      }
      
      // Line-like pixels typically have 1-2 neighbors
      if (neighbors <= 2) {
        linelikePixels++;
      }
    }
    
    // If most pixels (>80%) in the cluster have ≤2 neighbors, it's likely a line shift
    isLineShift = linelikePixels / clusterPixels.length > 0.8;
  }

  return {
    size,
    pixels: clusterPixels,
    isLineShift
  };
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
        const flatName = name.replace(/\//g, '-');
        const actualFilename = `../actual-screenshots/${flatName}-${i.toString().padStart(3, '0')}.png`;
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
        writeImageFile(actualFilename, toBase64(actual[i]));
      }
    });
  });
}
