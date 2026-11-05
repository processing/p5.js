// Ensure these tests do not drift too far from ../typography.bench.js

const fontFile = "../../../test/manual-test-examples/type/font/LiberationSans-Bold.ttf";

const strs = {
  single: "Performance",
  ten: "Performance testing 10 words at a time is exhaustive! Right?",
  paragraph: Array.from({ length: 10 }, (_, i) =>
    `${i === 0 ? "\t": ""}Performance is vital in all aspects of text rendering, even 10 lines at a time. This is line ${i + 1} of 10.`
  ).join("\n") // This will hit around 15fps, 21275 points
};

// Parameterizing test cases by function ensures consistency in test parameters across all renderers.
const TO_POINTS_CASES = [
  {label: "textToPoints() single word", str: strs.single, textSize: 20, sampleFactor: 0.5, points: 317, variance: 5, render: false},
  {label: "textToPoints() single word, 150pt", str: strs.single, textSize: 150, sampleFactor: 0.5, points: 2336, variance: 50, render: false},
  {label: "textToPoints() single word, with render", str: strs.single, textSize: 20, sampleFactor: 0.5, points: 317, variance: 5, render: true},
  {label: "textToPoints() 10 words", str: strs.ten, textSize: 20, sampleFactor: 0.5, points: 1453, variance: 5, render: false},
  {label: "textToPoints() paragraph", str: strs.paragraph, textSize: 20, sampleFactor: 0.5, points: 21275, variance: 50, render: false},
];

function bootstrap(w = 400, h = 400, renderer = "p2d") {
  return new Promise((resolve) => {
    let myp5, font;
    new p5(function (p) {
      p.preload = function() {
        font = p.loadFont(fontFile);
      }
      p.setup = function () {
        myp5 = p;
        p.createCanvas(w, h, renderer);
        resolve({ myp5, font });
      };
    });
  });
}

function drawPoints(myp5, points) {
    for (let point of points) {
      myp5.point(point.x, point.y);
    }
}

(async function run() {
  let suiteName, results;

  suiteName = "Typography v1.x: 2D";
  results = [];
  for (let testCase of TO_POINTS_CASES) {
    let {myp5, font} = await bootstrap();
    myp5.textSize(testCase.textSize);
    
    let points;
    let duration = runTest(() => {
      points = font.textToPoints(testCase.str, 10, 20, testCase.textSize, { sampleFactor: testCase.sampleFactor});
      if (testCase.render) {
        drawPoints(myp5, points);
      }
    });
    results.push({
      label: testCase.label,
      duration: duration.toFixed(1),
      points: points.length,
      expectedPoints: testCase.points,
      variance: testCase.variance
    });
    myp5.remove();
  }
  writeResults(suiteName, results);

})();

function runTest(fn) {
  let startTime = performance.now();
  fn();
  return performance.now() - startTime;
}

function writeResults(suiteName, results) {
  const container = document.getElementById("results");
  const table = document.createElement("table");
  
  const headRow = table.createTHead().insertRow();
  [suiteName, "Case", "Time (ms)", "Points", "Expected Points"].forEach((cellText) => {
    const newCell = document.createElement("th");
    newCell.textContent = cellText;
    headRow.append(newCell);
  });

  const body = table.createTBody();
  for (let res of results) {
    const row = body.insertRow();
    row.insertCell(); // Intentionally blank, table left-padding
    row.insertCell().textContent = res.label;
    row.insertCell().textContent = res.duration;
    row.insertCell().textContent = res.points;
    row.insertCell().textContent = `${res.expectedPoints} +/- ${res.variance}`;
  }

  container.append(table);
}
