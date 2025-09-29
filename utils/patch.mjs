import fs from 'fs';

export function applyPatches() {
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
      const after = before.replaceAll(src, dest);

      if (after !== before)
        patched[path] = after;
      else
        console.error(`A patch failed in ${path}:\n  -${src}\n  +${dest}`);
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: Handle this better in the docs instead of patching
  replace(
    "p5.d.ts",
    "constructor(detailX?: number, detailY?: number, callback?: Function);",
    `constructor(
      detailX?: number,
      detailY?: number,
      callback?: (this: Geometry) => void);`
  );

  // https://github.com/p5-types/p5.ts/issues/31
  // #todo: add readonly to appropriate array params, either here or in doc comments
  replace(
    ["p5.d.ts", "global.d.ts"],
    "random(choices: any[]): any;",
    "random<T>(choices: readonly T[]): T;"
  );

  replace(
    'p5.d.ts',
    'textToContours(str: string, x: number, y: number, options?: { sampleFactor?: number; simplifyThreshold?: number }): object[][];',
    'textToContours(str: string, x: number, y: number, options?: { sampleFactor?: number; simplifyThreshold?: number }): { x: number; y: number; alpha: number }[][];',
  );

  replace(
    'p5.d.ts',
    'class Renderer extends Element {}',
    `class Renderer extends Element {
      elt: HTMLCanvasElement;
    }`
  );

  replace(
    'p5.d.ts',
    'class MediaElement extends p5.Element {',
    `class MediaElement extends Element {
      elt: HTMLAudioElement | HTMLVideoElement;
    `
  );

  replace(
    'p5.d.ts',
    'class __Graphics extends p5.Element {',
    `class __Graphics extends p5.Element {
      elt: HTMLCanvasElement;
    `,
  );

  for (const [path, data] of Object.entries(patched)) {
    try {
      console.log(`Patched ${path}`);
      fs.writeFileSync("./" + path, data);
    } catch (err) {
      console.error(err);
    }
  }
}

