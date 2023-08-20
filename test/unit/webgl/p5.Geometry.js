suite('p5.Geometry', function() {
  let myp5;

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {};
      p.draw = function() {};
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('generating edge geometry', function() {
    let geom;

    setup(function() {
      geom = new p5.Geometry();
      sinon.spy(geom, '_addCap');
      sinon.spy(geom, '_addJoin');
      sinon.spy(geom, '_addSegment');
    });

    teardown(function() {
      geom._addCap.restore();
      geom._addJoin.restore();
      geom._addSegment.restore();
    });

    test('single polyline', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(100, 100),
        myp5.createVector(100, 0)
      );
      geom.edges.push([0, 1], [1, 2], [2, 3]);
      geom._edgesToVertices();

      assert.equal(geom._addSegment.callCount, 3);
      assert.equal(geom._addCap.callCount, 2);
      assert.equal(geom._addJoin.callCount, 2);
    });

    test('straight line', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(0, 200)
      );
      geom.edges.push([0, 1], [1, 2]);
      geom._edgesToVertices();

      assert.equal(geom._addSegment.callCount, 2);
      assert.equal(geom._addCap.callCount, 2);
      // No joins since the directions of each segment are the same
      assert.equal(geom._addJoin.callCount, 0);
    });

    test('two disconnected polylines', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(100, 100),
        myp5.createVector(100, 0)
      );
      geom.edges.push([0, 1], [2, 3]);
      geom._edgesToVertices();

      assert.equal(geom._addSegment.callCount, 2);
      assert.equal(geom._addCap.callCount, 4);
      assert.equal(geom._addJoin.callCount, 0);
    });

    test('polyline that loops back', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(100, 100),
        myp5.createVector(100, 0)
      );
      geom.edges.push([0, 1], [1, 2], [2, 3], [3, 0]);
      geom._edgesToVertices();

      assert.equal(geom._addSegment.callCount, 4);
      assert.equal(geom._addCap.callCount, 0);
      assert.equal(geom._addJoin.callCount, 4);
    });

    test('degenerate edge in the middle', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(0, 100),
        myp5.createVector(100, 100),
        myp5.createVector(100, 0)
      );
      geom.edges.push([0, 1], [1, 2], [2, 3], [3, 4]);
      geom._edgesToVertices();

      // The degenerate edge should be skipped without breaking the
      // polyline into multiple pieces
      assert.equal(geom._addSegment.callCount, 3);
      assert.equal(geom._addCap.callCount, 2);
      assert.equal(geom._addJoin.callCount, 2);
    });

    test('degenerate edge at the end', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(100, 100),
        myp5.createVector(100, 0),
        myp5.createVector(100, 0)
      );
      geom.edges.push([0, 1], [1, 2], [2, 3], [3, 4]);
      geom._edgesToVertices();

      // The degenerate edge should be skipped and caps should still be added
      // from the previous non degenerate edge
      assert.equal(geom._addSegment.callCount, 3);
      assert.equal(geom._addCap.callCount, 2);
      assert.equal(geom._addJoin.callCount, 2);
    });

    test('degenerate edge between two disconnected polylines', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(0, 100),
        myp5.createVector(100, 100),
        myp5.createVector(100, 0)
      );
      geom.edges.push([0, 1], [1, 2], [3, 4]);
      geom._edgesToVertices();

      assert.equal(geom._addSegment.callCount, 2);
      assert.equal(geom._addCap.callCount, 4);
      assert.equal(geom._addJoin.callCount, 0);
    });
  });

  suite('buildGeometry', function() {
    const checkLights = () => myp5.lights();
    const checkMaterials = () => {
      myp5.fill('#ffea30');
      myp5.ambientMaterial(myp5.color('#f2b988'));
      myp5.specularMaterial(255);
      myp5.shininess(200);
      myp5.ambientLight(myp5.color('#88989e'));
      myp5.pointLight(200, -100, -50, 255, 255, 255);
    };
    const checkNormals = () => myp5.normalMaterial();
    function assertGeometryRendersMatch(drawGeometry, lightingModes) {
      myp5.createCanvas(50, 50, myp5.WEBGL);
      myp5.pixelDensity(1);
      myp5.setAttributes({ antialias: false });

      for (const applyLights of lightingModes) {
        // Regular mode
        myp5.background(255);
        myp5.fill(255);
        myp5.push();
        applyLights();
        drawGeometry();
        myp5.pop();
        myp5.resetShader();
        const regularImage = myp5._renderer.elt.toDataURL();

        // Geometry mode
        myp5.fill(255);
        const geom = myp5.buildGeometry(drawGeometry);
        myp5.background(255);
        myp5.push();
        applyLights();
        myp5.model(geom);
        myp5.pop();
        myp5.resetShader();
        const geometryImage = myp5._renderer.elt.toDataURL();

        assert.equal(regularImage, geometryImage);
      }
    }

    test('Transforms are applied to models', function() {
      assertGeometryRendersMatch(function() {
        myp5.push();
        myp5.translate(0, -20);
        for (let i = 0; i < 4; i++) {
          myp5.box(8);
          myp5.translate(0, 40/3);
          myp5.rotateY(myp5.PI * 0.2);
        }
        myp5.pop();
      }, [checkLights, checkMaterials, checkNormals]);
    });

    test('Immediate mode constructs are translated correctly', function() {
      assertGeometryRendersMatch(function() {
        myp5.scale(1/6);
        myp5.push();
        myp5.translate(100, -50);
        myp5.scale(0.5);
        myp5.rotateX(myp5.PI/4);
        myp5.cone();
        myp5.pop();
        myp5.cone();

        myp5.beginShape();
        myp5.vertex(-20, -50);
        myp5.quadraticVertex(
          -40, -70,
          0, -60
        );
        myp5.endShape();

        myp5.beginShape(myp5.TRIANGLE_STRIP);
        for (let y = 20; y <= 60; y += 10) {
          for (let x of [20, 60]) {
            myp5.vertex(x, y);
          }
        }
        myp5.endShape();

        myp5.beginShape();
        myp5.vertex(-100, -120);
        myp5.vertex(-120, -110);
        myp5.vertex(-105, -100);
        myp5.endShape();
      }, [checkLights, checkMaterials, checkNormals]);
    });

    test('Vertex colors are captured', function() {
      assertGeometryRendersMatch(function() {
        myp5.push();
        myp5.translate(0, -10);
        myp5.fill('red');
        myp5.sphere(5, 10, 5);
        myp5.pop();

        myp5.push();
        myp5.translate(-10, 10);
        myp5.fill('lime');
        myp5.sphere(5, 10, 5);
        myp5.pop();

        myp5.push();
        myp5.translate(10, 10);
        myp5.fill('blue');
        myp5.sphere(5, 10, 5);
        myp5.pop();
      }, [checkLights]);
    });

    test('freeGeometry() cleans up resources', function() {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.pixelDensity(1);

      const drawShape = () => {
        myp5.fill('blue');
        myp5.stroke(0);
        myp5.beginShape(myp5.QUAD_STRIP);
        myp5.vertex(-5, -5);
        myp5.vertex(5, -5);
        myp5.vertex(-5, 5);
        myp5.vertex(5, 5);
        myp5.endShape();
      };

      const geom = myp5.buildGeometry(drawShape);

      myp5.background('red');
      myp5.fill('blue');
      myp5.stroke(0);
      myp5.model(geom);
      assert.deepEqual(myp5.get(5, 5), [0, 0, 255, 255]);

      // Using immediate mode after freeing the geometry should work
      myp5.freeGeometry(geom);
      myp5.background('red');
      drawShape();
      assert.deepEqual(myp5.get(5, 5), [0, 0, 255, 255]);

      // You can still draw the geometry even after freeing it
      myp5.background('red');
      myp5.model(geom);
      assert.deepEqual(myp5.get(5, 5), [0, 0, 255, 255]);
    });
  });
});
