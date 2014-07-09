// /**
//  * @module Shape
//  * @submodule Shape
//  * @for p5.Shape
//  */
// define(function(require) {

//   var p5 = require('core');
//   var reqwest = require('reqwest');
//   //var constants = require('constants');

//   p5.Shape = function(path, pInst, callback) {
//     var self = this;
//     reqwest({url: path, type: 'svg', success: function (resp) {
//       var s = resp.responseXML.documentElement;
//       self.svg = s;
//       if (typeof callback !== 'undefined') {
//         callback(self);
//       }
//     }});
//   };

//   return p5.Graphics;
// });
