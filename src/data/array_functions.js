define(function (require) {

  'use strict';

  var Processing = require('../core/core');

  Processing.prototype.append = function(array, value) {
    array.push(value);
    return array;
  };

  Processing.prototype.arrayCopy = function(src, a, b, c, d) { //src, srcPosition, dst, dstPosition, length
    if (typeof d !== 'undefined') {
      for (var i=a; i<min(a+d, src.length); i++) {
        b[dstPosition+i] = src[i];
      }
    }
    else if (typeof b !== 'undefined') { //src, dst, length
      a = src.slice(0, min(b, src.length));
    }
    else { //src, dst
      a = src.slice(0);
    }
  };

  Processing.prototype.concat = function(list0, list1) {
    return list0.concat(list1);
  };

  Processing.prototype.reverse = function(list) {
    return list.reverse();
  };

  Processing.prototype.shorten = function(list) {
    list.pop();
    return list;
  };

  Processing.prototype.sort = function(list, count) {
    var arr = count ? list.slice(0, min(count, list.length)) : list;
    var rest = count ? list.slice(min(count, list.length)) : [];
    if (typeof arr[0] === 'string') {
      arr = arr.sort();
    } else {
      arr = arr.sort(function(a,b){return a-b;});
    }
    return arr.concat(rest);
  };

  Processing.prototype.splice = function(list, value, index) {
    return list.splice(index,0,value);
  };

  Processing.prototype.subset = function(list, start, count) {
    if (typeof count !== 'undefined') return list.slice(start, start+count);
    else return list.slice(start, list.length-1);
  };

  return Processing;

});