/**
 * @module IO
 * @submodule XML
 * @requires core
 */

'use strict';

var p5 = require('../core/core');


p5.XML = function () {
  this.name = null; //done
  this.attributes = {}; //done
  this.children = [];
  this.parent = null;
  this.content = []; //done
};


/**
 * Gets a copy of the element's parent. Returns the parent as another
 * p5.XML object.
 *
 * @method getParent
 * @return {Object}   element parent
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
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
 * }
 *
 * function setup() {
 *   var children = xml.getChildren("animal");
 *   var parent = children[1].getParent();
 *   print(parent.getName());
 * }
 *
 * // Sketch prints:
 * // mammals
 * </code></div>
 */
p5.XML.prototype.getParent = function() {
  return this.parent;
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
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
 * }
 *
 * function setup() {
 *   println(xml.getName());
 * }
 *
 * // Sketch prints:
 * // mammals
 * </code></div>
 */
p5.XML.prototype.getName = function() {
  return this.name;
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
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
 * }
 *
 * function setup() {
 *   print(xml.getName());
 *   xml.setName("fish");
 *   print(xml.getName());
 * }
 *
 * // Sketch prints:
 * // mammals
 * // fish
 * </code></div>
 */
p5.XML.prototype.setName = function(name) {
  this.name = name;
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
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
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
  return this.children.length > 0;
};

/**
 * Get the names of all of the element's children, and returns the names as an
 * array of Strings. This is the same as looping through and calling getName()
 * on each child element individually.
 *
 * @method listChildren
 * @return {Array} names of the children of the element
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
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
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
  return this.children.map(function(c) { return c.name; });
};

/**
 * Returns all of the element's children as an array of p5.XML objects. When
 * the name parameter is specified, then it will return all children that match
 * that name or path. The path is a series of elements and sub-elements,
 * separated by slashes.
 *
 * @method getChildren
 * @param {String} [name] element name or path/to/element
 * @return {Array} children of the element
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
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
 * }
 *
 * function setup() {
 *   var animals = xml.getChildren("animal");
 *
 *   for (var i = 0; i < animals.length; i++) {
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
    return this.children.filter(function(c) { return c.name === param; });
  }
  else {
    return this.children;
  }
};

/**
 * Returns the first of the element's children that matches the name parameter.
 * The name or path is a series of elements and sub-elements, separated by
 * slashes. It returns undefined if no matching child is found.
 *
 * @method getChild
 * @param {String} name element name or path/to/element
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
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
 * }
 *
 * function setup() {
 *   var firstChild = xml.getChild("animal");
 *   print(firstChild.getContent());
 * }
 *
 * // Sketch prints:
 * // "Goat"
 * </code></div>&lt;animal
 * <div class='norender'><code>
 * var xml;
 *
 * function preload() {
 *   xml = loadXML("assets/mammals.xml");
 * }
 *
 * function setup() {
 *   var secondChild = xml.getChild(1);
 *   print(secondChild.getContent());
 * }
 *
 * // Sketch prints:
 * // "Leopard"
 * </code></div>
 */
p5.XML.prototype.getChild = function(param) {
  if(typeof param === 'string') {
    return this.children.find(function(c) {
      return c.name === param;
    });
  }
  else {
    return this.children[param];
  }
};

/**
 * Appends a new child to the element. The child can be specified with
 * either a String, which will be used as the new tag's name, or as a
 * reference to an existing p5.XML object.
 * A reference to the newly created child is returned as an p5.XML object.
 *
 * @method addChild
 * @param {Object} a p5.XML Object which will be the child to be added
 */
p5.XML.prototype.addChild = function(node) {
  if (node instanceof p5.XML) {
    this.children.push(node);
  } else {
    // PEND
  }
};

/**
 * removeChild() removes the child (p5.XML Object) which is passed
 *
 * @method removeChild
 * @param {Object} the child (p5.XML Object) to be removed
 */
p5.XML.prototype.removeChild = function(param) {
  var ind = -1;
  if(typeof param === 'string') {
    for (var i=0; i<this.children.length; i++) {
      if (this.children[i].name === param) {
        ind = i;
        break;
      }
    }
  } else {
    ind = param;
  }
  if (ind !== -1) {
    this.children.splice(ind, 1);
  }
};

/**
 * This method is called while the parsing of XML (when loadXML() is
 * called). The difference between this method and the setContent()
 * method defined later is that this one is used to set the content
 * when the node in question has more nodes under it and so on and
 * not directly text content. While in the other one is used when
 * the node in question directly has text inside it.
 *
 * @method setCont
 * @param {String} the content (might be large if more nodes inside)
 */
p5.XML.prototype.setCont = function(content) {
  var str;
  str = content;
  str = str.replace(/\s\s+/g, ',');
  str = str.split(',');
  this.content = str;
};

/**
 * This method is called while the parsing of XML (when loadXML() is
 * called). The XML node is passed and its attributes are stored in the
 * p5.XML's attribute Object.
 *
 * @method setAttributes
 * @param XML Node
 */
p5.XML.prototype.setAttributes = function(node) {
  var  i, att = {};
  for( i = 0; i < node.attributes.length; i++) {
    att[node.attributes[i].nodeName] = node.attributes[i].nodeValue;
  }
  this.attributes = att;
};


/**
 * getAttributeCount() returns the number of attributes an XML node has
 *
 * @method getAttributeCount
 * @return {Number}
 */
p5.XML.prototype.getAttributeCount = function() {
  return Object.keys(this.attributes).length;
};

/**
 * listAttributes() returns a list of all the attributes of the XML node.
 *
 * @method listAttributes
 * @return {Array} an array of strings containing the names of attributes
 */
p5.XML.prototype.listAttributes = function() {
  return Object.keys(this.attributes);
};

/**
 * hasAttribute() checks whether the node in question has the passed attribute.
 *
 * @method hasAttribute
 * @param {String} the attribute to be checked
 * @return {boolean} true if attribute found else false
 */
p5.XML.prototype.hasAttribute = function(name) {
  var i;
  var names = Object.keys(this.attributes);
  for( i = 0 ; i < names.length ; i++ ) {
    if(name === names[i]) {
      return true;
    }
  }
  return false;
};

/**
 * getContent() returns the content inside an XML node.
 *
 * @method getContent
 * @return {String}
 */
p5.XML.prototype.getContent = function() {
  return this.content;
};

/**
 * setContent() sets the content of the XML node.
 *
 * @method setContent
 * @param {String} the new content
 */
p5.XML.prototype.setContent = function( content ) {
  if(!this.children.length) {
    this.content = content;
  }
};
