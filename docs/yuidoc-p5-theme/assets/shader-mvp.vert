/* This is a modification of a shader by Adam Ferriss
   https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/6_3d/6-1_rectangle
*/

// Get the vertex position attribute of the geometry
attribute vec3 aPosition;

// Get the texture coordinate attribute of the geometry
attribute vec2 aTexCoord;


/* When we use 3d geometry, we need to also use some builtin variables
   that p5 provides.
   Most 3d engines will provide these variables for you.
   They are 4x4 matrices that define the camera position / rotation,
   and the geometry position / rotation / scale.

   There are actually 3 matrices (model, view, projection), but
   two of them have already been combined into a single one (modelView).
   This pre combination is an optimization trick so that the vertex
   shader doesn't have to do as much work.
*/

/* uProjectionMatrix is used to convert the 3d world coordinates into
   screen coordinates
*/
uniform mat4 uProjectionMatrix;

/* uModelViewMatrix is a combination of the model matrix and the
   view matrix

   The model matrix defines the object position / rotation / scale.
   Multiplying uModelMatrix * vec4(aPosition, 1.0) would move the
   object into it's world position.

   The view matrix defines attributes about the camera, such as
   focal length and camera position.
   Multiplying uModelViewMatrix * vec4(aPosition, 1.0) would move the
   object into its world position in front of the camera.
*/
uniform mat4 uModelViewMatrix;

/* This is a variable that will be shared with the fragment shader.
   We will assign the attribute aTexCoord to the varying vTexCoord to
   move it from the vertex shader to the fragment shader.
   It can be called whatever you want, but ofter people prefix it
   with 'v' to indicate that it is a varying.
*/
varying vec2 vTexCoord;

void main() {

  // Send the texture coordinates to the fragment shader
  vTexCoord = aTexCoord;

  // Copy the position data into a vec4, using 1.0 as the w component
  vec4 position = vec4(aPosition, 1.0);

  /* Move our vertex positions into screen space.

     The order of multiplication is always,
       projection * view * model * position
     In this case model and view have been combined so we just do,
       projection * modelView * position
  */
  gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}
