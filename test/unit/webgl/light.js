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
      assert.deepEqual(myp5._renderer.states.directionalLightSpecularColors, []);
      myp5.specularColor(255, 0, 0);
      assert.deepEqual(myp5._renderer.states.specularColors, [1, 0, 0]);
      myp5.pointLight(255, 0, 0, 1, 0, 0);
      myp5.directionalLight(255, 0, 0, 0, 0, 0);
      assert.deepEqual(myp5._renderer.states.pointLightSpecularColors, [1, 0, 0]);
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
      assert.deepEqual([], myp5._renderer.states.directionalLightSpecularColors);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
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
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('c1,c2,c3,p1,p2,p3,directions', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,r1,r2,r3', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,r1,r2,r3', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,directions,angle', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,r1,r2,r3,angle', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,r1,r2,r3,angle', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,directions,angle,conc', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('c1,c2,c3,positions,r1,r2,r3,angle,conc', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('color,p1,p2,p3,r1,r2,r3,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3,angle', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3,angle,conc', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, angle, 7);
      assert.deepEqual(myp5._renderer.states.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.states.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.states.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.states.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.states.spotLightConc, [7]);
    });
  });
});
