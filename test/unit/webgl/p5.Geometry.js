import p5 from '../../../src/app.js';
import { vi } from 'vitest';

suite('p5.Geometry', function() {
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

  suite('generating edge geometry', function() {
    let geom;

    beforeEach(function() {
      geom = new p5.Geometry(undefined, undefined, undefined, myp5._renderer);
      vi.spyOn(geom, '_addCap');
      vi.spyOn(geom, '_addJoin');
      vi.spyOn(geom, '_addSegment');
    });

    afterEach(function() {
      vi.restoreAllMocks();
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

      expect(geom._addSegment).toHaveBeenCalledTimes(3);
      expect(geom._addCap).toHaveBeenCalledTimes(2);
      expect(geom._addJoin).toHaveBeenCalledTimes(2);
    });

    test('straight line', function() {
      geom.vertices.push(
        myp5.createVector(0, 0),
        myp5.createVector(0, 100),
        myp5.createVector(0, 200)
      );
      geom.edges.push([0, 1], [1, 2]);
      geom._edgesToVertices();

      expect(geom._addSegment).toHaveBeenCalledTimes(2);
      expect(geom._addCap).toHaveBeenCalledTimes(2);
      // No joins since the directions of each segment are the same
      expect(geom._addJoin).toHaveBeenCalledTimes(0);
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

      expect(geom._addSegment).toHaveBeenCalledTimes(2);
      expect(geom._addCap).toHaveBeenCalledTimes(4);
      expect(geom._addJoin).toHaveBeenCalledTimes(0);
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

      expect(geom._addSegment).toHaveBeenCalledTimes(4);
      expect(geom._addCap).toHaveBeenCalledTimes(0);
      expect(geom._addJoin).toHaveBeenCalledTimes(4);
    });

    test('calculateBoundingBox()', function() {
      geom.vertices.push(
        myp5.createVector(0, 0, 0),
        myp5.createVector(10, 20, 30),
        myp5.createVector(-5, 15, 25)
      );
      const boundingBox = geom.calculateBoundingBox();
      assert.deepEqual(boundingBox.min.array(), [-5, 0, 0]);
      assert.deepEqual(boundingBox.max.array(), [10, 20, 30]);
      assert.deepEqual(boundingBox.size.array(), [15, 20, 30]);
      assert.deepEqual(boundingBox.offset.array(), [2.5, 10, 15]);
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
      expect(geom._addSegment).toHaveBeenCalledTimes(3);
      expect(geom._addCap).toHaveBeenCalledTimes(2);
      expect(geom._addJoin).toHaveBeenCalledTimes(2);
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
      expect(geom._addSegment).toHaveBeenCalledTimes(3);
      expect(geom._addCap).toHaveBeenCalledTimes(2);
      expect(geom._addJoin).toHaveBeenCalledTimes(2);
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

      expect(geom._addSegment).toHaveBeenCalledTimes(2);
      expect(geom._addCap).toHaveBeenCalledTimes(4);
      expect(geom._addJoin).toHaveBeenCalledTimes(0);
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
        const regularImage = myp5._renderer.canvas.toDataURL();

        // Geometry mode
        myp5.fill(255);
        const geom = myp5.buildGeometry(drawGeometry);
        myp5.background(255);
        myp5.push();
        applyLights();
        myp5.model(geom);
        myp5.pop();
        myp5.resetShader();
        const geometryImage = myp5._renderer.canvas.toDataURL();

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
      }, [checkMaterials]);
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
        myp5.bezierOrder(2);
        myp5.bezierVertex(-20, -50);

        myp5.bezierVertex(-40, -70);
        myp5.bezierVertex(0, -60);
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
