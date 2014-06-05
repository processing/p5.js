var p5DOM = (function(){
  return {
    getElement: function (e) {
      var res = document.getElementById(e);
      if (res) {
        return new p5.PElement(res);
      } else {
        return null;
      }
    },

    getElements: function (e) {
      var arr = [];
      var res = document.getElementsByClassName(e);
      if (res) {
        for (var j = 0; j < res.length; j++) {
          var obj = new p5.PElement(res[j]);
          arr.push(obj);
        }
      }
      return arr;
    },

    createDiv: function(text) {
      var elt = document.createElement('div');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createP: function(text) {
      var elt = document.createElement('p');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createSpan: function(text) {
      var elt = document.createElement('span');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createH1: function(text) {
      var elt = document.createElement('h1');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createH2: function(text) {
      var elt = document.createElement('h2');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createH3: function(text) {
      var elt = document.createElement('h3');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createH4: function(text) {
      var elt = document.createElement('h4');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createH5: function(text) {
      var elt = document.createElement('h5');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createH6: function(text) {
      var elt = document.createElement('h6');
      elt.innerHTML = text;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    },

    createImg: function(src, alt) {
      var elt = document.createElement('img');
      elt.src = src;
      if (typeof alt !== 'undefined') {
        elt.alt = alt;
      }
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;  
    },

    createA: function(href, html, target) {
      var elt = document.createElement('a');
      elt.href = href;
      elt.innerHTML = html;
      if (target) elt.target = target;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;  
    },

    /** INPUT **/
    createSlider: function(min, max, value) {
      var elt = document.createElement('input');
      elt.type = 'range';
      elt.min = min;
      elt.max = max;
      if (value) elt.value = value;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      // value() with no arguments returns current value
      // with argument, sets value
      c.value = function() { 
        if (arguments.length > 0) {
          this.elt.value = arguments[0];
        } else {
          return this.elt.value;
        }
      };
      return c;  
    },

    createButton: function(label, value) {
      var elt = document.createElement('button');
      elt.innerHTML = label;
      elt.value = value;
      if (value) elt.value = value;
      document.body.appendChild(elt);
      var c = new p5.PElement(elt);
      // value() with no arguments returns current value
      // with argument, sets value
      c.value = function() { 
        if (arguments.length > 0) {
          this.elt.value = arguments[0];
        } else {
          return this.elt.value;
        }
      };
      return c;  
    },

    
  }
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

