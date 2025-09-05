import fs from 'fs';

const cache   = {};
const patched = {};
const replace = (path, src, dest) => {
  if (Array.isArray(path)) {
    path.forEach(path => replace(path, src, dest));
    return;
  }
  try {
    if (!path.startsWith("types/"))
      path = "types/" + path;

    const before = patched[path] ??
      (cache[path] ??= fs.readFileSync("./" + path, { encoding: 'utf-8' }));
    const after = before.replace(src, dest);

    if (after !== before)
      patched[path] = after;
    else
      console.error(`A patch failed in ${path}:\n  -${src}\n  +${dest}`);
  } catch (err) {
    console.error(err);
  }
};

// #todo: p5 function doc in structure.d.ts should be merged into the p5 constructor, which then needs to be written to parameterData
replace(
  "global.d.ts",
  `function p5(sketch: object, node: string | HTMLElement): void;`,
  `// function p5(sketch: object, node: string | HTMLElement): void;`,
);
replace(
  "global.d.ts",
  `p5: typeof p5;`,
  `// p5: typeof p5;`,
);
replace(
  "p5.d.ts",
  "p5(sketch: object, node: string | HTMLElement): void;",
  "// p5(sketch: object, node: string | HTMLElement): void;"
);
replace(
  "core/structure.d.ts",
  "function p5(sketch: object, node: string | HTMLElement): void;",
  "// function p5: typeof p5"
);

replace(
  "webgl/p5.Geometry.d.ts",
  "constructor(detailX?: number, detailY?: number, callback?: function);",
  `constructor(
    detailX?: number,
    detailY?: number,
    callback?: (this: {
      detailY: number,
      detailX: number,
      vertices: p5.Vector[],
      uvs: number[]
    }) => void);`
);

// https://github.com/p5-types/p5.ts/issues/31
// #todo: add readonly to appropriate array params, either here or in doc comments
replace(
  [ "p5.d.ts", "math/random.d.ts" ],
  "random(choices: any[]): any;",
  "random<T>(choices: readonly T[]): T;"
);

for (const [path, data] of Object.entries(patched)) {
  try {
    console.log(`Patched ${path}`);
    fs.writeFileSync("./" + path, data);
  } catch (err) {
    console.error(err);
  }
}

