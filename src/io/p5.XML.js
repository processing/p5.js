/**
 * @module IO
 * @submodule XML
 * @requires core
 */

'use strict';

import p5 from '../core/main';

/**
 * XML is a representation of an XML object, able to parse XML code. Use
 * <a href="#/p5/loadXML">loadXML()</a> to load external XML files and create XML objects.
 *
 * @class p5.XML
 * @constructor
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let children = xml.getChildren('animal');
 *
 *   for (let i = 0; i < children.length; i++) {
 *     let id = children[i].getNum('id');
 *     let coloring = children[i].getString('species');
 *     let name = children[i].getContent();
 *     print(id + ', ' + coloring + ', ' + name);
 *   }
 * }
 *
 * // Sketch prints:
 * // 0, Capra hircus, Goat
 * // 1, Panthera pardus, Leopard
 * // 2, Equus zebra, Zebra
 * </code></div>
 *
 * @alt
 * no image displayed
 *
 */
p5.XML = function(DOM) {
  if (!DOM) {
    var xmlDoc = document.implementation.createDocument(null, 'doc');
    this.DOM = xmlDoc.createElement('root');
  } else {
    this.DOM = DOM;
  }
};

/**
 * Gets a copy of the element's parent. Returns the parent as another
 * <a href="#/p5.XML">p5.XML</a> object.
 *
 * @method getParent
 * @return {p5.XML}   element parent
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let children = xml.getChildren('animal');
 *   let parent = children[1].getParent();
 *   print(parent.getName());
 * }
 *
 * // Sketch prints:
 * // mammals
 * </code></div>
 */
p5.XML.prototype.getParent = function() {
  return new p5.XML(this.DOM.parentElement);
};

/**
 *  Gets the element's full name, which is returned as a String.
 *
 * @method getName
 * @return {String} the name of the node
 * @example&lt;animal
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   print(xml.getName());
 * }
 *
 * // Sketch prints:
 * // mammals
 * </code></div>
 */
p5.XML.prototype.getName = function() {
  return this.DOM.tagName;
};

/**
 * Sets the element's name, which is specified as a String.
 *
 * @method setName
 * @param {String} the new name of the node
 * @example&lt;animal
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   print(xml.getName());
 *   xml.setName('fish');
 *   print(xml.getName());
 * }
 *
 * // Sketch prints:
 * // mammals
 * // fish
 * </code></div>
 */
p5.XML.prototype.setName = function(name) {
  var content = this.DOM.innerHTML;
  var attributes = this.DOM.attributes;
  var xmlDoc = document.implementation.createDocument(null, 'default');
  var newDOM = xmlDoc.createElement(name);
  newDOM.innerHTML = content;
  for (var i = 0; i < attributes.length; i++) {
    newDOM.setAttribute(attributes[i].nodeName, attributes.nodeValue);
  }
  this.DOM = newDOM;
};

/**
 * Checks whether or not the element has any children, and returns the result
 * as a boolean.
 *
 * @method hasChildren
 * @return {boolean}
 * @example&lt;animal
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   print(xml.hasChildren());
 * }
 *
 * // Sketch prints:
 * // true
 * </code></div>
 */
p5.XML.prototype.hasChildren = function() {
  return this.DOM.children.length > 0;
};

/**
 * Get the names of all of the element's children, and returns the names as an
 * array of Strings. This is the same as looping through and calling <a href="#/p5.XML/getName">getName()</a>
 * on each child element individually.
 *
 * @method listChildren
 * @return {String[]} names of the children of the element
 * @example&lt;animal
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   print(xml.listChildren());
 * }
 *
 * // Sketch prints:
 * // ["animal", "animal", "animal"]
 * </code></div>
 */
p5.XML.prototype.listChildren = function() {
  var arr = [];
  for (var i = 0; i < this.DOM.childNodes.length; i++) {
    arr.push(this.DOM.childNodes[i].nodeName);
  }
  return arr;
};

/**
 * Returns all of the element's children as an array of <a href="#/p5.XML">p5.XML</a> objects. When
 * the name parameter is specified, then it will return all children that match
 * that name.
 *
 * @method getChildren
 * @param {String} [name] element name
 * @return {p5.XML[]} children of the element
 * @example&lt;animal
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let animals = xml.getChildren('animal');
 *
 *   for (let i = 0; i < animals.length; i++) {
 *     print(animals[i].getContent());
 *   }
 * }
 *
 * // Sketch prints:
 * // "Goat"
 * // "Leopard"
 * // "Zebra"
 * </code></div>
 */
p5.XML.prototype.getChildren = function(param) {
  if (param) {
    return elementsToP5XML(this.DOM.getElementsByTagName(param));
  } else {
    return elementsToP5XML(this.DOM.children);
  }
};

function elementsToP5XML(elements) {
  var arr = [];
  for (var i = 0; i < elements.length; i++) {
    arr.push(new p5.XML(elements[i]));
  }
  return arr;
}

/**
 * Returns the first of the element's children that matches the name parameter
 * or the child of the given index.It returns undefined if no matching
 * child is found.
 *
 * @method getChild
 * @param {String|Integer} name element name or index
 * @return {p5.XML}
 * @example&lt;animal
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.getContent());
 * }
 *
 * // Sketch prints:
 * // "Goat"
 * </code></div>
 * <div class='norender'><code>
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let secondChild = xml.getChild(1);
 *   print(secondChild.getContent());
 * }
 *
 * // Sketch prints:
 * // "Leopard"
 * </code></div>
 */
p5.XML.prototype.getChild = function(param) {
  if (typeof param === 'string') {
    for (var i = 0; i < this.DOM.children.length; i++) {
      var child = this.DOM.children[i];
      if (child.tagName === param) return new p5.XML(child);
    }
  } else {
    return new p5.XML(this.DOM.children[param]);
  }
};

/**
 * Appends a new child to the element. The child can be specified with
 * either a String, which will be used as the new tag's name, or as a
 * reference to an existing <a href="#/p5.XML">p5.XML</a> object.
 * A reference to the newly created child is returned as an <a href="#/p5.XML">p5.XML</a> object.
 *
 * @method addChild
 * @param {p5.XML} node a <a href="#/p5.XML">p5.XML</a> Object which will be the child to be added
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let child = new p5.XML();
 *   child.setName('animal');
 *   child.setAttribute('id', '3');
 *   child.setAttribute('species', 'Ornithorhynchus anatinus');
 *   child.setContent('Platypus');
 *   xml.addChild(child);
 *
 *   let animals = xml.getChildren('animal');
 *   print(animals[animals.length - 1].getContent());
 * }
 *
 * // Sketch prints:
 * // "Goat"
 * // "Leopard"
 * // "Zebra"
 * </code></div>
 */
p5.XML.prototype.addChild = function(node) {
  if (node instanceof p5.XML) {
    this.DOM.appendChild(node.DOM);
  } else {
    // PEND
  }
};

/**
 * Removes the element specified by name or index.
 *
 * @method removeChild
 * @param {String|Integer} name element name or index
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   xml.removeChild('animal');
 *   let children = xml.getChildren();
 *   for (let i = 0; i < children.length; i++) {
 *     print(children[i].getContent());
 *   }
 * }
 *
 * // Sketch prints:
 * // "Leopard"
 * // "Zebra"
 * </code></div>
 * <div class='norender'><code>
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   xml.removeChild(1);
 *   let children = xml.getChildren();
 *   for (let i = 0; i < children.length; i++) {
 *     print(children[i].getContent());
 *   }
 * }
 *
 * // Sketch prints:
 * // "Goat"
 * // "Zebra"
 * </code></div>
 */
p5.XML.prototype.removeChild = function(param) {
  var ind = -1;
  if (typeof param === 'string') {
    for (var i = 0; i < this.DOM.children.length; i++) {
      if (this.DOM.children[i].tagName === param) {
        ind = i;
        break;
      }
    }
  } else {
    ind = param;
  }
  if (ind !== -1) {
    this.DOM.removeChild(this.DOM.children[ind]);
  }
};

/**
 * Counts the specified element's number of attributes, returned as an Number.
 *
 * @method getAttributeCount
 * @return {Integer}
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.getAttributeCount());
 * }
 *
 * // Sketch prints:
 * // 2
 * </code></div>
 */
p5.XML.prototype.getAttributeCount = function() {
  return this.DOM.attributes.length;
};

/**
 * Gets all of the specified element's attributes, and returns them as an
 * array of Strings.
 *
 * @method listAttributes
 * @return {String[]} an array of strings containing the names of attributes
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.listAttributes());
 * }
 *
 * // Sketch prints:
 * // ["id", "species"]
 * </code></div>
 */
p5.XML.prototype.listAttributes = function() {
  var arr = [];
  for (var i = 0; i < this.DOM.attributes.length; i++) {
    var attribute = this.DOM.attributes[i];
    arr.push(attribute.nodeName);
  }
  return arr;
};

/**
 *  Checks whether or not an element has the specified attribute.
 *
 * @method hasAttribute
 * @param {String} the attribute to be checked
 * @return {boolean} true if attribute found else false
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.hasAttribute('species'));
 *   print(firstChild.hasAttribute('color'));
 * }
 *
 * // Sketch prints:
 * // true
 * // false
 * </code></div>
 */
p5.XML.prototype.hasAttribute = function(name) {
  var obj = {};
  for (var i = 0; i < this.DOM.attributes.length; i++) {
    var attribute = this.DOM.attributes[i];
    obj[attribute.nodeName] = attribute.nodeValue;
  }
  return obj[name] ? true : false;
};

/**
 * Returns an attribute value of the element as an Number. If the defaultValue
 * parameter is specified and the attribute doesn't exist, then defaultValue
 * is returned. If no defaultValue is specified and the attribute doesn't
 * exist, the value 0 is returned.
 *
 * @method getNum
 * @param {String} name            the non-null full name of the attribute
 * @param {Number} [defaultValue]  the default value of the attribute
 * @return {Number}
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.getNum('id'));
 * }
 *
 * // Sketch prints:
 * // 0
 * </code></div>
 */
p5.XML.prototype.getNum = function(name, defaultValue) {
  var obj = {};
  for (var i = 0; i < this.DOM.attributes.length; i++) {
    var attribute = this.DOM.attributes[i];
    obj[attribute.nodeName] = attribute.nodeValue;
  }
  return Number(obj[name]) || defaultValue || 0;
};

/**
 * Returns an attribute value of the element as an String. If the defaultValue
 * parameter is specified and the attribute doesn't exist, then defaultValue
 * is returned. If no defaultValue is specified and the attribute doesn't
 * exist, null is returned.
 *
 * @method getString
 * @param {String} name            the non-null full name of the attribute
 * @param {Number} [defaultValue]  the default value of the attribute
 * @return {String}
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.getString('species'));
 * }
 *
 * // Sketch prints:
 * // "Capra hircus"
 * </code></div>
 */
p5.XML.prototype.getString = function(name, defaultValue) {
  var obj = {};
  for (var i = 0; i < this.DOM.attributes.length; i++) {
    var attribute = this.DOM.attributes[i];
    obj[attribute.nodeName] = attribute.nodeValue;
  }
  return obj[name] ? String(obj[name]) : defaultValue || null;
};

/**
 * Sets the content of an element's attribute. The first parameter specifies
 * the attribute name, while the second specifies the new content.
 *
 * @method setAttribute
 * @param {String} name            the full name of the attribute
 * @param {Number|String|Boolean} value  the value of the attribute
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.getString('species'));
 *   firstChild.setAttribute('species', 'Jamides zebra');
 *   print(firstChild.getString('species'));
 * }
 *
 * // Sketch prints:
 * // "Capra hircus"
 * // "Jamides zebra"
 * </code></div>
 */
p5.XML.prototype.setAttribute = function(name, value) {
  this.DOM.setAttribute(name, value);
};

/**
 * Returns the content of an element. If there is no such content,
 * defaultValue is returned if specified, otherwise null is returned.
 *
 * @method getContent
 * @param {String} [defaultValue] value returned if no content is found
 * @return {String}
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.getContent());
 * }
 *
 * // Sketch prints:
 * // "Goat"
 * </code></div>
 */
p5.XML.prototype.getContent = function(defaultValue) {
  var str;
  str = this.DOM.textContent;
  str = str.replace(/\s\s+/g, ',');
  return str || defaultValue || null;
};

/**
 * Sets the element's content.
 *
 * @method setContent
 * @param {String} text the new content
 * @example
 * <div class='norender'><code>
 * // The following short XML file called "mammals.xml" is parsed
 * // in the code below.
 * //
 * // <?xml version="1.0"?>
 * // &lt;mammals&gt;
 * //   &lt;animal id="0" species="Capra hircus">Goat&lt;/animal&gt;
 * //   &lt;animal id="1" species="Panthera pardus">Leopard&lt;/animal&gt;
 * //   &lt;animal id="2" species="Equus zebra">Zebra&lt;/animal&gt;
 * // &lt;/mammals&gt;
 *
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   let firstChild = xml.getChild('animal');
 *   print(firstChild.getContent());
 *   firstChild.setContent('Mountain Goat');
 *   print(firstChild.getContent());
 * }
 *
 * // Sketch prints:
 * // "Goat"
 * // "Mountain Goat"
 * </code></div>
 */
p5.XML.prototype.setContent = function(content) {
  if (!this.DOM.children.length) {
    this.DOM.textContent = content;
  }
};

/**
 * Serializes the element into a string. This function is useful for preparing
 * the content to be sent over a http request or saved to file.
 *
 * @method serialize
 * @return {String} Serialized string of the element
 * @example
 * <div class='norender'><code>
 * let xml;
 *
 * function preload() {
 *   xml = loadXML('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   print(xml.serialize());
 * }
 *
 * // Sketch prints:
 * // <mammals>
 * //   <animal id="0" species="Capra hircus">Goat</animal>
 * //   <animal id="1" species="Panthera pardus">Leopard</animal>
 * //   <animal id="2" species="Equus zebra">Zebra</animal>
 * // </mammals>
 * </code></div>
 */
p5.XML.prototype.serialize = function() {
  var xmlSerializer = new XMLSerializer();
  return xmlSerializer.serializeToString(this.DOM);
};

export default p5;
