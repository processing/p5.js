// import p5 from "../../../src/app.js";
import { bench, describe } from "vitest";
import p5 from "../../src/app";

const options = { iterations: 1, time: 1500 };
const ITERATIONS = 100
describe.sequential("Dave bench test", () => {
  bench(
    "TEST CPU TRANSFORMS true",
    async () => {
      try {
        const TEST_CPU_TRANSFORMS = true;
        var myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) {
            throw new Error("not ready");
          }
        });
        let fps;
        const state = [];

        myp5.createCanvas(400, 400, myp5.WEBGL);
        for (let i = 0; i < ITERATIONS; i++) {
          state.push({
            pos: myp5.createVector(
              myp5.random(-200, 200),
              myp5.random(-200, 200)
            ),
            vel: myp5.createVector(myp5.random(-2, 2), myp5.random(-2, 2)),
          });
        }
        fps = myp5.createP();

        assert.equal(myp5.webglVersion, myp5.webglVersion);
        myp5.remove();

        // Now what's in draw
        myp5.background(220);

        for (const s of state) {
          s.pos.add(s.vel);
          for (const axis of ["x", "y"]) {
            if (s.pos[axis] < -200) {
              s.pos[axis] = -200;
              s.vel[axis] *= -1;
            }
            if (s.pos[axis] > 200) {
              s.pos[axis] = 200;
              s.vel[axis] *= -1;
            }
          }
        }

        const drawCircles = () => {
          for (const s of state) {
            myp5.push();
            myp5.translate(s.pos.x, s.pos.y);
            const pts = 500;
            myp5.beginShape(myp5.TRIANGLE_FAN);
            myp5.vertex(0, 0);
            for (let i = 0; i <= pts; i++) {
              const a = (i / pts) * myp5.TWO_PI;
              myp5.vertex(5 * myp5.cos(a), 5 * myp5.sin(a));
            }
            myp5.endShape();
            myp5.pop();
          }
        };

        if (TEST_CPU_TRANSFORMS) {
          // Flattens into a single buffer
          const shape = myp5.buildGeometry(drawCircles);
          myp5.model(shape);
          myp5.freeGeometry(myp5.model);
        } else {
          drawCircles();
        }
      } catch (error) {
        console.log(error);
      }
    },
    options
  ),
    options;
  bench(
    "TEST CPU TRANSFORMS false",
    async () => {
      const TEST_CPU_TRANSFORMS = false;
      var myp5;
      new p5(function (p) {
        p.setup = function () {
          myp5 = p;
        };
      });
      await vi.waitFor(() => {
        if (myp5 === undefined) {
          throw new Error("not ready");
        }
      });
      let fps;
      const state = [];

      myp5.createCanvas(400, 400, myp5.WEBGL);
      for (let i = 0; i < ITERATIONS; i++) {
        state.push({
          pos: myp5.createVector(
            myp5.random(-200, 200),
            myp5.random(-200, 200)
          ),
          vel: myp5.createVector(myp5.random(-2, 2), myp5.random(-2, 2)),
        });
      }
      fps = myp5.createP();

      assert.equal(myp5.webglVersion, myp5.webglVersion);
      myp5.remove();

      // Now what's in draw
      myp5.background(220);

      for (const s of state) {
        s.pos.add(s.vel);
        for (const axis of ["x", "y"]) {
          if (s.pos[axis] < -200) {
            s.pos[axis] = -200;
            s.vel[axis] *= -1;
          }
          if (s.pos[axis] > 200) {
            s.pos[axis] = 200;
            s.vel[axis] *= -1;
          }
        }
      }

      const drawCircles = () => {
        for (const s of state) {
          myp5.push();
          myp5.translate(s.pos.x, s.pos.y);
          const pts = 500;
          myp5.beginShape(myp5.TRIANGLE_FAN);
          myp5.vertex(0, 0);
          for (let i = 0; i <= pts; i++) {
            const a = (i / pts) * myp5.TWO_PI;
            myp5.vertex(5 * myp5.cos(a), 5 * myp5.sin(a));
          }
          myp5.endShape();
          myp5.pop();
        }
      };

      if (TEST_CPU_TRANSFORMS) {
        // Flattens into a single buffer
        const shape = myp5.buildGeometry(drawCircles);
        myp5.model(shape);
        myp5.freeGeometry(myp5.model);
      } else {
        drawCircles();
      }
    },
    options
  ),
    options;
});
