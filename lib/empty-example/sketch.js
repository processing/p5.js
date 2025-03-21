// Creates a small offscreen WEBGL p5.Graphics,
// compiles a shader on that graphics, and then copies
// that shader into the main WEBGL canvas context.
//
let vertSrc = `
precision highp float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
 vTexCoord = aTexCoord;
 vec4 positionVec4 = vec4(aPosition, 1.0);
 gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}
`;

let fragSrc = `
precision mediump float;
varying vec2 vTexCoord;

void main() {
 vec2 uv = vTexCoord;
 vec3 color = vec3(uv.x, uv.y, min(uv.x + uv.y, 1.0));
 gl_FragColor = vec4(color, 1.0);
}
`;

let copied;

function setup() {
 createCanvas(100, 100, WEBGL);
 let pg = createGraphics(25, 25, WEBGL);
 let original = pg.createShader(vertSrc, fragSrc);
 pg.shader(original);
 copied = original.copyToContext(p5.instance);
 shader(copied);
 describe('A rotating cube with a purple-blue gradient on its surface drawn against a gray background.');
}

function draw() {
 background(200);
 rotateX(frameCount * 0.01);
 rotateY(frameCount * 0.01);
 rotateZ(frameCount * 0.01);
 box(50);
}
