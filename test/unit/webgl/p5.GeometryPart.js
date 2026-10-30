import p5 from '../../../src/app.js';
import { vi } from 'vitest';

suite('p5.GeometryPart', function () {
  let myp5;

  beforeAll(function () {
    myp5 = new p5(function (p) {
      p.setup = function () {};
      p.draw = function () {};
    });
  });

  afterAll(function () {
    myp5.remove();
  });

  test('is registered on p5', function () {
    expect(p5.GeometryPart).toBeDefined();
  });

  test('starts with empty buffers', function () {
    const part = new p5.GeometryPart('_part_test');
    expect(part.vertices).toEqual([]);
    expect(part.vertexNormals).toEqual([]);
    expect(part.faces).toEqual([]);
    expect(part.uvs).toEqual([]);
    expect(part.vertexColors).toEqual([]);
  });

  test('keeps the gid it was given', function () {
    const part = new p5.GeometryPart('parent|part0');
    expect(part.gid).toEqual('parent|part0');
  });

  test('defaults part state to nulls', function () {
    const part = new p5.GeometryPart('_part_test');
    expect(part.partState).toEqual({
      fill: null,
      ambientColor: null,
      specularColor: null,
      shininess: null,
      texture: null,
      specularTexture: null,
      ambientTexture: null,
      shininessTexture: null,
      normalTexture: null,
      normalScale: 1,
      normalMapMode: 0
    });
  });

  test('uses the part state it was given', function () {
    const state = { fill: [255, 0, 0], opacity: 0.5 };
    const part = new p5.GeometryPart('_part_test', state);
    expect(part.partState).toBe(state);
  });

  test('each part gets its own buffers', function () {
    const a = new p5.GeometryPart('a');
    const b = new p5.GeometryPart('b');
    a.vertices.push([0, 0, 0]);
    expect(b.vertices).toEqual([]);
  });

  suite('single-part wrap on p5.Geometry', function () {
    test('a plain geometry gets exactly one part', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );
      expect(geom.parts.length).toEqual(1);
    });

    test('Geometry inherits from GeometryPart', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      expect(geom).toBeInstanceOf(p5.GeometryPart);
      expect(geom).toBeInstanceOf(p5.Geometry);
    });

    test('the part is a live view onto the geometry buffers', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      expect(geom.parts[0].vertices).toBe(geom.vertices);
      expect(geom.parts[0].faces).toBe(geom.faces);
    });

    test('a single-material geometry is its own part', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      geom.gid = 'my-model';

      expect(geom.parts[0]).toBe(geom);
      expect(geom.parts[0].gid).toEqual('my-model');
    });

    test('single-part geometry shares UVs and dirty flags with itself', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      expect(geom.parts[0]).toBe(geom);
      expect(geom.parts[0].uvs).toBe(geom.uvs);
      expect(geom.parts[0].dirtyFlags).toBe(geom.dirtyFlags);
      expect(geom.parts[0].userVertexProperties).toBe(
        geom.userVertexProperties
      );
    });

    test('separate geometries have independent mutable state', function () {
      const first = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      const second = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      expect(first.gid).not.toBe(second.gid);
      expect(first.vertices).not.toBe(second.vertices);
      expect(first.faces).not.toBe(second.faces);
      expect(first.uvs).not.toBe(second.uvs);
      expect(first.vertexNormals).not.toBe(second.vertexNormals);
      expect(first.vertexTangents).not.toBe(second.vertexTangents);
      expect(first.vertexColors).not.toBe(second.vertexColors);
      expect(first.dirtyFlags).not.toBe(second.dirtyFlags);
      expect(first.userVertexProperties).not.toBe(
        second.userVertexProperties
      );
      expect(first.partState).not.toBe(second.partState);
    });

    test('constructor callback runs after geometry initialization', function () {
      let callbackCalled = false;

      const geom = new p5.Geometry(
        2,
        3,
        function () {
          callbackCalled = true;

          expect(this).toBeInstanceOf(p5.GeometryPart);
          expect(this.vertices).toEqual([]);
          expect(this.uvs).toEqual([]);
          expect(this.edges).toEqual([]);
          expect(this.parts).toEqual([]);
          expect(this.detailX).toBe(2);
          expect(this.detailY).toBe(3);
          expect(this.renderer).toBe(myp5._renderer);

          this.vertices.push(new p5.Vector(1, 2, 3));
        },
        myp5._renderer
      );

      expect(callbackCalled).toBe(true);
      expect(geom.vertices).toHaveLength(1);
      expect(geom.parts[0]).toBe(geom);
    });

    test('a built-in primitive also gets one part', function () {
      const geom = new p5.Geometry(
        1,
        1,
        function () {
          this.vertices.push(new p5.Vector(0, 0, 0));
        },
        myp5._renderer
      );

      expect(geom.parts.length).toEqual(1);
      expect(geom.parts[0].vertices.length).toEqual(1);
    });

    test('Geometry inherits vertexProperty from GeometryPart', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      expect(geom.vertexProperty).toBe(
        p5.GeometryPart.prototype.vertexProperty
      );

      geom.vertexProperty('customAttr', [1, 2, 3], 3);

      expect(geom.userVertexProperties.customAttr).toBeDefined();
      expect(geom.customAttrSrc).toEqual([1, 2, 3]);
    });

    test('Geometry inherits hasFillTransparency from GeometryPart', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      expect(geom.hasFillTransparency).toBe(
        p5.GeometryPart.prototype.hasFillTransparency
      );
    });

    test('detects transparent vertex colors after they change', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      geom.vertexColors = [1, 1, 1, 1];
      expect(geom.hasFillTransparency()).toBe(false);

      geom.vertexColors = [1, 1, 1, 0.5];
      expect(geom.hasFillTransparency()).toBe(true);

      geom.vertexColors = [1, 1, 1, 1];
      expect(geom.hasFillTransparency()).toBe(false);
    });

    test('detects transparent material fill on a single-part geometry', function () {
      const geom = new p5.Geometry(
        undefined,
        undefined,
        undefined,
        myp5._renderer
      );

      geom.partState.fill = [1, 0, 0, 0.5];

      expect(geom.hasFillTransparency()).toBe(true);
    });

    test('computes face normals for a GeometryPart', function () {
      const part = new p5.GeometryPart('face-normal-test');

      part.vertices = [
        new p5.Vector(0, 0, 0),
        new p5.Vector(1, 0, 0),
        new p5.Vector(0, 1, 0)
      ];

      part.faces = [[0, 1, 2]];

      const normal = part._getFaceNormal(0);

      expect(normal.x).toBeCloseTo(0);
      expect(normal.y).toBeCloseTo(0);
      expect(normal.z).toBeCloseTo(Math.PI / 2);
    });
  });

  suite('multi-material rendering', function () {
    test('draws a fill per part and a stroke for the model', async function () {
      const renderer = myp5.createCanvas(50, 50, myp5.WEBGL);
      const model = await myp5.loadModel('/test/unit/assets/octa-color.obj');

      // octa-color has several materials, so several parts.
      expect(model.parts.length).toBeGreaterThan(1);

      const fillSpy = vi.spyOn(renderer, '_drawFills');
      const strokeSpy = vi.spyOn(renderer, '_drawStrokes');

      myp5.background(255);
      myp5.stroke(0);
      myp5.model(model);

      // One fill draw per material part.
      expect(fillSpy).toHaveBeenCalledTimes(model.parts.length);

      // The model's outline is still stroked.
      expect(strokeSpy).toHaveBeenCalled();

      fillSpy.mockRestore();
      strokeSpy.mockRestore();
    });
  });

  test('draws parts when the aggregate has no vertices', function () {
    const renderer = myp5.createCanvas(50, 50, myp5.WEBGL);

    const geom = new p5.Geometry(
      undefined,
      undefined,
      undefined,
      renderer
    );

    const partA = new p5.GeometryPart(`${geom.gid}|part0`);
    const partB = new p5.GeometryPart(`${geom.gid}|part1`);

    partA.vertices = [
      new p5.Vector(0, 0, 0),
      new p5.Vector(10, 0, 0),
      new p5.Vector(0, 10, 0)
    ];
    partA.faces = [[0, 1, 2]];

    partB.vertices = [
      new p5.Vector(0, 0, 0),
      new p5.Vector(-10, 0, 0),
      new p5.Vector(0, -10, 0)
    ];
    partB.faces = [[0, 1, 2]];

    geom.parts = [partA, partB];

    expect(geom.vertices).toHaveLength(0);

    const fillSpy = vi.spyOn(renderer, '_drawFills');

    try {
      myp5.fill(255);
      myp5.noStroke();
      myp5.model(geom);

      expect(fillSpy).toHaveBeenCalledTimes(2);
      expect(fillSpy.mock.calls[0][0]).toBe(partA);
      expect(fillSpy.mock.calls[1][0]).toBe(partB);
    } finally {
      fillSpy.mockRestore();
    }
  });

  test('skips empty parts but draws valid parts', function () {
    const renderer = myp5.createCanvas(50, 50, myp5.WEBGL);

    const geom = new p5.Geometry(
      undefined,
      undefined,
      undefined,
      renderer
    );

    const emptyPart = new p5.GeometryPart(`${geom.gid}|empty`);
    const validPart = new p5.GeometryPart(`${geom.gid}|valid`);

    validPart.vertices = [
      new p5.Vector(0, 0, 0),
      new p5.Vector(10, 0, 0),
      new p5.Vector(0, 10, 0)
    ];
    validPart.faces = [[0, 1, 2]];

    geom.parts = [emptyPart, validPart];

    const fillSpy = vi.spyOn(renderer, '_drawFills');

    try {
      myp5.fill(255);
      myp5.noStroke();
      myp5.model(geom);

      expect(fillSpy).toHaveBeenCalledTimes(1);
      expect(fillSpy.mock.calls[0][0]).toBe(validPart);
    } finally {
      fillSpy.mockRestore();
    }
  });

  test('continues drawing single-part geometry', function () {
    const renderer = myp5.createCanvas(50, 50, myp5.WEBGL);

    const geom = new p5.Geometry(
      undefined,
      undefined,
      function () {
        this.vertices.push(
          new p5.Vector(0, 0, 0),
          new p5.Vector(10, 0, 0),
          new p5.Vector(0, 10, 0)
        );

        this.faces.push([0, 1, 2]);
      },
      renderer
    );

    expect(geom.parts[0]).toBe(geom);

    const fillSpy = vi.spyOn(renderer, '_drawFills');

    try {
      myp5.fill(255);
      myp5.noStroke();
      myp5.model(geom);

      expect(fillSpy).toHaveBeenCalledTimes(1);
      expect(fillSpy.mock.calls[0][0]).toBe(geom);
    } finally {
      fillSpy.mockRestore();
    }
  });
});
