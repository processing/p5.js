'use strict';

var p5 = require('../core/core');


p5.prototype.ambientLight = function(){

  var gl = this._graphics.GL;
  var shaderProgram = this._graphics.getShader('ambientVert', 'lightFrag');

  gl.useProgram(shaderProgram);

  // var color = this._graphics._pInst.color.apply(
  //   this._graphics._pInst, arguments);
  // var colors = _normalizeColor(color.rgba);



  return this;

};

p5.prototype.directionalLight = function() {
  // body...
};

p5.prototype.pointLight = function() {
  // body...
};

// function _normalizeColor(_arr){
//   var arr = [];
//   _arr.forEach(function(val){
//     arr.push(val/255);
//   });
//   return arr;
// }

module.exports = p5;
