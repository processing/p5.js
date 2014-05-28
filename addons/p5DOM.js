function p5DOM(p5Instance) {
  this.p5 = p5Instance;
}

p5DOM.prototype.createDiv = function(text) {
  var elt = document.createElement('div');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createP = function(text) {
  var elt = document.createElement('p');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createSpan = function(text) {
  var elt = document.createElement('span');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createH1 = function(text) {
  var elt = document.createElement('h1');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createH2 = function(text) {
  var elt = document.createElement('h2');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createH3 = function(text) {
  var elt = document.createElement('h3');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createH4 = function(text) {
  var elt = document.createElement('h4');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createH5 = function(text) {
  var elt = document.createElement('h5');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createH6 = function(text) {
  var elt = document.createElement('h6');
  elt.innerHTML = text;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;
};

p5DOM.prototype.createImg = function(src, alt) {
  var elt = document.createElement('img');
  elt.src = src;
  if (typeof alt !== 'undefined') {
    elt.alt = alt;
  }
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;  
};

p5DOM.prototype.createA = function(href, html, target) {
  var elt = document.createElement('a');
  elt.href = href;
  elt.innerHTML = html;
  if (target) elt.target = target;
  document.body.appendChild(elt);
  var c =  new PElement(elt, this);
  this.p5._elements.push(c);
  return c;  
};



  // p5.prototype.getId = function (e) {
  //   for (var i = 0; i < this._elements.length; i++) {
  //     if (this._elements[i].elt.id === e) {
  //       return this._elements[i];
  //     }
  //   }
  //   var res = document.getElementById(e);
  //   if (res) {
  //     var obj = new PElement(res, this);
  //     this._elements.push(obj);
  //     return obj;
  //   } else {
  //     return null;
  //   }
  // };
  // p5.prototype.getClass = function (e) {
  //   console.log(this._elements);
  //   var arr = [];
  //   for (var i = 0; i < this._elements.length; i++) {
  //     if (this._elements[i].elt.className.split(' ').indexOf(e) !== -1) {
  //       arr.push(this._elements[i]);
  //     }
  //   }

  //   if (arr.length === 0) {
  //     var res = document.getElementsByClassName(e);
  //     if (res) {
  //       for (var j = 0; j < res.length; j++) {
  //         var obj = new PElement(res[j], this);
  //         this._elements.push(obj);
  //         arr.push(obj);
  //       }
  //     }
  //   }
  //   return arr;
  // };

