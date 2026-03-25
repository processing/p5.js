p5.Vector.prototype.setHeading = function(heading) {
  if (typeof heading !== 'number') {
    throw new Error('setHeading() expects a numeric heading value');
  }
  if (this.dim() !== 2) {
    throw new Error('setHeading() only supports 2D vectors');
  }
  const magnitude = this.mag();
  this.x = magnitude * Math.cos(heading);
  this.y = magnitude * Math.sin(heading);
  return this;
};