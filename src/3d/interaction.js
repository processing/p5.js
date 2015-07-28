'use strict';

var p5 = require('../core/core');

//@TODO: fix this fake orbitControl
p5.prototype.orbitControl = function(){
  if(this.mouseIsPressed){
    this.rotateX((this.mouseX - this.width / 2) / (this.width / 2));
    this.rotateY((this.mouseY - this.height / 2) / (this.width / 2));
  }
  return this;
};

module.exports = p5;