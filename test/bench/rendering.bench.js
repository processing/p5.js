// import p5 from "../../../src/app.js";
import { bench, describe } from "vitest";
import p5 from "../../src/app";

const options = { iterations: 20, time: 500 };
describe("Rendering bench test", () => {
  bench(
    "normal",
    async () => {
      try {
        var myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
            p.rect(10, 10, 10, 10);
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) {
            throw new Error("not ready");
          }
        });

        myp5.createCanvas(13, 15);
        myp5.fill(0, 100, 0);
        myp5.rect(20, 20, 20, 20);

        assert.equal(myp5.webglVersion, myp5.P2D);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "thousand",
    async () => {
      try {
        var myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
            p.rect(10, 10, 10, 10);
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) {
            throw new Error("not ready");
          }
        });

        myp5.createCanvas(13, 15);
        myp5.fill(0, 100, 0);
        myp5.rect(20, 20, 20, 20);
        for (let i = 0; i < 1000; i++) {
          myp5.rect(20, 20, 20, 20);
        }

        assert.equal(myp5.webglVersion, myp5.P2D);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "10k",
    async () => {
      try {
        var myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
            p.rect(10, 10, 10, 10);
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) {
            throw new Error("not ready");
          }
        });

        myp5.createCanvas(13, 15);
        myp5.fill(0, 100, 0);
        myp5.rect(20, 20, 20, 20);
        for (let i = 0; i < 10000; i++) {
          myp5.rect(20, 20, 20, 20);
        }

        assert.equal(myp5.webglVersion, myp5.P2D);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );
});
describe("Another suire", () => {
  bench(
    "normal v2",
    async () => {
      try {
        var myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
            p.rect(10, 10, 10, 10);
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) {
            throw new Error("not ready");
          }
        });

        myp5.createCanvas(13, 15);
        myp5.fill(0, 100, 0);
        myp5.rect(20, 20, 20, 20);

        assert.equal(myp5.webglVersion, myp5.P2D);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "thousand v2",
    async () => {
      try {
        var myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
            p.rect(10, 10, 10, 10);
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) {
            throw new Error("not ready");
          }
        });

        myp5.createCanvas(13, 15);
        myp5.fill(0, 100, 0);
        myp5.rect(20, 20, 20, 20);
        for (let i = 0; i < 1000; i++) {
          myp5.rect(20, 20, 20, 20);
        }

        assert.equal(myp5.webglVersion, myp5.P2D);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );

  bench(
    "10k v2",
    async () => {
      try {
        var myp5;
        new p5(function (p) {
          p.setup = function () {
            myp5 = p;
            p.rect(10, 10, 10, 10);
          };
        });
        await vi.waitFor(() => {
          if (myp5 === undefined) {
            throw new Error("not ready");
          }
        });

        myp5.createCanvas(13, 15);
        myp5.fill(0, 100, 0);
        myp5.rect(20, 20, 20, 20);
        for (let i = 0; i < 10000; i++) {
          myp5.rect(20, 20, 20, 20);
        }

        assert.equal(myp5.webglVersion, myp5.P2D);
        myp5.remove();
      } catch (error) {
        console.log(error);
      }
    },
    options
  );
});
