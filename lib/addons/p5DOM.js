var p5DOM = (function(){

  // Extending PElement and adding some more features

  // value() with no arguments returns current value
  // with argument, sets value
  p5.PElement.prototype.value = function() { 
    if (arguments.length > 0) {
      this.elt.value = arguments[0];
    } else {
      return this.elt.value;
    }
  };

  // Extending p5 and adding some more methods
  p5.prototype.getElement = function (e) {
    var res = document.getElementById(e);
    if (res) {
      return new p5.PElement(res);
    } else {
      return null;
    }
  };

  p5.prototype.getElements = function (e) {
    var arr = [];
    var res = document.getElementsByClassName(e);
    if (res) {
      for (var j = 0; j < res.length; j++) {
        var obj = new p5.PElement(res[j]);
        arr.push(obj);
      }
    }
    return arr;
  };

  var tags = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  tags.forEach(function(tag) {
    var method = 'create' + tag.charAt(0).toUpperCase() + tag.slice(1);
    p5.prototype[method] = function(html) {
      var elt = document.createElement(tag);
      elt.innerHTML = html;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    }
  });

  p5.prototype.createImg = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  p5.prototype.createA = function(href, html, target) {
    var elt = document.createElement('a');
    elt.href = href;
    elt.innerHTML = html;
    if (target) elt.target = target;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  /** INPUT **/
  p5.prototype.createSlider = function(min, max, value) {
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (value) elt.value = value;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  p5.prototype.createButton = function(label, value) {
    var elt = document.createElement('button');
    elt.innerHTML = label;
    elt.value = value;
    if (value) elt.value = value;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  p5.prototype.createInput = function(value) {
    var elt = document.createElement('input');
    elt.type = 'text';
    if (value) elt.value = value;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  /** VIDEO STUFF **/
  p5.prototype.createVideo = function(src) {
    var elt = document.createElement('video');
    elt.src = src;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    c.play = function() {
      c.elt.play();
    };
    c.loop = function(val) {
      c.elt.setAttribute('loop', val);
    };
    return c;  
  };

  p5.prototype.video = function(v, x, y, w, h, c) {
    this.curElement.context.drawImage(v.elt, x, y, w, h);
  };

})();





  // p5.prototype.getId = function (e) {
  //   for (var i = 0; i < _elements.length; i++) {
  //     if (_elements[i].elt.id === e) {
  //       return _elements[i];
  //     }
  //   }
  //   var res = document.getElementById(e);
  //   if (res) {
  //     var obj = new PElement(res);
  //     _elements.push(obj);
  //     return obj;
  //   } else {
  //     return null;
  //   }
  // };
  // p5.prototype.getClass = function (e) {
  //   console.log(_elements);
  //   var arr = [];
  //   for (var i = 0; i < _elements.length; i++) {
  //     if (_elements[i].elt.className.split(' ').indexOf(e) !== -1) {
  //       arr.push(_elements[i]);
  //     }
  //   }

  //   if (arr.length === 0) {
  //     var res = document.getElementsByClassName(e);
  //     if (res) {
  //       for (var j = 0; j < res.length; j++) {
  //         var obj = new PElement(res[j]);
  //         _elements.push(obj);
  //         arr.push(obj);
  //       }
  //     }
  //   }
  //   return arr;
  // };

