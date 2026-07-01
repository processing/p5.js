import p5 from '../../../src/app.js';
import { vi } from 'vitest';

suite('p5.GeometryPart', function() {
  let myp5;

  beforeAll(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {};
      p.draw = function() {};
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  test('is registered on p5', function() {
    expect(p5.GeometryPart).toBeDefined();
  });

  test('starts with empty buffers', function() {
    const part = new p5.GeometryPart('_part_test');
    expect(part.vertices).toEqual([]);
    expect(part.vertexNormals).toEqual([]);
    expect(part.faces).toEqual([]);
    expect(part.uvs).toEqual([]);
    expect(part.vertexColors).toEqual([]);
  });

  test('keeps the gid it was given', function() {
    const part = new p5.GeometryPart('parent|part0');
    expect(part.gid).toEqual('parent|part0');
  });

  test('defaults part state to nulls', function() {
    const part = new p5.GeometryPart('_part_test');
    expect(part.partState).toEqual({
      fill: null,
      ambientColor: null,
      specularColor: null,
      shininess: null,
      texture: null
    });
  });

  test('uses the part state it was given', function() {
    const state = { fill: [255, 0, 0], opacity: 0.5 };
    const part = new p5.GeometryPart('_part_test', state);
    expect(part.partState).toBe(state);
  });

  test('each part gets its own buffers', function() {
    const a = new p5.GeometryPart('a');
    const b = new p5.GeometryPart('b');
    a.vertices.push([0, 0, 0]);
    expect(b.vertices).toEqual([]);
  });

  suite('single-part wrap on p5.Geometry', function() {
    test('a plain geometry gets exactly one part', function() {
      const geom = new p5.Geometry(undefined, undefined, undefined,
        myp5._renderer);
      expect(geom.parts.length).toEqual(1);
    });

    test('the part is a live view onto the geometry buffers', function() {
      const geom = new p5.Geometry(undefined, undefined, undefined,
        myp5._renderer);
      expect(geom.parts[0].vertices).toBe(geom.vertices);
      expect(geom.parts[0].faces).toBe(geom.faces);
    });

    test('a single-material geometry is its own part', function() {
      const geom = new p5.Geometry(undefined, undefined, undefined,
        myp5._renderer);
      geom.gid = 'my-model';
      expect(geom.parts[0]).toBe(geom);
      expect(geom.parts[0].gid).toEqual('my-model');
    });

    test('a built-in primitive also gets one part', function() {
      const geom = new p5.Geometry(1, 1, function() {
        this.vertices.push(new p5.Vector(0, 0, 0));
      }, myp5._renderer);
      expect(geom.parts.length).toEqual(1);
      expect(geom.parts[0].vertices.length).toEqual(1);
    });
  });

  suite('multi-material rendering', function() {
    test('draws each part and passes the instance count through', async function() {
      const renderer = myp5.createCanvas(50, 50, myp5.WEBGL);
      const model = await new Promise(resolve =>
        myp5.loadModel('/test/unit/assets/octa-color.obj', resolve));

      // octa-color has several materials, so several parts.
      expect(model.parts.length).toBeGreaterThan(1);

      const spy = vi.spyOn(renderer, '_drawFills');
      myp5.background(255);
      myp5.model(model, 4);

      // one fill draw per material part, each carrying the instance count.
      expect(spy).toHaveBeenCalledTimes(model.parts.length);
      for (const call of spy.mock.calls) {
        expect(call[1].count).toEqual(4);
      }
      spy.mockRestore();
    });
  });
});
