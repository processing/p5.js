// casey conchinha - @kcconch ( https://github.com/kcconch )
// louise lessel - @louiselessel ( https://github.com/louiselessel )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/
// this is a modification of a shader by adam ferriss
// https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/2_texture-coordinates/2-1_basic

/* WebGL requires that the first line of the fragment shader
   specify the precision.
   Precision is dependent on the the device.
   Sometimes you'll see bugs if you use lowp so stick to mediump or highp.
*/
precision mediump float;

/* Get the texture coordinates from the vertex shader.
   This is the same variable we declared in the vertex shader.
   We need to declare it here too!
*/
varying vec2 vTexCoord;

void main() {

  vec2 uv = vTexCoord;

  // Flip uv.y
  // uv.y = 1.0 - uv.y;

  /* Use the texture coordinates to generate a color.

     The red component is mapped to the x value (0 to 1).
     The green component is mapped to the y value (0 to 1).
     The blue component is mapped to the value of x + y (0 to 2).
  */
  vec3 color = vec3(
    uv.x,
    uv.y,
    min(uv.x + uv.y, 1.0)
  );

  // Assign the color to be output to the screen
  gl_FragColor = vec4(color, 1.0);
}
