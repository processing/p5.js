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
 *  Method called when the name of an XML Node needs to be changed
 *
 *  @method setName
 *  @param {String} the new name of the node
 */
p5.XML.prototype.setName = function(name) {
  this.name = name;
};

/**
 *  Method used to set the parent of a node. Used mainly during the
 *  parsing of XML when loadXML() is called. The XML node (the p5.XML
 *  Object) is passed and the children of that node are set to have
 *  their parent as the node which was passed
 *
 *  @method setParent
 */
p5.XML.prototype.setParent = function() {
  var i;
  for( i = 0; i < this.children.length; i++ ){
    this.children[i].parent = this;
  }
};

/**
 *  Method used to add a new child to an XML node. The node on being
 *  passed gets pushed to the children array of the parent node.
 *
 *  @method addChild
 *  @param {Object} a p5.XML Object which will be the child to be added
 */
p5.XML.prototype.addChild = function(node) {
  this.children.push(node);
};

/**
 *  This method is called while the parsing of XML (when loadXML() is
 *  called). The difference between this method and the setContent()
 *  method defined later is that this one is used to set the content
 *  when the node in question has more nodes under it and so on and
 *  not directly text content. While in the other one is used when
 *  the node in question directly has text inside it.
 *
 *  @method setCont
 *  @param {String} the content (might be large if more nodes inside)
 */
p5.XML.prototype.setCont = function(content) {
  var str;
  str = content;
  str = str.replace(/\s\s+/g, ',');
  str = str.split(',');
  this.content = str;
};

/**
 *  This method is called while the parsing of XML (when loadXML() is
 *  called). The XML node is passed and its attributes are stored in the
 *  p5.XML's attribute Object.
 *
 *  @method setAttributes
 *  @param XML Node
 */
p5.XML.prototype.setAttributes = function(node) {
  var  i, att = {};
  for( i = 0; i < node.attributes.length; i++) {
    att[node.attributes[i].nodeName] = node.attributes[i].nodeValue;
  }
  this.attributes = att;
};

/**
 *  getParent() when called returns the parent (a p5.XML Object)
 *  of the node.
 *
 *  @method getParent
 *  @return {Object} a p5.XML Object which is the parent
 */
p5.XML.prototype.getParent = function() {
  return this.parent;
};

/**
 *  getName() when called returns the name of the node.
 *
 *  @method getName
 *  @return {String} the name of the node
 */
p5.XML.prototype.getName = function() {
  return this.name;
};

/**
 *  hasChildren() to check whether the node has any children.
 *
 *  @method hasChildren
 *  @return {boolean} true if yes otherwise false
 */
p5.XML.prototype.hasChildren = function() {
  if(this.children) {
    return true;
  }
  else {
    return false;
  }
};

/**
 *  hasChildren() when called returns all the children of the node
 *  in an array of String
 *
 *  @method listChildren
 *  @return {Array} an array of Strings storing all the names of children
 */
p5.XML.prototype.listChildren = function() {
  var i, arr = [];
  for( i = 0; i < this.children.length; i++ ) {
    arr.push(this.children[i].name);
  }
  return arr;
};

/**
 *  getChildren() when called returns all the children (p5.XML Objects)
 *  of the node
 *
 *  @method getChildren
 *  @param {String} if passed will only return those children matching param.
 *  @return {Array} an array containing all the children (p5.XML Objects)
 */
p5.XML.prototype.getChildren = function(param) {
  if (param) {
    var i, arr = [];
    for( i = 0; i < this.children.length; i++ ) {
      if (this.children[i].name === param) {
        arr.push(this.children[i]);
      }
    }
    return arr;
  }
  else {
    return this.children;
  }
};

/**
 *  getChild() when called returns the child element with the specified index
 *  value or name (the first node with that name)
 *
 *  @method getChild
 *  @param {String|number}
 *  @return {Object} a p5.XML Object
 */
p5.XML.prototype.getChild = function(param) {
  if(typeof param === 'string') {
    return this.children[0];
  }
  else {
    var i;
    for( i = 0; i < this.children.length; i++ ) {
      if(i === param) {
        return this.children[i];
      }
    }
  }
};

/**
 *  removeChild() removes the child (p5.XML Object) which is passed
 *
 *  @method getParent
 *  @param {Object} the child (p5.XML Object) to be removed
 */
p5.XML.prototype.removeChild = function(node) {
  var i;
  for( i = 0 ; i < this.children.length; i++ ) {
    if( this.children[i] === node ) {
      delete this.children[i];
    }
  }
};

/**
 *  getAttributeCount() returns the number of attributes an XML node has
 *
 *  @method getAttributeCount
 *  @return {Number}
 */
p5.XML.prototype.getAttributeCount = function() {
  return Object.keys(this.attributes).length;
};

/**
 *  listAttributes() returns a list of all the attributes of the XML node.
 *
 *  @method listAttributes
 *  @return {Array} an array of strings containing the names of attributes
 */
p5.XML.prototype.listAttributes = function() {
  return Object.keys(this.attributes);
};

/**
 *  hasAttribute() checks whether the node in question has the passed attribute.
 *
 *  @method hasAttribute
 *  @param {String} the attribute to be checked
 *  @return {boolean} true if attribute found else false
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
 *  getContent() returns the content inside an XML node.
 *
 *  @method getContent
 *  @return {String}
 */
p5.XML.prototype.getContent = function() {
  return this.content;
};

/**
 *  setContent() sets the content of the XML node.
 *
 *  @method setContent
 *  @param {String} the new content
 */
p5.XML.prototype.setContent = function( content ) {
  if(!this.children.length) {
    this.content = content;
  }
};
