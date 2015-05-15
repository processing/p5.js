/**
 * @description Default shaders for our WebGL context
 * @todo finish implementing our MVMatrix and Projection Matrix
 * so we can have fancy perspectives
 * like this: uPMatrix * uMVMatrix * clipSpace
 * clipspace conversion by http://games.greggman.com/
 */
define(function (require) {

  return {
    defaultVertShader: [
      'attribute vec3 a_VertexPosition;',
      //'attribute vec4 a_VertexColor;',
      'uniform vec3 u_resolution;',
      'uniform mat4 uMVMatrix;',
      'uniform mat4 uPMatrix;',
      //'varying vec4 v_Color;',
      'void main(void) {',
      // convert the rectangle from pixels to 0.0 to 1.0
      'vec3 zeroToOne = a_VertexPosition / u_resolution;',
      // convert from 0->1 to 0->2
      'vec3 zeroToTwo = zeroToOne * 2.0;',
      // convert from 0->2 to -1->+1 (clipspace)
      'vec3 clipSpace = zeroToTwo - 1.0;',
      'vec4 position = vec4(clipSpace * vec3(1, -1, 1), 1.0);',
      'gl_Position = uPMatrix * uMVMatrix * position;',
      //'gl_Position = uPMatrix * uMVMatrix * vec4(a_VertexPosition, 1.0);',
      //'v_Color = a_VertexColor;',
      '}'
    ].join('\n'),
    defaultGeoVertShader: [
      'attribute vec3 a_VertexPosition;',
      //'attribute vec4 a_VertexColor;',

      'uniform mat4 uMVMatrix;',
      'uniform mat4 uPMatrix;',

      //'varying vec4 vColor;',

      'void main(void) {',
      'gl_Position = uPMatrix * uMVMatrix * vec4(a_VertexPosition, 1.0);',
      //'vColor = aVertexColor;',
      '}'
    ].join('\n'),
    defaultColorVertShader: [
      'attribute vec3 a_VertexPosition;',
      'attribute vec4 a_VertexColor;',
      'uniform vec3 u_resolution;',
      //'uniform mat4 uMVMatrix;',
      //'uniform mat4 uPMatrix;',
      'varying vec4 v_Color;',
      'void main(void) {',
      // convert the rectangle from pixels to 0.0 to 1.0
      'vec3 zeroToOne = a_VertexPosition / u_resolution;',
      // convert from 0->1 to 0->2
      'vec3 zeroToTwo = zeroToOne * 2.0;',
      // convert from 0->2 to -1->+1 (clipspace)
      'vec3 clipSpace = zeroToTwo - 1.0;',
      'gl_Position = vec4(clipSpace * vec3(1, -1, 1), 1.0);',
      'v_Color = a_VertexColor;',
      '}'
    ].join('\n'),
    defaultFragShader: [
      'varying mediump vec4 v_Color;',
      'void main(void) {',
      'gl_FragColor = v_Color;',
      '}'
    ].join('\n'),
    materialFragShader: [
      'precision mediump float;',
      'uniform vec4 u_MaterialColor;',
      'void main(void) {',
      'gl_FragColor = u_MaterialColor;',
      '}'
    ].join('\n')
  };

});