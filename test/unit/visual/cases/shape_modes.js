/*
  Helper function that draws a shape using the specified shape mode
  p5 ............... The p5 Instance
  shape ............ The shape to draw. Either 'ellipse', 'arc', or 'rect'
  mode ............. The ellipseMode (for ellipse and arc), or rectMode (for rect)
                     Either p5.CORNERS, p5.CORNER, p5.CENTER or p5.RADIUS
  x1, x2, x2, y2 ... Coordinates specifying the shape in CORNERS mode,
                     i.e. (x1, y1) and (x2, y2) specify two opposite corners P1 and P2
*/
function shapeCorners(p5, shape, mode, x1, y1, x2, y2) {
  // Adjust coordinates for testing modes other than CORNERS
  if (mode === p5.CORNER) {
    // Find top left corner
    let x = p5.min(x1, x2);  // x
    let y = p5.min(y1, y2);  // y
    // Calculate width and height
    // Don't use abs(), so we get negative values as well
    let w = x2 - x1; // w
    let h = y2 - y1; // h
    // With mode CORNER, rects with negative widths/heights result in mirrored/flipped rendering
    // In this case, adjust position so the rect is in line with the other cases
    if (shape === 'rect') {
      if (w < 0) { x += (-w); } // Move right
      if (h < 0) { y += (-h); } // Move down
    }
    x1 = x; y1 = y; x2 = w; y2 = h;
  } else if (mode === p5.CENTER) {
    // Find center
    let x = (x2 + x1) / 2; // x
    let y = (y2 + y1) / 2; // y
    // Calculate width and height
    // Don't use abs(), so we get negative values as well
    let w = x2 - x1;
    let h = y2 - y1;
    x1 = x; y1 = y; x2 = w; y2 = h;
  } else if (mode === p5.RADIUS) {
    // Find Center
    let x = (x2 + x1) / 2; // x
    let y = (y2 + y1) / 2; // y
    // Calculate radii
    // Don't use abs(), so we get negative values as well
    let r1 = (x2 - x1) / 2; // r1;
    let r2 = (y2 - y1) / 2; // r2
    x1 = x; y1 = y; x2 = r1; y2 = r2;
  }

  if (shape === 'ellipse') {
    p5.ellipseMode(mode);
    p5.ellipse(x1, y1, x2, y2);
  } else if (shape === 'arc') {
    // Draw four arcs with gaps inbetween
    const GAP = p5.radians(20);
    p5.ellipseMode(mode);
    p5.arc(x1, y1, x2, y2, 0 + GAP, p5.HALF_PI - GAP);
    p5.arc(x1, y1, x2, y2, p5.HALF_PI + GAP, p5.PI - GAP);
    p5.arc(x1, y1, x2, y2, p5.PI + GAP, p5.PI + p5.HALF_PI - GAP);
    p5.arc(x1, y1, x2, y2, p5.PI + p5.HALF_PI + GAP, p5.TWO_PI - GAP);
  } else if (shape === 'rect') {
    p5.rectMode(mode);
    p5.rect(x1, y1, x2, y2);
  }
}


visualSuite('Shape Modes', function(...args) {
  /*
    Comprehensive test for rendering ellipse(), arc(), and rect()
    with the different ellipseMode() / rectMode() values: CORNERS, CORNER, CENTER, RADIUS.
    Each of the 3 shapes is tested with each of the 4 possible modes, resulting in 12 tests.
    Each test renders the shape in 16 different coordinate configurations,
    testing combinations of positive and negative coordinate values.
  */

  // Shapes to test
  const SHAPES = [ 'ellipse', 'arc', 'rect' ];

  // Modes to test (used with ellipseMode or rectMode, according to shape)
  const MODES  = [ 'CORNERS', 'CORNER', 'CENTER', 'RADIUS' ];

  for (let shape of SHAPES) {
    visualSuite(`Shape ${shape}`, function() {

      for (let mode of MODES) {
        visualTest(`Mode ${mode}`, function(p5, screenshot) {
          p5.createCanvas(60, 125);
          p5.translate(p5.width/2, p5.height/2);

          // Make the following calls to shapeCorners shorter
          // by omitting p5, shape and mode parameters
          function _shapeCorners(x1, y1, x2, y2) {
            shapeCorners(p5, shape, p5[mode], x1, y1, x2, y2);
          }

          // Quadrant I (Bottom Right)
          //              P1      P2
          _shapeCorners( 5,  5, 25, 15); // P1 Top Left,     P2 Bottom Right
          _shapeCorners( 5, 20, 25, 30); // P1 Bottom Left,  P2 Top Right
          _shapeCorners(25, 45,  5, 35); // P1 Bottom Right, P2 Top Left
          _shapeCorners(25, 50,  5, 60); // P1 Top Right,    P2 Bottom Left

          // Quadrant II (Bottom Left)
          _shapeCorners(-25,  5,  -5, 15);
          _shapeCorners(-25, 20,  -5, 30);
          _shapeCorners( -5, 45, -25, 35);
          _shapeCorners( -5, 50, -25, 60);

          // Quadrant III (Top Left)
          _shapeCorners(-25, -60,  -5, -50);
          _shapeCorners(-25, -35,  -5, -45);
          _shapeCorners( -5, -20, -25, -30);
          _shapeCorners( -5, -15, -25,  -5);

          // Quadrant IV (Top Right)
          _shapeCorners( 5, -60, 25, -50);
          _shapeCorners( 5, -35, 25, -45);
          _shapeCorners(25, -20,  5, -30);
          _shapeCorners(25, -15,  5,  -5);

          screenshot();
        }); // End of: visualTest
      } // End of: MODES loop

    }); // End of: visualSuite
  } // End of: SHAPES loop


  /*
    An extra test suite specific to shape mode CORNER and negative dimensions.
    For rect, negative widths/heights result in flipped rendering (horizontally/vertically)
    For ellipse and arc, using negative widths/heights has no effect (the absolute value is used)
  */
  visualSuite('Negative dimensions', function() {
    // Negative widths/height result in flipped rects.
    visualTest('rect', function(p5, screenshot) {
      p5.createCanvas(50, 50);
      p5.translate(p5.width/2, p5.height/2);
      p5.rectMode(p5.CORNER);
      p5.rect(0, 0,  20,  10);
      p5.fill('red');
      p5.rect(0, 0, -20,  10);
      p5.fill('green');
      p5.rect(0, 0,  20, -10);
      p5.fill('blue');
      p5.rect(0, 0, -20, -10);
      screenshot();
    });
    // Since negative widths/heights are used with their absolute value,
    // ellipses are drawn on top of each other, blue one last
    visualTest('ellipse', function(p5, screenshot) {
      p5.createCanvas(50, 50);
      p5.translate(p5.width/2, p5.height/2);
      p5.ellipseMode(p5.CORNER);
      p5.ellipse(0, 0,  20,  10);
      p5.fill('red');
      p5.ellipse(0, 0, -20,  10);
      p5.fill('green');
      p5.ellipse(0, 0,  20, -10);
      p5.fill('blue');
      p5.ellipse(0, 0, -20, -10);
      screenshot();
    });
    // Since negative widths/heights are used with their absolute value,
    // arcs are drawn on top of each other, blue one last.
    visualTest('arc', function(p5, screenshot) {
      p5.createCanvas(50, 50);
      p5.translate(p5.width/2, p5.height/2);
      p5.ellipseMode(p5.CORNER);
      p5.arc(0, 0,  20,  10, 0, p5.PI + p5.HALF_PI);
      p5.fill('red');
      p5.arc(0, 0, -20,  10, 0, p5.PI + p5.HALF_PI);
      p5.fill('green');
      p5.arc(0, 0,  20, -10, 0, p5.PI + p5.HALF_PI);
      p5.fill('blue');
      p5.arc(0, 0, -20, -10, 0, p5.PI + p5.HALF_PI);
      screenshot();
    });
  });

});
