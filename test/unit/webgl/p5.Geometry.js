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
});
