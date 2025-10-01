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

  // Type .elt more specifically for audio and video elements
  replace(
    'p5.d.ts',
    `class MediaElement extends Element {
      elt: HTMLAudioElement | HTMLVideoElement;`,
    `class MediaElement<T extends HTMLElement = HTMLAudioElement | HTMLVideoElement> extends Element {
      elt: T;`,
  );
  replace(
    ['p5.d.ts', 'global.d.ts'],
    /createAudio\(src\?: string \| string\[\], callback\?: Function\): ([pP]5)\.MediaElement;/g,
    'createAudio(src?: string | string[], callback?: (video: $1.MediaElement<HTMLAudioElement>) => any): $1.MediaElement<HTMLAudioElement>;',
  );
  replace(
    ['p5.d.ts', 'global.d.ts'],
    /createVideo\(src\?: string \| string\[\], callback\?: Function\): ([pP]5)\.MediaElement;/g,
    'createVideo(src?: string | string[], callback?: (video: $1.MediaElement<HTMLVideoElement>) => any): $1.MediaElement<HTMLVideoElement>;',
  );

  // More callback types
  replace(
    ['p5.d.ts', 'global.d.ts'],
    /createFileInput\(callback: Function, multiple\?: boolean\): ([pP]5)\.Element;/g,
    'createFileInput(callback: (input: $1.File) => any, multiple?: boolean): $1.Element;',
  );
  replace(
    ['p5.d.ts', 'global.d.ts'],
    /loadFont\((.+), successCallback\?: Function, (.+)\): Promise\<([pP]5)\.Font\>;/g,
    'loadFont($1, successCallback: (font: $3.Font) => any, $2): Promise<$3.Font>;'
  );

  // Type returned objects
  replace(
    'p5.d.ts',
    'calculateBoundingBox(): object;',
    'calculateBoundingBox(): { min: p5.Vector; max: p5.Vector; size: p5.Vector; offset: p5.Vector };'
  );
  replace(
    'p5.d.ts',
    'fontBounds(str: string, x: number, y: number, width?: number, height?: number): object;',
    'fontBounds(str: string, x: number, y: number, width?: number, height?: number): { x: number; y: number; w: number; h: number };',
  );
  replace(
    'p5.d.ts',
    'textBounds(str: string, x: number, y: number, width?: number, height?: number): object;',
    'textBounds(str: string, x: number, y: number, width?: number, height?: number): { x: number; y: number; w: number; h: number };',
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

