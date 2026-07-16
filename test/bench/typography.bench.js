import { bench, describe } from "vitest";
import p5 from "../../src/app";
import { WEBGL, WEBGPU } from "../../src/core/constants";

const fontFile = "../../test/manual-test-examples/type/font/LiberationSans-Bold.ttf";

const strs = {
  single: "Performance",
  ten: "Performance testing 10 words at a time is exhaustive! Right?",
  paragraph: Array.from({ length: 10 }, (_, i) =>
    `${i === 0 ? "\t": ""}Performance is vital in all aspects of text rendering, even 10 lines at a time. This is line ${i + 1} of 10.`
  ).join("\n") // This will hit around 15fps, 21275 points
};

// Parameterizing test cases by function ensures consistency in test parameters across all renderers.
// Future tests should follow a similar format (e.g. TO_CONTOURS_CASES, etc)
const TO_POINTS_CASES = [
  {label: "textToPoints() single word", str: strs.single, textSize: 20, sampleFactor: 0.5, points: 317, variance: 5, render: false},
  {label: "textToPoints() single word, 150pt", str: strs.single, textSize: 150, sampleFactor: 0.5, points: 2336, variance: 50, render: false},
  {label: "textToPoints() single word, with render", str: strs.single, textSize: 20, sampleFactor: 0.5, points: 317, variance: 5, render: true},
  {label: "textToPoints() 10 words", str: strs.ten, textSize: 20, sampleFactor: 0.5, points: 1453, variance: 5, render: false},
  {label: "textToPoints() paragraph", str: strs.paragraph, textSize: 20, sampleFactor: 0.5, points: 21275, variance: 50, render: false},
];

const TO_PATHS_CASES = [
  {label: "textToPaths() single word", str: strs.single, textSize: 20, commands: 253, variance: 0, render: false},
  {label: "textToPaths() single word, 150pt", str: strs.single, textSize: 150, commands: 253, variance: 0, render: false},
  {label: "textToPaths() 10 words", str: strs.ten, textSize: 20, commands: 1157, variance: 0, render: false},
  {label: "textToPaths() paragraph", str: strs.paragraph, textSize: 20, commands: 16716, variance: 0, render: false},
];

async function bootstrap(w = 400, h = 400, renderer = undefined) {
  var myp5;
  var font;
  new p5(function (p) {
    p.setup = async function () {
      myp5 = p;
      font = await p.loadFont(fontFile);
      p.createCanvas(w, h, renderer);
    };
  });
  await vi.waitFor(() => {
    if (myp5 === undefined || font === undefined) throw new Error("not ready");
  });
  return { myp5, font };
}

function drawPoints(myp5, points) {
    for (let point of points) {
      myp5.point(point.x, point.y);
    }
}

const options = { iterations: 20, time: 500 };

describe("Typography: bench 2D", function() {
  var myp5, font;

  for (let testCase of TO_POINTS_CASES) {
    bench(
      testCase.label,
      async () => {
        const points = font.textToPoints(testCase.str, 10, 20, { sampleFactor: testCase.sampleFactor });
        assert.closeTo(points.length, testCase.points, testCase.variance);
        if (testCase.render) {
          drawPoints(myp5, points);
        }
      },
      {
        ...options,
        setup: async () => {
          ({myp5, font} = await bootstrap());
          myp5.textSize(testCase.textSize);
        },
        teardown: () => myp5.remove()
      }
    );
  }

  for (let testCase of TO_PATHS_CASES) {
    bench(
      testCase.label,
      async () => {
        const paths = font.textToPaths(testCase.str, 10, 20);
        assert.closeTo(paths.length, testCase.commands, testCase.variance);
      },
      {
        ...options,
        setup: async () => {
          ({myp5, font} = await bootstrap());
          myp5.textSize(testCase.textSize);
        },
        teardown: () => myp5.remove()
      }
    );
  }

});

describe("Typography: bench WebGL", function() {
  var myp5, font;

  for (let testCase of TO_POINTS_CASES) {
    bench(
      testCase.label,
      async () => {
        const points = font.textToPoints(testCase.str, 10, 20, { sampleFactor: testCase.sampleFactor });
        assert.closeTo(points.length, testCase.points, testCase.variance);
        if (testCase.render) {
          drawPoints(myp5, points);
        }
      },
      {
        ...options,
        setup: async () => {
          ({myp5, font} = await bootstrap(400, 400, WEBGL));
          myp5.textSize(testCase.textSize);
        },
        teardown: () => myp5.remove()
      }
    );
  }

  for (let testCase of TO_PATHS_CASES) {
    bench(
      testCase.label,
      async () => {
        const paths = font.textToPaths(testCase.str, 10, 20);
        assert.closeTo(paths.length, testCase.commands, testCase.variance);
      },
      {
        ...options,
        setup: async () => {
          ({myp5, font} = await bootstrap(400, 400, WEBGL));
          myp5.textSize(testCase.textSize);
        },
        teardown: () => myp5.remove()
      }
    );
  }

});

describe("Typography: bench WebGPU", function() {
  var myp5, font;

  for (let testCase of TO_POINTS_CASES) {
    bench(
      testCase.label,
      async () => {
        const points = font.textToPoints(testCase.str, 10, 20, { sampleFactor: testCase.sampleFactor });
        assert.closeTo(points.length, testCase.points, testCase.variance);
        if (testCase.render) {
          drawPoints(myp5, points);
        }
      },
      {
        ...options,
        setup: async () => {
          ({myp5, font} = await bootstrap(400, 400, WEBGPU));
          myp5.textSize(testCase.textSize);
        },
        teardown: () => myp5.remove()
      }
    );
  }

  for (let testCase of TO_PATHS_CASES) {
    bench(
      testCase.label,
      async () => {
        const paths = font.textToPaths(testCase.str, 10, 20);
        assert.closeTo(paths.length, testCase.commands, testCase.variance);
      },
      {
        ...options,
        setup: async () => {
          ({myp5, font} = await bootstrap(400, 400, WEBGPU));
          myp5.textSize(testCase.textSize);
        },
        teardown: () => myp5.remove()
      }
    );
  }

});