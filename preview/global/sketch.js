const vertSrc = `#version 300 es
 precision mediump float;
 uniform mat4 uModelViewMatrix;
 uniform mat4 uProjectionMatrix;

 in vec3 aPosition;
 in vec2 aOffset;

 void main(){
   vec4 positionVec4 = vec4(aPosition.xyz, 1.0);
   positionVec4.xy += aOffset;
   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
 }
`;

const fragSrc = `#version 300 es
 precision mediump float;
 out vec4 outColor;
 void main(){
   outColor = vec4(0.0, 1.0, 1.0, 1.0);
 }
`;

let myShader;
function setup(){
  createCanvas(100, 100, WEBGL);

  // Create and use the custom shader.
  myShader = createShader(vertSrc, fragSrc);

  describe('A wobbly, cyan circle on a gray background.');
}

function draw(){
  // Set the styles
  background(125);
  noStroke();
  shader(myShader);

  // Draw the circle.
  beginShape();
  for (let i = 0; i < 30; i++){
    const x = 40 * cos(i/30 * TWO_PI);
    const y = 40 * sin(i/30 * TWO_PI);

    // Apply some noise to the coordinates.
    const xOff = 10 * noise(x + millis()/1000) - 5;
    const yOff = 10 * noise(y + millis()/1000) - 5;

    // Apply these noise values to the following vertex.
    vertexProperty('aOffset', [xOff, yOff]);
    vertex(x, y);
  }
  endShape(CLOSE);
}
