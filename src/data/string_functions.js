(function(exports) {
  exports.join = function(list, separator) {
    return list.join(separator);
  };
  exports.match =  function(str, reg) {
    return str.match(reg);
  };
  exports.matchAll = function(str, reg) {
    var re = new RegExp(reg, "g");
    match = re.exec(str);
    var matches = [];
    while (match !== null) {
      matches.push(match);
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      match = re.exec(str);
    }
    return matches;
  };
  exports.nf = function() { 
    if (arguments[0] instanceof Array) {
      var a = arguments[1];
      var b = arguments[2];
      return arguments[0].map(function(x) { return doNf(x, a, b);});
    } else {
      return doNf.apply(this, arguments);
    }
  };
  function doNf() {
    var num = arguments[0];
    var neg = (num < 0);
    var n = neg ? num.toString().substring(1) : num.toString();
    var decimalInd = n.indexOf('.');
    var intPart =  decimalInd != -1 ? n.substring(0, decimalInd) : n;
    var decPart = decimalInd != -1 ? n.substring(decimalInd+1) : '';

    var str = neg ? '-' : '';
    if (arguments.length == 3) {
      for (var i=0; i<arguments[1]-intPart.length; i++) { str += '0'; }
      str += intPart;
      str += '.';
      str += decPart;
      for (var j=0; j<arguments[2]-decPart.length; j++) { str += '0'; }
      return str;
    } else {
      for (var k=0; k<max(arguments[1]-intPart.length, 0); k++) { str += '0'; }
      str += n;
      return str;
    }
  }
  exports.nfc = function() {     
    if (arguments[0] instanceof Array) {
      var a = arguments[1];
      return arguments[0].map(function(x) { return doNfc(x, a);});
    } else {
      return doNfc.apply(this, arguments);
    }
  };
  function doNfc() {
    var num = arguments[0].toString();
    var dec = num.indexOf('.');
    var rem = dec != -1 ? num.substring(dec) : '';
    var n = dec != -1 ? num.substring(0, dec) : num;
    n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (arguments.length > 1) rem = rem.substring(0, arguments[1]+1);
    return n+rem;
  }
  exports.nfp = function() {
    var nfRes = nf.apply(this, arguments);
    if (nfRes instanceof Array) {
      return nfRes.map(addNfp);
    } else {
      return addNfp(nfRes);
    }
  };
  function addNfp() {   
    return (parseFloat(arguments[0]) > 0) ? '+'+arguments[0].toString() : arguments[0].toString();
  }
  exports.nfs = function() {
    var nfRes = nf.apply(this, arguments);
    if (nfRes instanceof Array) {
      return nfRes.map(addNfs);
    } else {
      return addNfs(nfRes);
    }
  };
  function addNfs() {   
    return (parseFloat(arguments[0]) > 0) ? ' '+arguments[0].toString() : arguments[0].toString();
  }
  exports.split = function(str, delim) {
    return str.split(delim);
  };
  exports.splitTokens = function() {
    var d = (arguments.length > 0) ? arguments[1] : /\s/g;
    return arguments[0].split(d).filter(function(n){return n;});
  };
  exports.trim = function(str) {
    if (str instanceof Array) {
      return str.map(trim);
    } else return str.trim();
  };

}(window));
