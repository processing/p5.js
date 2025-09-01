import fs from 'fs';

const replace = (path, src, dest) => {
  try {
    const data = fs
      .readFileSync(path, { encoding: 'utf-8' })
      .replace(src, dest);
    fs.writeFileSync(path, data);
  } catch (err) {
    console.error(err);
  }
};

replace(
  './types/core/structure.d.ts',
  'function p5(sketch: object, node: string | HTMLElement): void;',
  'function p5: typeof p5'
);

replace(
  './types/webgl/p5.Geometry.d.ts',
  'constructor(detailX?: number, detailY?: number, callback?: function);',
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
replace(
  './types/math/random.d.ts',
  'function random(choices: Array): any;',
  'function random<T>(choices: T[]): T;'
);


