// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DocumentedMethod = factory();
  }
}(this, function () {
  function extend(target, src) {
    Object.keys(src).forEach(function(prop) {
      target[prop] = src[prop];
    });
    return target;
  }

  function DocumentedMethod(classitem) {
    extend(this, classitem);

    if (this.overloads) {
      // Make each overload inherit properties from their parent
      // classitem.
      this.overloads = this.overloads.map(function(overload) {
        return extend(Object.create(this), overload);
      }, this);

      if (this.params) {
        throw new Error('params for overloaded methods should be undefined');
      }

      this.params = this._getMergedParams();
    }
  }

  DocumentedMethod.prototype = {
    // Merge parameters across all overloaded versions of this item.
    _getMergedParams: function() {
      var paramNames = {};
      var params = [];

      this.overloads.forEach(function(overload) {
        if (!overload.params) {
          return;
        }
        overload.params.forEach(function(param) {
          if (param.name in paramNames) {
            return;
          }
          paramNames[param.name] = param;
          params.push(param);
        });
      });

      return params;
    }
  };

  return DocumentedMethod;
}));
