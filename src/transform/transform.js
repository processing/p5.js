(function(exports) {
  exports.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
    PVariables.curElement.context.transform(n00, n01, n02, n10, n11, n12);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [n00, n01, n02, n10, n11, n12]);
  };
  exports.popMatrix = function() { 
    PVariables.curElement.context.restore(); 
    PVariables.matrices.pop();
  };
  exports.printMatrix = function() {
    console.log(PVariables.matrices[PVariables.matrices.length-1]);
  };
  exports.pushMatrix = function() { 
    PVariables.curElement.context.save(); 
    PVariables.matrices.push([1,0,0,1,0,0]);
  };
  exports.resetMatrix = function() { 
    PVariables.curElement.context.setTransform();
    PVariables.matrices[PVariables.matrices.length-1] = [1,0,0,1,0,0]; 
  };
  exports.rotate = function(r) { 
    PVariables.curElement.context.rotate(r); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    var c = Math.cos(r);
    var s = Math.sin(r);
    var m11 = m[0] * c + m[2] * s;
    var m12 = m[1] * c + m[3] * s;
    var m21 = m[0] * -s + m[2] * c;
    var m22 = m[1] * -s + m[3] * c;
    m[0] = m11;
    m[1] = m12;
    m[2] = m21;
    m[3] = m22;
  };
  exports.scale = function() {
    var x = 1.0, y = 1.0;
    if (arguments.length == 1) {
      x = y = arguments[0];
    } else {
      x = arguments[0];
      y = arguments[1];
    }
    PVariables.curElement.context.scale(x, y); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m[0] *= x;
    m[1] *= x;
    m[2] *= y;
    m[3] *= y;
  };
  exports.shearX = function(angle) {
    PVariables.curElement.context.transform(1, 0, tan(angle), 1, 0, 0);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [1, 0, tan(angle), 1, 0, 0]);
  };
  exports.shearY = function(angle) {
    PVariables.curElement.context.transform(1, tan(angle), 0, 1, 0, 0);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [1, tan(angle), 0, 1, 0, 0]);
  };
  exports.translate = function(x, y) { 
    PVariables.curElement.context.translate(x, y); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m[4] += m[0] * x + m[2] * y;
    m[5] += m[1] * x + m[3] * y;
  };

}(window));