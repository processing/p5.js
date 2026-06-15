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

// TODO: We might consider parameterizing tests since they mainly vary by renderer.
//       For example, `TO_POINTS` each function can have an array of test parameters.
const TO_POINTS = {
  single: {str: "Performance", size: 20, sf: 0.5, points: 317, variance: 5}
};

// TODO: Alternatively, we can create an array of test bodies which take a p5 instance which has already run _setup()
const TO_POINTS_FNS = {
  single: {
    label: "textToPoints() single word",
    fn: (myp5, font) => {
      myp5.textSize(20);
      const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
      assert.closeTo(points.length, 317, 5);
      myp5.remove();
    }
  }
};

async function _setup(w = 400, h = 400, renderer = undefined) {
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
    if (myp5 === undefined) throw new Error("not ready");
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

  bench(
    "textToPoints() single word",
    async () => {
      try {
        const { myp5, font } = await _setup();
        myp5.textSize(20);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 317, 5);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() single word, 150pt",
    async () => {
      try {
        const { myp5, font } = await _setup();
        myp5.textSize(150);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 2336, 50);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  // TODO: This is an example of using setup() to isolate benchmarks away from p5 instance setup code
  //       which adds ~50ms universally to all benchmarks.
  bench(
    "textToPoints() single word, isolated benchmark",
    async () => {
      const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
      assert.closeTo(points.length, 317, 5);
    },
    {
      ...options,
      setup: async () => {
        ({ myp5, font } = await _setup());
        myp5.textSize(20);
      },
      teardown: () => myp5.remove()
    }
  );

  bench(
    "textToPoints() single word, with render",
    async () => {
      try {
        const { myp5, font } = await _setup();
        myp5.textSize(20);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 317, 5);
        drawPoints(myp5, points);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() 10 words",
    async () => {
      try {
        const { myp5, font } = await _setup();
        myp5.textSize(20);
        const points = font.textToPoints(strs.ten, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 1453, 5);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() Paragraph",
    async () => {
      try {
        const { myp5, font } = await _setup();
        myp5.textSize(20);
        const points = font.textToPoints(strs.paragraph, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 21275, 50);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  // TODO: textToContours()
  // TODO: textToPaths()

});

describe("Typography: bench WebGL", function() {
  var myp5, font;

  bench(
    "textToPoints() single word",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGL);
        myp5.textSize(20);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 317, 5);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() single word, 150pt",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGL);
        myp5.textSize(150);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 2336, 50);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  // TODO: this is an example of using setup() to isolate benchmarks away from p5 instance setup code
  //       which adds ~50ms universally to all benchmarks
  bench(
    "textToPoints() single word, isolated benchmark",
    async () => {
      const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
      assert.closeTo(points.length, 317, 5);
    },
    {
      ...options,
      setup: async () => {
        ({ myp5, font } = await _setup(400, 400, WEBGL));
        myp5.textSize(20);
      },
      teardown: () => myp5.remove()
    }
  );

  bench(
    "textToPoints() single word, with render",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGL);
        myp5.textSize(20);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 317, 5);
        drawPoints(myp5, points);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() 10 words",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGL);
        myp5.textSize(20);
        const points = font.textToPoints(strs.ten, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 1453, 5);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() Paragraph",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGL);
        myp5.textSize(20);
        const points = font.textToPoints(strs.paragraph, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 21275, 50);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  // TODO: textToContours()
  // TODO: textToPaths()
  // TODO: textToPoints()
  // TODO: textToContours()
  // TODO: textToPaths()
  // TODO: textToModel()

});

describe("Typography: bench WebGPU", function() {
  var myp5, font;

  bench(
    "textToPoints() single word",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGPU);
        myp5.textSize(20);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 317, 5);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() single word, 150pt",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGPU);
        myp5.textSize(150);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 2336, 50);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  // TODO: this is an example of using setup() to isolate benchmarks away from p5 instance setup code
  //       which adds ~50ms universally to all benchmarks
  bench(
    "textToPoints() single word, isolated benchmark",
    async () => {
      const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
      assert.closeTo(points.length, 317, 5);
    },
    {
      ...options,
      setup: async () => {
        ({ myp5, font } = await _setup(400, 400, WEBGPU));
        myp5.textSize(20);
      },
      teardown: () => myp5.remove()
    }
  );

  bench(
    "textToPoints() single word, with render",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGPU);
        myp5.textSize(20);
        const points = font.textToPoints(strs.single, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 317, 5);
        drawPoints(myp5, points);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() 10 words",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGPU);
        myp5.textSize(20);
        const points = font.textToPoints(strs.ten, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 1453, 5);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "textToPoints() Paragraph",
    async () => {
      try {
        const { myp5, font } = await _setup(400, 400, WEBGPU);
        myp5.textSize(20);
        const points = font.textToPoints(strs.paragraph, 6, 20, { sampleFactor: 0.5 });
        assert.closeTo(points.length, 21275, 50);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  // TODO: textToContours()
  // TODO: textToPaths()
  // TODO: textToPoints()
  // TODO: textToContours()
  // TODO: textToPaths()
  // TODO: textToModel()

});