const fs = require('fs');
const path = require('path');

async function generateVisualReport() {
  const expectedDir = path.join(process.cwd(), 'test/unit/visual/screenshots');
  const actualDir = path.join(process.cwd(), 'test/unit/visual/actual-screenshots');
  const outputFile = path.join(process.cwd(), 'test/unit/visual/visual-report.html');
  
  // Make sure the output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
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
    
    const entries = fs.readdirSync(path.join(dir, prefix), { withFileTypes: true });
    
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
        
        const test = {
          name: testDir,
          numScreenshots: metadata.numScreenshots || 0,
          screenshots: []
        };
        
        // Create flattened name for lookup
        const flattenedName = testDir.replace(/\//g, '-');
        
        // Collect all screenshots for this test
        for (let i = 0; i < test.numScreenshots; i++) {
          const screenshotName = i.toString().padStart(3, '0') + '.png';
          const expectedPath = path.join(dir, testDir, screenshotName);
          
          // Use flattened name for actual screenshots
          const actualScreenshotName = `${flattenedName}-${i.toString().padStart(3, '0')}.png`;
          const actualPath = actualScreenshotMap.get(actualScreenshotName) || null;
          
          // Use flattened name for diff image
          const diffScreenshotName = `${flattenedName}-${i.toString().padStart(3, '0')}-diff.png`;
          const diffPath = path.join(actualDir, diffScreenshotName);
          
          const hasExpected = fs.existsSync(expectedPath);
          const hasActual = actualPath && fs.existsSync(actualPath);
          const hasDiff = fs.existsSync(diffPath);
          
          const screenshot = {
            index: i,
            expectedImage: hasExpected ? imageToDataURL(expectedPath) : null,
            actualImage: hasActual ? imageToDataURL(actualPath) : null,
            diffImage: hasDiff ? imageToDataURL(diffPath) : null,
            passed: hasExpected && hasActual && !hasDiff
          };
          
          test.screenshots.push(screenshot);
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
    console.warn('No test cases found. Check if the expected directory is correct.');
  }
  
  // Count passed/failed tests and screenshots
  const totalTests = testCases.length;
  let passedTests = 0;
  let totalScreenshots = 0;
  let passedScreenshots = 0;
  
  for (const test of testCases) {
    const testPassed = test.screenshots.every(screenshot => screenshot.passed);
    if (testPassed) passedTests++;
    
    totalScreenshots += test.screenshots.length;
    passedScreenshots += test.screenshots.filter(s => s.passed).length;
  }
  
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
  </style>
</head>
<body>
  <header>
    <h1>p5.js Visual Test Results</h1>
    <div class="filters">
      <button id="show-all" class="toggle-btn active">Show All</button>
      <button id="show-failed" class="toggle-btn">Show Only Failed</button>
      <button id="show-passed" class="toggle-btn">Show Only Passed</button>
    </div>
  </header>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>
      <strong>Total Tests:</strong> ${totalTests}<br>
      <strong>Passed Tests:</strong> ${passedTests} (${totalTests > 0 ? Math.round(passedTests/totalTests*100) : 0}%)<br>
      <strong>Failed Tests:</strong> ${totalTests - passedTests} (${totalTests > 0 ? Math.round((totalTests-passedTests)/totalTests*100) : 0}%)<br>
      <strong>Total Screenshots:</strong> ${totalScreenshots}<br>
      <strong>Passed Screenshots:</strong> ${passedScreenshots} (${totalScreenshots > 0 ? Math.round(passedScreenshots/totalScreenshots*100) : 0}%)<br>
      <strong>Report Generated:</strong> ${new Date().toLocaleString()}
    </p>
  </div>
  
  <div id="test-results">
    ${testCases.map(test => {
      const passed = test.screenshots.every(s => s.passed);
      return `
        <div class="test-group ${passed ? 'test-passed' : 'test-failed'}">
          <div class="test-header">
            <span>${test.name}</span>
            <span class="test-status ${passed ? 'status-pass' : 'status-fail'}">${passed ? 'PASS' : 'FAIL'}</span>
          </div>
          <div class="screenshots">
            ${test.screenshots.map(screenshot => `
              <div class="screenshot-set">
                <div class="screenshot-header">
                  <span>Screenshot #${screenshot.index + 1}</span>
                  <span class="screenshot-status ${screenshot.passed ? 'status-pass' : 'status-fail'}">
                    ${screenshot.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <div class="screenshot-images">
                  <div class="image-container">
                    <div class="image-header">Expected</div>
                    ${screenshot.expectedImage ? 
                      `<img src="${screenshot.expectedImage}" alt="Expected Result">` : 
                      `<div class="missing-notice">No expected image found</div>`}
                  </div>
                  <div class="image-container">
                    <div class="image-header">Actual</div>
                    ${screenshot.actualImage ? 
                      `<img src="${screenshot.actualImage}" alt="Actual Result">` : 
                      `<div class="missing-notice">No actual image found</div>`}
                  </div>
                  ${screenshot.diffImage ? `
                    <div class="image-container">
                      <div class="image-header">Diff</div>
                      <img src="${screenshot.diffImage}" alt="Difference">
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}
  </div>
  
  <script>
    // Filter functionality
    const buttons = document.querySelectorAll('.toggle-btn');
    const testGroups = document.querySelectorAll('.test-group');
    
    document.getElementById('show-all').addEventListener('click', function() {
      testGroups.forEach(el => {
        el.style.display = 'block';
      });
      setActiveButton(this);
    });
    
    document.getElementById('show-failed').addEventListener('click', function() {
      testGroups.forEach(el => {
        el.style.display = el.classList.contains('test-failed') ? 'block' : 'none';
      });
      setActiveButton(this);
    });
    
    document.getElementById('show-passed').addEventListener('click', function() {
      testGroups.forEach(el => {
        el.style.display = el.classList.contains('test-passed') ? 'block' : 'none';
      });
      setActiveButton(this);
    });
    
    function setActiveButton(activeButton) {
      buttons.forEach(button => {
        button.classList.remove('active');
      });
      activeButton.classList.add('active');
    }
  </script>
</body>
</html>
  `;
  
  // Write HTML to file
  fs.writeFileSync(outputFile, html);
  console.log(`Visual test report generated: ${outputFile}`);
  
  return {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    totalScreenshots,
    passedScreenshots,
    failedScreenshots: totalScreenshots - passedScreenshots,
    reportPath: outputFile
  };
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateVisualReport().catch(error => {
    console.error('Failed to generate report:', error);
    process.exit(1);
  });
}

module.exports = { generateVisualReport };