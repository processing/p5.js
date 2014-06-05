var p5DOM = (function(){

  var self = {};

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

  self.getElement = function (e) {
    var res = document.getElementById(e);
    if (res) {
      return new p5.PElement(res);
    } else {
      return null;
    }
  };

  self.getElements = function (e) {
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

  ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(tag) {
    var method = 'create' + tag.charAt(0).toUpperCase() + tag.slice(1);
    self[method] = function(html) {
      console.log(tag)
      var elt = document.createElement(tag);
      elt.innerHTML = html;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    }
  });

  self.createImg = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  self.createA = function(href, html, target) {
    var elt = document.createElement('a');
    elt.href = href;
    elt.innerHTML = html;
    if (target) elt.target = target;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  /** INPUT **/
  self.createSlider = function(min, max, value) {
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (value) elt.value = value;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  self.createButton = function(label, value) {
    var elt = document.createElement('button');
    elt.innerHTML = label;
    elt.value = value;
    if (value) elt.value = value;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  self.createInput = function(value) {
    var elt = document.createElement('input');
    elt.type = 'text';
    if (value) elt.value = value;
    document.body.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  return self;


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

