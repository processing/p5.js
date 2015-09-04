'use strict';

var p5 = require('../core/core');

//@TODO: implement full orbit controls including
//pan, zoom, quaternion rotation, etc.
p5.prototype.orbitControl = function(){
  if(this.mouseIsPressed){
    this.rotateY((this.mouseX - this.width / 2) / (this.width / 2));
    this.rotateX((this.mouseY - this.height / 2) / (this.width / 2));
  }
  return this;
};

module.exports = p5;