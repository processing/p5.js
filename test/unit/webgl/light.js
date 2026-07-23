import p5 from '../../../src/app.js';

suite('light', function() {
  var myp5;

  beforeAll(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  suite('Light', function() {
    test('lightFalloff is initialised and set properly', function() {
      assert.deepEqual(myp5._renderer.states.constantAttenuation, 1);
      assert.deepEqual(myp5._renderer.states.linearAttenuation, 0);
      assert.deepEqual(myp5._renderer.states.quadraticAttenuation, 0);
      myp5.lightFalloff(2, 3, 4);
      assert.deepEqual(myp5._renderer.states.constantAttenuation, 2);
      assert.deepEqual(myp5._renderer.states.linearAttenuation, 3);
      assert.deepEqual(myp5._renderer.states.quadraticAttenuation, 4);
    });

    test('specularColor is initialised and set properly', function() {
      assert.deepEqual(myp5._renderer.states.specularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.pointLightSpecularColors, []);
      assert.deepEqual(
        myp5._renderer.states.directionalLightSpecularColors,
        []
      );
      myp5.specularColor(255, 0, 0);
      assert.deepEqual(myp5._renderer.states.specularColors, [1, 0, 0]);
      myp5.pointLight(255, 0, 0, 1, 0, 0);
      myp5.directionalLight(255, 0, 0, 0, 0, 0);
      assert.deepEqual(
        myp5._renderer.states.pointLightSpecularColors,
        [1, 0, 0]
      );
      assert.deepEqual(myp5._renderer.states.directionalLightSpecularColors, [
        1,
        0,
        0
      ]);
    });
    test('noLights works', function() {
      myp5.ambientLight(200, 0, 0);
      myp5.pointLight(255, 0, 0, 0, 0, 0);
      myp5.directionalLight(255, 0, 0, 0, 0, 0);
      myp5.specularColor(255, 0, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, Math.PI / 4, 7);
      myp5.shininess(50);

      myp5.noLights();
      assert.deepEqual([], myp5._renderer.states.ambientLightColors);
      assert.deepEqual([], myp5._renderer.states.pointLightDiffuseColors);
      assert.deepEqual([], myp5._renderer.states.pointLightSpecularColors);
      assert.deepEqual([], myp5._renderer.states.pointLightPositions);
      assert.deepEqual([], myp5._renderer.states.directionalLightDiffuseColors);
      assert.deepEqual(
        [],
        myp5._renderer.states.directionalLightSpecularColors
      );
      assert.deepEqual([], myp5._renderer.states.directionalLightDirections);
      assert.deepEqual([1, 1, 1], myp5._renderer.states.specularColors);
      assert.deepEqual([], myp5._renderer.states.spotLightDiffuseColors);
      assert.deepEqual([], myp5._renderer.states.spotLightSpecularColors);
      assert.deepEqual([], myp5._renderer.states.spotLightPositions);
      assert.deepEqual([], myp5._renderer.states.spotLightDirections);
      assert.deepEqual(1, myp5._renderer.states._useShininess);
    });
  });

  suite('spotlight inputs', function() {
    beforeEach(() => myp5.noLights());
    let angle = Math.PI / 4;
    let defaultAngle = Math.cos(Math.PI / 3);
    let cosAngle = Math.cos(angle);
    let conc = 7;
    let defaultConc = 100;
    test('default', function() {
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, []);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, []);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, []);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, []);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, []);
      assert.deepEqual(myp5._renderer.states.spotLightConc, []);
    });
    test('color,positions,directions', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, positions, directions);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,positions,directions,angle', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, positions, directions, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,positions,directions,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, positions, directions, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [conc]);
    });
    test('c1,c2,c3,positions,directions', function() {
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, positions, directions);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,directions', function() {
      let color = myp5.color(255, 0, 255);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, 1, 2, 3, directions);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,positions,r1,r2,r3', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(color, positions, 0, 1, 0);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,directions,angle', function() {
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, positions, directions, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,directions,angle', function() {
      let color = myp5.color(255, 0, 255);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, 1, 2, 3, directions, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,positions,r1,r2,r3,angle', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(color, positions, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,directions,angle,conc', function() {
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, positions, directions, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('color,p1,p2,p3,directions,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, 1, 2, 3, directions, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('color,positions,r1,r2,r3,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(color, positions, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('c1,c2,c3,p1,p2,p3,directions', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,r1,r2,r3', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,r1,r2,r3', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,directions,angle', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,r1,r2,r3,angle', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,r1,r2,r3,angle', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,directions,angle,conc', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('c1,c2,c3,positions,r1,r2,r3,angle,conc', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('color,p1,p2,p3,r1,r2,r3,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3,angle', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3,angle,conc', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, angle, 7);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(
        myp5._renderer.states.spotLightSpecularColors,
        [1, 1, 1]
      );
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
  });

  suite('parameter validation', function() {
    let spy;

    beforeEach(function() {
      myp5.noLights();
      spy = vi.spyOn(p5, '_friendlyError').mockImplementation(() => {});
    });

    afterEach(function() {
      vi.restoreAllMocks();
    });

    // ambientLight validation
    test('ambientLight() with no args emits friendly error', function() {
      myp5.ambientLight();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('ambientLight');
    });

    test('ambientLight() with valid args does not emit error', function() {
      myp5.ambientLight(200, 100, 100);
      expect(spy).not.toHaveBeenCalled();
    });

    test('ambientLight() with single grayscale arg does not emit error', function() {
      myp5.ambientLight(128);
      expect(spy).not.toHaveBeenCalled();
    });

    test('ambientLight() with CSS string arg does not emit error', function() {
      myp5.ambientLight('red');
      expect(spy).not.toHaveBeenCalled();
    });

    test('ambientLight() with p5.Color arg does not emit error', function() {
      const c = myp5.color(100, 200, 100);
      myp5.ambientLight(c);
      expect(spy).not.toHaveBeenCalled();
    });

    // specularColor validation
    test('specularColor() with no args emits friendly error', function() {
      myp5.specularColor();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('specularColor');
    });

    test('specularColor() with valid args does not emit error', function() {
      myp5.specularColor(255, 0, 0);
      expect(spy).not.toHaveBeenCalled();
    });

    // directionalLight validation
    test('directionalLight() with 0 args emits friendly error', function() {
      myp5.directionalLight();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('directionalLight');
    });

    test('directionalLight() with 1 arg emits friendly error', function() {
      myp5.directionalLight(255);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('directionalLight');
    });

    test('directionalLight() with valid color+vector does not emit error', function() {
      const c = myp5.color(255, 0, 0);
      const d = new p5.Vector(0, 0, -1);
      myp5.directionalLight(c, d);
      expect(spy).not.toHaveBeenCalled();
    });

    test('directionalLight() with 6 numeric args does not emit error', function() {
      myp5.directionalLight(255, 0, 0, 0, 0, -1);
      expect(spy).not.toHaveBeenCalled();
    });

    // pointLight validation
    test('pointLight() with 0 args emits friendly error', function() {
      myp5.pointLight();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('pointLight');
    });

    test('pointLight() with 1 arg emits friendly error', function() {
      myp5.pointLight(255);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('pointLight');
    });

    test('pointLight() with valid color+vector does not emit error', function() {
      const c = myp5.color(255, 0, 0);
      const pos = new p5.Vector(0, 0, 0);
      myp5.pointLight(c, pos);
      expect(spy).not.toHaveBeenCalled();
    });

    test('pointLight() with 6 numeric args does not emit error', function() {
      myp5.pointLight(255, 0, 0, 1, 2, 3);
      expect(spy).not.toHaveBeenCalled();
    });

    // lightFalloff validation
    test('lightFalloff() with 0 args emits friendly error', function() {
      myp5.lightFalloff();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('lightFalloff');
    });

    test('lightFalloff() with 1 arg emits friendly error', function() {
      myp5.lightFalloff(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('lightFalloff');
    });

    test('lightFalloff() with 2 args emits friendly error', function() {
      myp5.lightFalloff(1, 0);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('lightFalloff');
    });

    test('lightFalloff() with non-numeric args emits friendly error', function() {
      myp5.lightFalloff('a', 'b', 'c');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('lightFalloff');
    });

    test('lightFalloff() with 3 valid numeric args does not emit error', function() {
      myp5.lightFalloff(1, 0, 0);
      expect(spy).not.toHaveBeenCalled();
    });

    test('lightFalloff() with negative constant emits friendly error', function() {
      myp5.lightFalloff(-1, 0, 1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('lightFalloff');
      // Should clamp to 0
      assert.deepEqual(myp5._renderer.states.constantAttenuation, 0);
    });

    test('lightFalloff() with all zeros emits friendly error and sets constant to 1', function() {
      myp5.lightFalloff(0, 0, 0);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('lightFalloff');
      assert.deepEqual(myp5._renderer.states.constantAttenuation, 1);
    });

    // spotLight validation
    test('spotLight() with 0 args emits friendly error', function() {
      myp5.spotLight();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('spotLight');
    });

    test('spotLight() with 1 arg emits friendly error', function() {
      myp5.spotLight(255);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('spotLight');
    });

    test('spotLight() with 2 args emits friendly error', function() {
      myp5.spotLight(255, 0);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('spotLight');
    });

    test('spotLight() with valid color+pos+dir objects does not emit error', function() {
      const c = myp5.color(255, 0, 255);
      const pos = new p5.Vector(1, 2, 3);
      const dir = new p5.Vector(0, 1, 0);
      myp5.spotLight(c, pos, dir);
      expect(spy).not.toHaveBeenCalled();
    });

    test('spotLight() with 9 numeric args does not emit error', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0);
      expect(spy).not.toHaveBeenCalled();
    });

    // noLights validation
    test('noLights() with args emits friendly error but still works', function() {
      myp5.ambientLight(200, 0, 0);
      myp5.noLights(1, 2, 3);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toBe('noLights');
      // Should still clear lights
      assert.deepEqual(myp5._renderer.states.ambientLightColors, []);
    });

    test('noLights() without args does not emit error', function() {
      myp5.noLights();
      expect(spy).not.toHaveBeenCalled();
    });

    // Verify chainability on error
    test('ambientLight() returns this on validation error for chaining', function() {
      const result = myp5.ambientLight();
      assert.equal(result, myp5);
    });

    test('directionalLight() returns this on validation error for chaining', function() {
      const result = myp5.directionalLight();
      assert.equal(result, myp5);
    });

    test('pointLight() returns this on validation error for chaining', function() {
      const result = myp5.pointLight();
      assert.equal(result, myp5);
    });

    test('lightFalloff() returns this on validation error for chaining', function() {
      const result = myp5.lightFalloff();
      assert.equal(result, myp5);
    });

    test('spotLight() returns this on validation error for chaining', function() {
      const result = myp5.spotLight();
      assert.equal(result, myp5);
    });
  });
});
