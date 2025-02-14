let myShader;
function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create and use the custom shader.
  myShader = baseMaterialShader().modify(
    () => {
      const x = createVector3(1, 2)

      getWorldPosition((pos) => {
        pos = pos.add(x);
        return pos;
      })
    }
  );
}

function draw(){
  // Set the styles
  background(0)
}
