/**
 * @for p5
 * @submodule FES
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

var dataDoc = require('../../docs/reference/data.json');
var arrDoc = JSON.parse(JSON.stringify(dataDoc));

function inject(docItem) {
  if (docItem.class !== 'p5') {
    return;
  }
  if (!docItem.itemtype || docItem.itemtype !== 'method') {
    return;
  }
  var original = p5.prototype[docItem.name];

  if(original) {
    p5.prototype[docItem.name] = function() {
      if(!this || !(this instanceof p5)) {
        // Maybe this should be warned about?
        // throw new Error(
        //   'This value is not p5 in ' + docItem.name + ', params: ' +
        //   arguments + '. This value: ' + this
        // );
      } else {
        this._validateParameters(docItem, arguments);
      }
      return original.apply(this, arguments);
    };
  }
}

if (!p5.disableFriendlyErrors && typeof(IS_MINIFIED) === 'undefined') {
  var items = arrDoc.classitems;
  for(var i = 0; i < items.length; i++) {
    var item = items[i];
    inject(item);
  }
}
