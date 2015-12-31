//@TODO: documentation of immediate mode

'use strict';

var p5 = require('../core/core');

//////////////////////////////////////////////
// _primitives2D in 3D space
//////////////////////////////////////////////

p5.Renderer3D.prototype._primitives2D = function(arr){
  this._setDefaultCamera();
  var gl = this.GL;
  var shaderProgram = this._getColorVertexShader();

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
  var color = this._getCurColor();
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

p5.Renderer3D.prototype.point = function(x, y, z){
  var gl = this.GL;
  this._primitives2D([x, y, z]);
  gl.drawArrays(gl.POINTS, 0, 1);
  return this;
};

p5.Renderer3D.prototype.line = function(x1, y1, z1, x2, y2, z2){
  var gl = this.GL;
  this._primitives2D([x1, y1, z1, x2, y2, z2]);
  gl.drawArrays(gl.LINES, 0, 2);
  return this;
};

p5.Renderer3D.prototype.triangle = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3){
  var gl = this.GL;
  this._primitives2D([x1, y1, z1, x2, y2, z2, x3, y3, z3]);
  this._strokeCheck();
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  return this;
};

//@TODO: how to define the order of 4 points
p5.Renderer3D.prototype.quad = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4){
  var gl = this.GL;
  this._primitives2D(
    [x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4]);
  this._strokeCheck();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return this;
};

p5.Renderer3D.prototype.beginShape = function(mode){
  this.shapeMode = mode;
  this.verticeStack = [];
  return this;
};

p5.Renderer3D.prototype.vertex = function(x, y, z){
  this.verticeStack.push(x, y, z);
  return this;
};

p5.Renderer3D.prototype.endShape = function(){
  var gl = this.GL;
  var NewVerticeStack=[];
  var x, y, i, j;
  var verticeStackLength=this.verticeStack.length;
  if(this.shapeMode!=='POINTS' && this.shapeMode!=='LINES' &&
  this.shapeMode!=='TRIANGLES' && this.shapeMode!=='TRIANGLE_STRIP'){
    for(i=0; i<verticeStackLength; i=i+3){
      x=i%verticeStackLength;
      for(j=0; j<verticeStackLength; j=j+3){
        y=j%verticeStackLength;
        if((x%verticeStackLength)!==y && (x+3)%verticeStackLength!==y){
          NewVerticeStack.push(this.verticeStack[x%verticeStackLength],
            this.verticeStack[(x+1)%verticeStackLength],
            this.verticeStack[(x+2)%verticeStackLength]);
          NewVerticeStack.push(this.verticeStack[(x+3)%verticeStackLength],
            this.verticeStack[(x+4)%verticeStackLength],
            this.verticeStack[(x+5)%verticeStackLength]);
          NewVerticeStack.push(this.verticeStack[y%verticeStackLength],
            this.verticeStack[(y+1)%verticeStackLength],
            this.verticeStack[(y+2)%verticeStackLength]);
        }
        else{
        }
      }
    }
    this._primitives2D(NewVerticeStack);
    this._strokeCheck();
    gl.drawArrays(gl.TRIANGLES, 0, (NewVerticeStack.length)/3);
  }
  else{
    verticeStackLength=verticeStackLength/3;
    this._primitives2D(this.verticeStack);
    switch(this.shapeMode){
      case 'POINTS':
        gl.drawArrays(gl.POINTS, 0, verticeStackLength);
        break;
      case 'LINES':
        gl.drawArrays(gl.LINES, 0, verticeStackLength);
        break;
      case 'TRIANGLES':
        this._strokeCheck();
        gl.drawArrays(gl.TRIANGLES, 0, verticeStackLength);
        break;
      case 'TRIANGLE_STRIP':
        this._strokeCheck();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticeStackLength);
        break;
      default:
        this._strokeCheck();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticeStackLength);
        break;
    }
  }

  this.verticeStack = [];
  return this;
};


/*
p5.Renderer3D.prototype.endShape = function(){
  var gl = this.GL;
  this._primitives2D(this.verticeStack);
  var verticeStackLength=this.verticeStack.length;
  verticeStackLength=verticeStackLength/3;
  switch(this.shapeMode){
    case 'POINTS':
      gl.drawArrays(gl.POINTS, 0, verticeStackLength);
      break;
    case 'LINES':
      gl.drawArrays(gl.LINES, 0, verticeStackLength);
      break;
    case 'TRIANGLES':
      this._strokeCheck();
      gl.drawArrays(gl.TRIANGLES, 0, verticeStackLength);
      break;
    case 'TRIANGLE_STRIP':
      this._strokeCheck();
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticeStackLength);
      break;
    default:
      this._strokeCheck();
      gl.drawArrays(gl.TRIANGLES, 0, verticeStackLength);
      break;
  }
  this.verticeStack = [];
  return this;
};

*/
//@TODO: figure out how to actually do stroke on shapes in 3D
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

p5.Renderer3D.prototype.fill = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = color._array;
  this.curColor = colorNormalized;
  this.drawMode = 'fill';
  return this;
};

p5.Renderer3D.prototype.stroke = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = color._array;
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
      this.initShaders('vertexColorVert', 'vertexColorFrag', true);
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
