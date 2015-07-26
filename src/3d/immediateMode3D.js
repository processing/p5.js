//@TODO: documentation of immediate mode

'use strict';

var p5 = require('../core/core');

//////////////////////////////////////////////
// Primitives2D in 3D space
//////////////////////////////////////////////

p5.Renderer3D.prototype.primitives2D = function(arr){

  var gl = this.GL;
  var shaderProgram = this.getColorVertexShader();

  //create vertice buffer
  var vertexPositionBuffer = this.verticeBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  //create vertexcolor buffer
  var vertexColorBuffer = this.colorBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var color = this.getCurColor();
  var colors = [];
  for(var i = 0; i < arr.length / 3; i++){
    colors = colors.concat(color);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
    4, gl.FLOAT, false, 0, 0);

  //matrix
  var mId = 'vertexColorVert|vertexColorFrag';
  this.setMatrixUniforms(mId);
};

//@TODO: point does not show up, gotta fix it.
p5.Renderer3D.prototype.point = function(x, y, z){
  var gl = this.GL;
  this.primitives2D([x, y, z]);
  gl.drawArrays(gl.POINTS, 0, 1);
  return this;
};

p5.Renderer3D.prototype.line = function(x1, y1, z1, x2, y2, z2){
  var gl = this.GL;
  this.primitives2D([x1, y1, z1, x2, y2, z2]);
  gl.drawArrays(gl.LINES, 0, 2);
  return this;
};

p5.Renderer3D.prototype.triangle = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3){
  var gl = this.GL;
  this.primitives2D([x1, y1, z1, x2, y2, z2, x3, y3, z3]);
  this._strokeCheck();
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  return this;
};

//@TODO: how to define the order of 4 points
p5.Renderer3D.prototype.quad = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4){
  var gl = this.GL;
  this.primitives2D(
    [x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4]);
  this._strokeCheck();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return this;
};

p5.Renderer3D.prototype.beginShape = function(mode){
  this.modeStack.push(mode);
  this.verticeStack = [];
  return this;
};

p5.Renderer3D.prototype.vertex = function(x, y, z){
  this.verticeStack.push(x, y, z);
  return this;
};

p5.Renderer3D.prototype.endShape = function(){
  var gl = this.GL;
  this.primitives2D(this.verticeStack);
  this.verticeStack = [];
  var mode = this.modeStack.pop();

  switch(mode){
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

//@TODO: figure out how to actually do stroke on shapes in 3D
p5.Renderer3D.prototype._strokeCheck = function(){
  var drawMode = this.drawModeStack[this.drawModeStack.length-1];
  if(drawMode === 'stroke'){
    throw new Error(
      'stroke for shapes in 3D not yet implemented, use fill for now :('
    );
  }
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////

p5.Renderer3D.prototype.fill = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = _normalizeColor(color.rgba);
  if( colorNormalized !== this.getCurColor()){
    this.colorStack.push(colorNormalized);
  }
  this.drawModeStack.push('fill');
  return this;
};

p5.Renderer3D.prototype.stroke = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = _normalizeColor(color.rgba);
  if( colorNormalized !== this.getCurColor()){
    this.colorStack.push(colorNormalized);
  }
  this.drawModeStack.push('stroke');
  return this;
};

p5.Renderer3D.prototype.getColorVertexShader = function(){
  var gl = this.GL;
  var mId = 'vertexColorVert|vertexColorFrag';
  var shaderProgram;
  if(!this.materialInHash(mId)){
    shaderProgram =
      this.initShaders('vertexColorVert', 'vertexColorFrag', true);
    shaderProgram.vertexColorAttribute =
    gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  }else{
    shaderProgram = this.mHash[mId];
  }
  return shaderProgram;
};

function _normalizeColor(_arr){
  var arr = [];
  _arr.forEach(function(val){
    arr.push(val/255);
  });
  return arr;
}

module.exports = p5.Renderer3D;