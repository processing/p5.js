import { bench, describe } from "vitest";

describe.skip("sort", () => {
  bench(
    "normal",
    () => {
      const x = [1, 5, 4, 2, 3];
      x.sort((a, b) => {
        return a - b;
      });
      throw new Error("error");
    },
    { iterations: 100 }
  );

  bench(
    "reverse",
    () => {
      const x = [1, 5, 4, 2, 3];
      x.reverse()
        .reverse()
        .reverse()
        .sort((a, b) => {
          return a - b;
        });
    },
    { iterations: 10 }
  );
});
