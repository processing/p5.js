suite('light', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('Light', function() {
    test('lightFalloff is initialised and set properly', function() {
      assert.deepEqual(myp5._renderer.constantAttenuation, 1);
      assert.deepEqual(myp5._renderer.linearAttenuation, 0);
      assert.deepEqual(myp5._renderer.quadraticAttenuation, 0);
      myp5.lightFalloff(2, 3, 4);
      assert.deepEqual(myp5._renderer.constantAttenuation, 2);
      assert.deepEqual(myp5._renderer.linearAttenuation, 3);
      assert.deepEqual(myp5._renderer.quadraticAttenuation, 4);
    });

    test('specularColor is initialised and set properly', function() {
      assert.deepEqual(myp5._renderer.specularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.pointLightSpecularColors, []);
      assert.deepEqual(myp5._renderer.directionalLightSpecularColors, []);
      myp5.specularColor(255, 0, 0);
      assert.deepEqual(myp5._renderer.specularColors, [1, 0, 0]);
      myp5.pointLight(255, 0, 0, 1, 0, 0);
      myp5.directionalLight(255, 0, 0, 0, 0, 0);
      assert.deepEqual(myp5._renderer.pointLightSpecularColors, [1, 0, 0]);
      assert.deepEqual(myp5._renderer.directionalLightSpecularColors, [
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
      assert.deepEqual([], myp5._renderer.ambientLightColors);
      assert.deepEqual([], myp5._renderer.pointLightDiffuseColors);
      assert.deepEqual([], myp5._renderer.pointLightSpecularColors);
      assert.deepEqual([], myp5._renderer.pointLightPositions);
      assert.deepEqual([], myp5._renderer.directionalLightDiffuseColors);
      assert.deepEqual([], myp5._renderer.directionalLightSpecularColors);
      assert.deepEqual([], myp5._renderer.directionalLightDirections);
      assert.deepEqual([1, 1, 1], myp5._renderer.specularColors);
      assert.deepEqual([], myp5._renderer.spotLightDiffuseColors);
      assert.deepEqual([], myp5._renderer.spotLightSpecularColors);
      assert.deepEqual([], myp5._renderer.spotLightPositions);
      assert.deepEqual([], myp5._renderer.spotLightDirections);
      assert.deepEqual(1, myp5._renderer._useShininess);
    });
  });

  suite('spotlight inputs', function() {
    let angle = Math.PI / 4;
    let defaultAngle = Math.cos(Math.PI / 3);
    let cosAngle = Math.cos(angle);
    let conc = 7;
    let defaultConc = 100;
    test('default', function() {
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, []);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, []);
      assert.deepEqual(myp5._renderer.spotLightPositions, []);
      assert.deepEqual(myp5._renderer.spotLightDirections, []);
      assert.deepEqual(myp5._renderer.spotLightAngle, []);
      assert.deepEqual(myp5._renderer.spotLightConc, []);
    });
    test('color,positions,directions', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, positions, directions);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,positions,directions,angle', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, positions, directions, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,positions,directions,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      // debugger;
      myp5.spotLight(color, positions, directions, angle, conc);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [conc]);
    });
    test('c1,c2,c3,positions,directions', function() {
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, positions, directions);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,directions', function() {
      let color = myp5.color(255, 0, 255);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, 1, 2, 3, directions);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,positions,r1,r2,r3', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(color, positions, 0, 1, 0);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,directions,angle', function() {
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, positions, directions, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,directions,angle', function() {
      let color = myp5.color(255, 0, 255);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, 1, 2, 3, directions, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,positions,r1,r2,r3,angle', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(color, positions, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,directions,angle,conc', function() {
      let positions = new p5.Vector(1, 2, 3);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, positions, directions, angle, conc);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [7]);
    });
    test('color,p1,p2,p3,directions,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(color, 1, 2, 3, directions, angle, conc);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [7]);
    });
    test('color,positions,r1,r2,r3,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(color, positions, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [7]);
    });
    test('c1,c2,c3,p1,p2,p3,directions', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,r1,r2,r3', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,r1,r2,r3', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,directions,angle', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,positions,r1,r2,r3,angle', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('color,p1,p2,p3,r1,r2,r3,angle', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,directions,angle,conc', function() {
      let directions = new p5.Vector(0, 1, 0);
      myp5.spotLight(255, 0, 255, 1, 2, 3, directions, angle, conc);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [7]);
    });
    test('c1,c2,c3,positions,r1,r2,r3,angle,conc', function() {
      let positions = new p5.Vector(1, 2, 3);
      myp5.spotLight(255, 0, 255, positions, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [7]);
    });
    test('color,p1,p2,p3,r1,r2,r3,angle,conc', function() {
      let color = myp5.color(255, 0, 255);
      myp5.spotLight(color, 1, 2, 3, 0, 1, 0, angle, conc);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [7]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [defaultAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3,angle', function() {
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, angle);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [defaultConc]);
    });
    test('c1,c2,c3,p1,p2,p3,r1,r2,r3,angle,conc', function() {
      // debugger;
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, angle, 7);
      assert.deepEqual(myp5._renderer.spotLightDiffuseColors, [1, 0, 1]);
      assert.deepEqual(myp5._renderer.spotLightSpecularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.spotLightPositions, [1, 2, 3]);
      assert.deepEqual(myp5._renderer.spotLightDirections, [0, 1, 0]);
      assert.deepEqual(myp5._renderer.spotLightAngle, [cosAngle]);
      assert.deepEqual(myp5._renderer.spotLightConc, [7]);
    });
  });
});
