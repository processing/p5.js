//@TODO: documentation of immediate mode

'use strict';

var p5 = require('../core/core');

//////////////////////////////////////////////
// _primitives2D in 3D space
//////////////////////////////////////////////

// @TODO REMOVE THIS!
// p5.Renderer3D.prototype._primitives2D = function(arr){
//   this._setDefaultCamera();
//   var gl = this.GL;
//   var shaderProgram = this._getColorVertexShader();

//   //create vertex buffer
//   gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

//   gl.bufferData(
//     gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
//   gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
//     3, gl.FLOAT, false, 0, 0);

//   //create vertexcolor buffer
//   var vertexColorBuffer = this.colorBuffer;
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

//   var color = this.curColor || [0.5, 0.5, 0.5, 1.0];
//   var colors = [];
//   for(var i = 0; i < arr.length / 3; i++){
//     colors = colors.concat(color);
//   }

//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
//   gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
//     4, gl.FLOAT, false, 0, 0);

//   //matrix
//   var mId = 'vertexColorVert|vertexColorFrag';
//   this._setMatrixUniforms(mId);
// };

p5.Renderer3D.prototype.beginShape = function(mode){
  this.shapeMode = mode;
  this.vertexStack.length = 0;
  return this;
};

p5.Renderer3D.prototype.vertex = function(x, y, z){
  this.vertexStack.push(x, y, z);
  return this;
};

p5.Renderer3D.prototype.endShape = function(){
  var gl = this.GL;
  this._primitives2D(this.vertexStack);
  this.vertexStack.length = 0;

  switch(this.shapeMode){
    case 'POINTS':
      gl.drawArrays(gl.POINTS, 0, 1);
      break;
    case 'LINES':
      gl.drawArrays(gl.LINES, 0, 2);
      break;
    case 'TRIANGLES':
      this._strokeCheck();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      break;
    case 'TRIANGLE_STRIP':
      this._strokeCheck();
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      break;
    default:
      this._strokeCheck();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      break;
  }
  return this;
};

//@TODO: implement stencil buffer for geometries.
//for now throw error.
p5.Renderer3D.prototype._strokeCheck = function(){
  if(this.drawMode === 'stroke'){
    throw new Error(
      'stroke for shapes in 3D not yet implemented, use fill for now :('
    );
  }
};

//@TODO
p5.Renderer3D.prototype.strokeWeight = function() {
  throw new Error('strokeWeight for 3d not yet implemented');
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////
p5.Renderer3D.prototype.stroke = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = color._normalize();
  this.curColor = colorNormalized;
  this.drawMode = 'stroke';
  return this;
};

p5.Renderer3D.prototype._getColorVertexShader = function(){
  var gl = this.GL;
  var mId = 'vertexColorVert|vertexColorFrag';
  var shaderProgram;

  if(!this.materialInHash(mId)){
    shaderProgram =
      this._initShaders('vertexColorVert', 'vertexColorFrag', true);
    this.mHash[mId] = shaderProgram;
    shaderProgram.vertexColorAttribute =
    gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  }else{
    shaderProgram = this.mHash[mId];
  }
  return shaderProgram;
};

module.exports = p5.Renderer3D;