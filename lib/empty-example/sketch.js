let myShader;

async function setup() {
  myShader = await loadFilterShader("shader.frag");
  createCanvas(100, 100, WEBGL);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(myShader);

  // rect gives us some geometry on the screen
  rect(-50, -50, width, height);
}