// Click and drag the mouse to view the scene from different angles.

let shape;

// Load the file and create a p5.Geometry object.
async function setup() {
 await loadModel('teapot.obj', true, handleModel, handleError, '.obj');

  createCanvas(100, 100, WEBGL);

  describe('A white teapot drawn against a gray background.');
}

function draw() {
  background(200);

  // Enable orbiting with the mouse.
  orbitControl();

  // Draw the shape.
  model(shape);
}

// Set the shape variable and print the geometry's
// ID to the console.
function handleModel(data) {
  shape = data;
  console.log(shape.gid);
}

// Print an error message if the file doesn't load.
function handleError(error) {
  console.error('Oops!', error);
}