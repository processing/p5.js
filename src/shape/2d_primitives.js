(function(exports) {
	exports.arc = function() {
    // pend todo
  };
  exports.ellipse = function(a, b, c, d) {
    var vals = PHelper.modeAdjust(a, b, c, d, PVariables.ellipseMode);
    var kappa = 0.5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w,      // x-end
      ye = vals.y + vals.h,      // y-end
      xm = vals.x + vals.w / 2,  // x-middle
      ym = vals.y + vals.h / 2;  // y-middle
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(vals.x, ym);
    PVariables.curElement.context.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
    PVariables.curElement.context.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
    PVariables.curElement.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    PVariables.curElement.context.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
    PVariables.curElement.context.closePath();
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  };
  exports.line = function(x1, y1, x2, y2) {
    if (PVariables.curElement.context.strokeStyle === 'rgba(0,0,0,0)') {
      return;
    }
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.lineTo(x2, y2);
    PVariables.curElement.context.stroke();
  };
  exports.point = function(x, y) {
    var s = PVariables.curElement.context.strokeStyle;
    var f = PVariables.curElement.context.fillStyle;
    if (s === 'rgba(0,0,0,0)') {
      return;
    }
    x = Math.round(x);
    y = Math.round(y);
    PVariables.curElement.context.fillStyle = s;
    if (PVariables.curElement.context.lineWidth > 1) {
      PVariables.curElement.context.beginPath();
      PVariables.curElement.context.arc(x, y, PVariables.curElement.context.lineWidth / 2, 0, TWO_PI, false);
      PVariables.curElement.context.fill();
    } else {
      PVariables.curElement.context.fillRect(x, y, 1, 1);
    }
    PVariables.curElement.context.fillStyle = f;
  };
  exports.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.lineTo(x2, y2);
    PVariables.curElement.context.lineTo(x3, y3);
    PVariables.curElement.context.lineTo(x4, y4);
    PVariables.curElement.context.closePath();
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  };
  exports.rect = function(a, b, c, d) {
    var vals = PHelper.modeAdjust(a, b, c, d, PVariables.rectMode);
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.rect(vals.x, vals.y, vals.w, vals.h);
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  };
  exports.triangle = function(x1, y1, x2, y2, x3, y3) {
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.lineTo(x2, y2);
    PVariables.curElement.context.lineTo(x3, y3);
    PVariables.curElement.context.closePath();
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  }; 
}(window));
