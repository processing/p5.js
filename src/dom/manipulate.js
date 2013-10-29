(function(exports) {
  exports.createGraphics = function(w, h, isDefault, targetID) {
    //console.log('create canvas');
    var c = document.createElement('canvas');
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    if (isDefault) {
      c.id = 'defaultCanvas';
      document.body.appendChild(c);      
    } else { // remove the default canvas if new one is created
      var defaultCanvas = document.getElementById('defaultCanvas');
      if (defaultCanvas) {
        defaultCanvas.parentNode.removeChild(defaultCanvas);
      }
      if (targetID) {
        target = document.getElementById(targetID);
        if (target) target.appendChild(c);    
        else document.body.appendChild(c);
      } else {
        document.body.appendChild(c);
      } 
    }

    var cnv =  new PElement(c);
    context(cnv);
    PHelper.applyDefaults();
    PHelper.setupInput();

    return cnv;
  };
  exports.createHTML = function(html) {
    var elt = document.createElement('div');
    elt.innerHTML = html;
    document.body.appendChild(elt);
    c =  new PElement(elt);
    context(c);
    return c;
  };
  exports.createHTMLImage = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    c =  new PElement(elt);
    context(c);
    return c;
  };

  exports.find = function(e) {
    var res = document.getElementById(e);
    if (res) return [new PElement(res)];
    else {
      res = document.getElementsByClassName(e);
      if (res) {
        var arr = [];
        for(var i = 0, resl = res.length; i != resl; arr.push(new PElement(res[i++])));
        return arr;
      }  
    }
    return [];
  };
  
  exports.context = function(e) {
    var obj;
    if (typeof e == 'string' || e instanceof String) {
      var elt = document.getElementById(e);
      obj = elt ? new PElement(elt) : null;
    } else obj = e;
    //console.log(obj)
    if (typeof obj !== 'undefined') {
      PVariables.curElement = obj;
      width = obj.elt.offsetWidth;
      height = obj.elt.offsetHeight;
      //console.log(width, height)
      if (typeof PVariables.curElement.context !== 'undefined') PVariables.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
      
      if (-1 < PVariables.curSketchIndex && PVariables.sketchCanvases.length <= PVariables.curSketchIndex) {
        PVariables.sketchCanvases[PVariables.curSketchIndex] = PVariables.curElement;
      }
    }
  };

}(window));
