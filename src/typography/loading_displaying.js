define(function (require) {

  'use strict';

  var p5 = require('core');

  /*
    text(str, x, y)
    text(str, x1, y1, x2, y2)
  */
  p5.prototype.text = function() {

    this.curElement.context.font=this._textStyle+' '+this._textSize+'px '+this._textFont;

    if (arguments.length === 3) {

      this.curElement.context.fillText(arguments[0], arguments[1], arguments[2]);
      this.curElement.context.strokeText(arguments[0], arguments[1], arguments[2]);

    } else if (arguments.length === 5) {

      var words = arguments[0].split(' ');
      var line = '';
      var vals = this.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this.rectMode);

      vals.y += this.textLeading;

      for(var n = 0; n < words.length; n++) {

        var testLine = line + words[n] + ' ';
        var metrics = this.curElement.context.measureText(testLine);
        var testWidth = metrics.width;

        if (vals.y > vals.h) {

          break;

        } else if (testWidth > vals.w && n > 0) {

          this.curElement.context.fillText(line, vals.x, vals.y);
          this.curElement.context.strokeText(line, vals.x, vals.y);
          line = words[n] + ' ';
          vals.y += this.textLeading;

        } else {

          line = testLine;

        }
      }

      if (vals.y <= vals.h) {

        this.curElement.context.fillText(line, vals.x, vals.y);
        this.curElement.context.strokeText(line, vals.x, vals.y);
      }
    }
  };

  return p5;

});
