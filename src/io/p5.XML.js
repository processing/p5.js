p5.XML = function () {
    this.name = null; //done
    this.attributes = {}; //done
    this.children = [];
    this.parent = null;
    this.content = []; //done
};

p5.XML.prototype.setName = function(name) {
    this.name = name
}

p5.XML.prototype.setParent = function() {
    var i;
    for( i = 0; i < this.children.length; i++ ){
        this.children[i].parent = this;
    }
}

p5.XML.prototype.addChild = function(node) {
    this.children.push(node);
}

p5.XML.prototype.setCont = function(content) {
    var str;
    str = content;
    str = str.replace(/\s\s+/g, ',');
    str = str.split(',');
    this.content = str;
}

p5.XML.prototype.setAttributes = function(node) {
    var list = [], i, att = {};
    for( i = 0; i < node.attributes.length; i++) {
        att[node.attributes[i].nodeName] = node.attributes[i].nodeValue;
    }
    this.attributes = att;
}

p5.XML.prototype.getParent = function() {
    return this.parent;
}

p5.XML.prototype.getName = function() {
    return this.name;
}

p5.XML.prototype.hasChildren = function() {
    if(this.children)
        return true;
    else
        return false;
}

p5.XML.prototype.listChildren = function() {
    var i, arr = [];
    for( i = 0; i < this.children.length; i++ ) {
        arr.push(this.children[i].name);
    } 
    return arr;
}

p5.XML.prototype.getChildren = function(param) {
    if (param) {
        var i, arr = [];
        for( i = 0; i < this.children.length; i++ ) {
            if (this.children[i].name == param) {
                arr.push(this.children[i]);
            }
        }
        return arr;
    }
    else {
        return this.children;
    }
}

p5.XML.prototype.getChild = function(param) {
    if(typeof param == "string") {
        return this.children[0];
    }
    else {
        var i;
        for( i = 0; i < this.children.length; i++ ) {
            if(i == param)
                return this.children[i];
        }
    }
}

p5.XML.prototype.removeChild = function(node) {
    var i;
    for( i = 0 ; i < this.children.length; i++ ) {
        if( this.children[i] == node ) {
            delete this.children[i];
        }
    }
}

p5.XML.prototype.getAttributeCount = function() {
    return Object.keys(this.attributes).length;
}

p5.XML.prototype.listAttributes = function() {
    return Object.keys(this.attributes);
}

p5.XML.prototype.hasAttribute = function(name) {
    var i;
    var names = Object.keys(this.attributes);
    for( i = 0 ; i < names.length ; i++ ) {
        if(name = names[i])
            return true;
    }
    return false;
}

p5.XML.prototype.getContent = function() {
    return this.content;
}

p5.XML.prototype.setContent = function( content ) {
    if(!this.children.length) {
        this.content = content;
    }
}
