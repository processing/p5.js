let myShader;
p5.disableFriendlyErrors = true;
function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create and use the custom shader.
  myShader = baseMaterialShader().modify(
    () => {
      getWorldPosition((pos) => {
        let a = createVector3(1, 2, 3);
        let b = createVector3(3,4,5);
        a = a.add(b);

        let c = a.add(b);
        
        c.x = b.x.add(1).sin();
        pos = pos.add(c);

        return pos;
      })
    }
  );
}

function draw(){
  // Set the styles
  background(0)
}
