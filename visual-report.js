import fs from 'fs';
import path from 'path';
const SLASH_REGEX = /\//g;

// `notRun` means vitest never reported on the test at all, e.g. because it
// belongs to a project this CI job did not run.
const PASSED = 'passed';
const FAILED = 'failed';
const SKIPPED = 'skipped';
const NOT_RUN = 'notRun';
// Screenshot-only: the test failed before capturing this screenshot.
const NOT_CAPTURED = 'notCaptured';

// The assertion `visualTest()` registers inside each test's describe block.
const VISUAL_TEST_ASSERTION = 'matches expected screenshots';

const VITEST_STATUS = {
  passed: PASSED,
  failed: FAILED,
  skipped: SKIPPED,
  pending: SKIPPED,
  todo: SKIPPED,
  disabled: SKIPPED
};

const STATUS_LABEL = {
  [PASSED]: 'PASS',
  [FAILED]: 'FAIL',
  [SKIPPED]: 'SKIPPED',
  [NOT_RUN]: 'NOT RUN',
  [NOT_CAPTURED]: 'NOT CAPTURED'
};

const STATUS_CLASS = {
  [PASSED]: 'status-pass',
  [FAILED]: 'status-fail',
  [SKIPPED]: 'status-skip',
  [NOT_RUN]: 'status-not-run',
  [NOT_CAPTURED]: 'status-not-run'
};

// Mirrors `escapeName()` in test/unit/visual/visualTest.js, which turns suite
// names into the directory names under screenshots/.
function escapeName(name) {
  return name.replace(SLASH_REGEX, '%2F');
}

function percent(value, total) {
  if (total <= 0) return '0';
  const exact = (value / total) * 100;
  const rounded = Math.round(exact);
  // Don't let rounding read as a clean 0% or 100% when it isn't one.
  if ((rounded === 0 && value > 0) || (rounded === 100 && value < total)) {
    return exact.toFixed(1);
  }
  return String(rounded);
}

function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Failure messages embed base64 data URLs of the images, which would balloon
// the report, so keep just the headline.
function summarizeFailure(messages) {
  if (!messages || messages.length === 0) return null;
  const firstLine = String(messages[0]).split('\n')[0].trim();
  if (!firstLine) return null;
  return firstLine.length > 300 ? `${firstLine.slice(0, 300)}…` : firstLine;
}

/**
 * Read vitest's json reporter output, keyed by the screenshot directory each
 * test corresponds to. Returns null if there are no usable results.
 */
function loadTestResults(resultsFile) {
  if (!fs.existsSync(resultsFile)) {
    console.warn(
      `No vitest results found at ${resultsFile}. Falling back to inferring ` +
        'test results from the screenshots on disk, which cannot tell a failed ' +
        'test apart from one that never ran.'
    );
    return null;
  }

  let report;
  try {
    report = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  } catch (error) {
    console.error(`Failed to read vitest results: ${resultsFile}`, error);
    return null;
  }

  const results = new Map();
  for (const fileResult of report.testResults || []) {
    for (const assertion of fileResult.assertionResults || []) {
      if (assertion.title !== VISUAL_TEST_ASSERTION) continue;

      const ancestors = assertion.ancestorTitles || [];
      if (ancestors.length === 0) continue;

      // `visualTest()` saves screenshots under the escaped suite path.
      const name = ancestors.map(escapeName).join('/');
      const status = VITEST_STATUS[assertion.status] || SKIPPED;

      // A test is reported once per project it runs in; a failure anywhere wins.
      const existing = results.get(name);
      if (existing && (existing.status === FAILED || status !== FAILED)) {
        continue;
      }

      results.set(name, {
        status,
        failure: summarizeFailure(assertion.failureMessages)
      });
    }
  }

  console.log(
    `Loaded ${results.size} visual test result(s) from ${resultsFile}`
  );
  return results;
}

async function generateVisualReport() {
  const expectedDir = path.join(process.cwd(), 'test/unit/visual/screenshots');
  const actualDir = path.join(
    process.cwd(),
    'test/unit/visual/actual-screenshots'
  );
  const resultsFile =
    process.env.VISUAL_TEST_RESULTS ||
    path.join(process.cwd(), 'test/unit/visual/test-results.json');
  const outputFile = path.join(
    process.cwd(),
    'test/unit/visual/visual-report.html'
  );

  // Make sure the output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const testResults = loadTestResults(resultsFile);

  // Function to read image file and convert to data URL
  function imageToDataURL(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      const base64 = data.toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error(`Failed to read image: ${filePath}`, error);
      return null;
    }
  }

  // Create a lookup map for actual screenshots
  function createActualScreenshotMap() {
    const actualMap = new Map();
    if (!fs.existsSync(actualDir)) {
      console.warn(`Actual screenshots directory does not exist: ${actualDir}`);
      return actualMap;
    }

    const files = fs.readdirSync(actualDir);
    for (const file of files) {
      if (file.endsWith('.png') && !file.endsWith('-diff.png')) {
        actualMap.set(file, path.join(actualDir, file));
      }
    }

    return actualMap;
  }

  const actualScreenshotMap = createActualScreenshotMap();

  // Recursively find all test cases
  function findTestCases(dir, prefix = '') {
    const testCases = [];

    if (!fs.existsSync(path.join(dir, prefix))) {
      console.warn(`Directory does not exist: ${path.join(dir, prefix)}`);
      return testCases;
    }

    const entries = fs.readdirSync(path.join(dir, prefix), {
      withFileTypes: true
    });

    for (const entry of entries) {
      const fullPath = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        testCases.push(...findTestCases(dir, fullPath));
      } else if (entry.name === 'metadata.json') {
        // Found a test case
        const metadataPath = path.join(dir, fullPath);
        let metadata;

        try {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        } catch (error) {
          console.error(`Failed to read metadata: ${metadataPath}`, error);
          continue;
        }

        const testDir = path.dirname(fullPath);
        // The test names vitest reports always use forward slashes.
        const testName = testDir.split(path.sep).join('/');

        // When vitest results exist they are the source of truth: a test they
        // never mention never ran. Otherwise fall back to inferring from disk.
        const result = testResults ? testResults.get(testName) : null;
        const reportedStatus = testResults
          ? result
            ? result.status
            : NOT_RUN
          : null;

        const test = {
          name: testName,
          numScreenshots: metadata.numScreenshots || 0,
          status: reportedStatus,
          failure: result ? result.failure : null,
          screenshots: []
        };

        // Create flattened name for lookup
        const flattenedName = testName.replace(SLASH_REGEX, '-');

        // Collect all screenshots for this test
        for (let i = 0; i < test.numScreenshots; i++) {
          const screenshotName = i.toString().padStart(3, '0') + '.png';
          const expectedPath = path.join(dir, testDir, screenshotName);

          // Use flattened name for actual screenshots
          const actualScreenshotName = `${flattenedName}-${i.toString().padStart(3, '0')}.png`;
          const actualPath =
            actualScreenshotMap.get(actualScreenshotName) || null;

          // Use flattened name for diff image
          const diffScreenshotName = `${flattenedName}-${i.toString().padStart(3, '0')}-diff.png`;
          const diffPath = path.join(actualDir, diffScreenshotName);

          const hasExpected = fs.existsSync(expectedPath);
          const hasActual = actualPath && fs.existsSync(actualPath);
          const hasDiff = fs.existsSync(diffPath);

          let status;
          if (reportedStatus === null) {
            // No vitest results: the old disk-only heuristic.
            status = hasExpected && hasActual && !hasDiff ? PASSED : FAILED;
          } else if (
            reportedStatus === SKIPPED ||
            reportedStatus === NOT_RUN ||
            reportedStatus === PASSED
          ) {
            status = reportedStatus;
          } else if (hasDiff) {
            status = FAILED;
          } else if (hasExpected && hasActual) {
            // Another screenshot in the same test is what failed.
            status = PASSED;
          } else if (!hasActual) {
            // The test bailed out before getting this far.
            status = NOT_CAPTURED;
          } else {
            status = FAILED;
          }

          const screenshot = {
            index: i,
            expectedImage: hasExpected ? imageToDataURL(expectedPath) : null,
            actualImage: hasActual ? imageToDataURL(actualPath) : null,
            diffImage: hasDiff ? imageToDataURL(diffPath) : null,
            status,
            passed: status === PASSED
          };

          test.screenshots.push(screenshot);
        }

        if (test.status === null) {
          test.status = test.screenshots.every(s => s.status === PASSED)
            ? PASSED
            : FAILED;
        }

        // Don't add tests with no screenshots
        if (test.screenshots.length > 0) {
          testCases.push(test);
        }
      }
    }

    return testCases;
  }

  // Find all test cases from the expected directory
  const testCases = findTestCases(expectedDir);

  if (testCases.length === 0) {
    console.warn(
      'No test cases found. Check if the expected directory is correct.'
    );
  }

  // Count tests and screenshots per status
  const totalTests = testCases.length;
  const tests = { passed: 0, failed: 0, skipped: 0, notRun: 0 };
  const screenshots = {
    passed: 0,
    failed: 0,
    notCaptured: 0,
    skipped: 0,
    notRun: 0
  };
  let totalScreenshots = 0;

  for (const test of testCases) {
    tests[test.status]++;

    totalScreenshots += test.screenshots.length;
    for (const screenshot of test.screenshots) {
      screenshots[screenshot.status]++;
    }
  }

  // Percentages only make sense against the tests that actually ran.
  const executedTests = tests.passed + tests.failed;
  const executedScreenshots =
    screenshots.passed + screenshots.failed + screenshots.notCaptured;

  const fallbackNotice = testResults
    ? ''
    : `<div class="warning-notice">
        No vitest results were found at <code>${escapeHTML(path.relative(process.cwd(), resultsFile))}</code>,
        so statuses below were inferred from the screenshots on disk. Tests that
        were skipped or never ran are indistinguishable from failures in this mode.
        Run the tests with <code>--reporter=json --outputFile.json=test/unit/visual/test-results.json</code>
        to get accurate results.
      </div>`;

  // Generate HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>p5.js Visual Test Results</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      margin-bottom: 30px;
    }
    
    .summary {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    
    .summary h2 {
      margin-top: 0;
    }
    
    .test-group {
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 30px;
      overflow: hidden;
    }
    
    .test-header {
      background-color: #f5f5f5;
      padding: 10px 15px;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .test-status {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 14px;
      font-weight: normal;
    }
    
    .status-pass {
      background-color: #dff0d8;
      color: #3c763d;
    }
    
    .status-fail {
      background-color: #f2dede;
      color: #a94442;
    }
    
    .status-skip {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .status-not-run {
      background-color: #e9ecef;
      color: #555;
    }
    
    .failure-message {
      padding: 10px 15px;
      background-color: #f2dede;
      color: #a94442;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 13px;
      border-bottom: 1px solid #ddd;
    }
    
    .screenshots {
      padding: 20px;
    }
    
    .screenshot-set {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      position: relative;
    }
    
    .screenshot-set:last-child {
      margin-bottom: 0;
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .screenshot-header {
      margin-bottom: 15px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .screenshot-status {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 14px;
    }
    
    .screenshot-images {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .image-container {
      flex: 1;
      min-width: 300px;
    }
    
    .image-header {
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    img {
      max-width: 100%;
      border: 1px solid #ddd;
      background-color: #f8f8f8;
    }
    
    .toggle-btn {
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      margin-right: 5px;
    }
    
    .toggle-btn.active {
      background-color: #e9ecef;
      font-weight: bold;
    }
    
    .hidden {
      display: none;
    }
    
    .filters {
      margin-bottom: 20px;
    }
    
    .missing-notice {
      padding: 10px;
      background-color: #fff3cd;
      color: #856404;
      border-radius: 4px;
      margin-top: 5px;
    }
    
    .warning-notice {
      padding: 10px 15px;
      background-color: #fff3cd;
      color: #856404;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <header>
    <h1>p5.js Visual Test Results</h1>
    <div class="filters">
      <button class="toggle-btn active" data-filter="all">Show All</button>
      <button class="toggle-btn" data-filter="failed">Show Only Failed</button>
      <button class="toggle-btn" data-filter="passed">Show Only Passed</button>
      <button class="toggle-btn" data-filter="skipped">Show Only Skipped</button>
      <button class="toggle-btn" data-filter="notRun">Show Only Not Run</button>
    </div>
  </header>
  
  ${fallbackNotice}
  
  <div class="summary">
    <h2>Summary</h2>
    <p>
      <strong>Total Tests:</strong> ${totalTests}<br>
      <strong>Tests Run:</strong> ${executedTests}<br>
      <strong>Passed Tests:</strong> ${tests.passed} (${percent(tests.passed, executedTests)}% of tests run)<br>
      <strong>Failed Tests:</strong> ${tests.failed} (${percent(tests.failed, executedTests)}% of tests run)<br>
      <strong>Skipped Tests:</strong> ${tests.skipped}<br>
      <strong>Tests Not Run:</strong> ${tests.notRun}<br>
      <br>
      <strong>Total Screenshots:</strong> ${totalScreenshots}<br>
      <strong>Passed Screenshots:</strong> ${screenshots.passed} (${percent(screenshots.passed, executedScreenshots)}% of screenshots compared)<br>
      <strong>Failed Screenshots:</strong> ${screenshots.failed} (${percent(screenshots.failed, executedScreenshots)}% of screenshots compared)<br>
      <strong>Screenshots Not Captured:</strong> ${screenshots.notCaptured}<br>
      <strong>Skipped Screenshots:</strong> ${screenshots.skipped}<br>
      <strong>Screenshots Not Run:</strong> ${screenshots.notRun}<br>
      <br>
      <strong>Report Generated:</strong> ${new Date().toLocaleString()}
    </p>
  </div>
  
  <div id="test-results">
    ${testCases
      .map(
        test => `
        <div class="test-group" data-status="${test.status}">
          <div class="test-header">
            <span>${escapeHTML(test.name)}</span>
            <span class="test-status ${STATUS_CLASS[test.status]}">${STATUS_LABEL[test.status]}</span>
          </div>
          ${
            test.failure
              ? `<div class="failure-message">${escapeHTML(test.failure)}</div>`
              : ''
          }
          <div class="screenshots">
            ${test.screenshots
              .map(
                screenshot => `
              <div class="screenshot-set">
                <div class="screenshot-header">
                  <span>Screenshot #${screenshot.index + 1}</span>
                  <span class="screenshot-status ${STATUS_CLASS[screenshot.status]}">
                    ${STATUS_LABEL[screenshot.status]}
                  </span>
                </div>
                <div class="screenshot-images">
                  <div class="image-container">
                    <div class="image-header">Expected</div>
                    ${
                      screenshot.expectedImage
                        ? `<img src="${screenshot.expectedImage}" alt="Expected Result">`
                        : `<div class="missing-notice">No expected image found</div>`
                    }
                  </div>
                  <div class="image-container">
                    <div class="image-header">Actual</div>
                    ${
                      screenshot.actualImage
                        ? `<img src="${screenshot.actualImage}" alt="Actual Result">`
                        : `<div class="missing-notice">No actual image found</div>`
                    }
                  </div>
                  ${
                    screenshot.diffImage
                      ? `
                    <div class="image-container">
                      <div class="image-header">Diff</div>
                      <img src="${screenshot.diffImage}" alt="Difference">
                    </div>
                  `
                      : ''
                  }
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('')}
  </div>
  
  <script>
    // Filter functionality
    const buttons = document.querySelectorAll('.toggle-btn');
    const testGroups = document.querySelectorAll('.test-group');
    
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.dataset.filter;
        testGroups.forEach(el => {
          el.style.display =
            filter === 'all' || el.dataset.status === filter ? 'block' : 'none';
        });
        buttons.forEach(other => other.classList.remove('active'));
        this.classList.add('active');
      });
    });
  </script>
</body>
</html>
  `;

  // Write HTML to file
  fs.writeFileSync(outputFile, html);
  console.log(`Visual test report generated: ${outputFile}`);
  console.log(
    `${tests.passed} passed, ${tests.failed} failed, ${tests.skipped} skipped, ` +
      `${tests.notRun} not run (of ${totalTests} total)`
  );

  return {
    totalTests,
    executedTests,
    passedTests: tests.passed,
    failedTests: tests.failed,
    skippedTests: tests.skipped,
    notRunTests: tests.notRun,
    totalScreenshots,
    executedScreenshots,
    passedScreenshots: screenshots.passed,
    failedScreenshots: screenshots.failed,
    notCapturedScreenshots: screenshots.notCaptured,
    skippedScreenshots: screenshots.skipped,
    notRunScreenshots: screenshots.notRun,
    usedTestResults: testResults !== null,
    reportPath: outputFile
  };
}

// Run the function if this script is executed directly
if (import.meta.main === true) {
  generateVisualReport().catch(error => {
    console.error('Failed to generate report:', error);
    process.exit(1);
  });
}

export { generateVisualReport };
