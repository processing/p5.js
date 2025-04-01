let myFont;

// function preload() {
//   // In p5.js, you can’t await loadFont in setup(), so we do it in preload.
// }

async function setup() {
    myFont = await loadFont('inconsolata.otf');
  createCanvas(200, 200);
  noLoop();
}

function draw() {
  background(220);

  // textToContours returns an array of contours,
  // where each contour is an array of { x, y, angle } points.
  textSize(50)
  let contours = myFont.textToContours("Hello", 50, 100);

  // Let's draw each contour as a closed shape.
  stroke(0);
  noFill();
  strokeWeight(2);

  for (let i = 0; i < contours.length; i++) {
    beginShape();
    for (let p of contours[i]) {
      // Each p is an object with { x, y, angle }
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  // You can see each letter’s outlines—each letter might have multiple contours
  // if it has an inner “hole” (like the inside of ‘o’ or ‘e’).
}
