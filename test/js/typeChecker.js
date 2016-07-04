var typeChecker = (function() {
  var P5_CLASS_RE = /^p5\.([^.]+)$/;
  var FILES_TO_IGNORE_FOR_NOW = [
    // TODO: Eventually we shouldn't ignore these, but they're raising
    // weird errors for now so we'll skip them.
    'lib/addons/p5.sound.js'
  ];
  var METHODS_TO_IGNORE_FOR_NOW = [
    // TODO: Eventually we shouldn't ignore these, or we should define
    // some custom yuidoc tag on them to indicate that they do their own
    // validation or something.

    // This one can take any number of strings in the middle as args.
    'p5.loadTable',

    // This one is just complicated.
    'p5.save',

    // This one connects to p5.sound, which we're ignoring for now.
    'p5.MediaElement.connect',

    // Another odd one, might have incorrect docs for args.
    'p5.dom.createCapture',
  ];
  var P5_ALIASES = [
    'p5',
    // These are supposedly "classes" in our docs, but they don't exist
    // as objects, and their methods are all defined on p5.
    'p5.dom',
    'p5.sound'
  ];
  var OK_UNDEFINED_METHODS = [
    // These are user-defined.
    'p5.preload',
    'p5.setup',
    'p5.draw',
    'p5.windowResized',
    'p5.deviceMoved',
    'p5.deviceTurned',
    'p5.deviceShaken',
    'p5.keyPressed',
    'p5.keyReleased',
    'p5.keyTyped',
    'p5.mouseMoved',
    'p5.mouseDragged',
    'p5.mousePressed',
    'p5.mouseReleased',
    'p5.mouseClicked',
    'p5.mouseWheel',
    'p5.touchStarted',
    'p5.touchMoved',
    'p5.touchEnded',
    // These are defined at construction time or something else dynamic.
    'p5.remove',
  ];
  var customValidators = {
    // Internally, p5 passes p5.Color and Array instances to p5.color(),
    // which may intentionally be undocumented to avoid confusion for
    // beginners. So rather than changing the documentation, we'll add a
    // custom validator.
    'p5.color': function(target, thisArg, argumentsList, defaultValidator) {
      var v1 = argumentsList[0];
      if (v1 instanceof p5.Color || Array.isArray(v1)) {
        return;
      }
      defaultValidator();
    }
  };
  var typeValidators = {
    'Number': function(value) {
      return typeof(value) === 'number';
    },
    'String': function(value) {
      return typeof(value) === 'string';
    },
    'Array': function(value) {
      return Array.isArray(value);
    },
    'Object': function(value) {
      return typeof(value) === 'object';
    },
    'Any': function(value) {
      return true;
    },
    'Boolean': function(value) {
      return typeof(value) === 'boolean';
    },
    'Function': function(value) {
      return typeof(value) === 'function';
    },
    'Canvas': function(value) {
      return value instanceof HTMLCanvasElement;
    },
    'Integer': function(value) {
      return Number.isInteger(value);
    },
    'String/Constant': function(value) {
      // TODO: Consider actually parsing the docs description to extract
      // the names of constants out of it.
      return typeof(value) === 'string';
    },
    // TODO: Not sure if this should actually be defined in yuidocs as
    // Number|Constant. At first I thought 'Number/Constant' meant
    // 'constant that is a number', but this is not actually the case.
    'Number/Constant': function(value) {
      // TODO: Consider actually parsing the docs description to extract
      // the names of constants out of it.
      return typeof(value) === 'number' || typeof(value) === 'string';
    },
    'p5.Table': function(value) {
      return value instanceof p5.Table;
    },
    'p5.Vector': function(value) {
      return value instanceof p5.Vector;
    },
    'p5.Color': function(value) {
      return value instanceof p5.Color;
    },
    'p5.Image': function(value) {
      return value instanceof p5.Image;
    },
    'p5.Element': function(value) {
      return value instanceof p5.Element;
    },
    'p5.TableRow': function(value) {
      return value instanceof p5.TableRow;
    },
    'undefined': function(value) {
      // TODO: Investigate docs that mention this as a type, it's fishy.
      return typeof(value) === 'undefined';
    }
  };

  function buildTypeValidator(type, classitem) {
    var fullName = classitem.class + '.' + classitem.name;
    var validators = type.split('|').map(function(type) {
      if (typeof(typeValidators[type]) !== 'function') {
        throw new Error('Unknown type "' + type + '" documented as part of ' +
                        fullName + '() in ' +
                        classitem.file + " near line " + classitem.line);
      }
      return typeValidators[type];
    });

    return function(value) {
      return validators.some(function(typeValidator) {
        return typeValidator(value);
      });
    };
  }

  function buildParamValidator(classitem, param, argIndex) {
    var isValidType = buildTypeValidator(param.type, classitem);

    return function(value) {
      if (!isValidType(value)) {
        if (!param.optional) {
          throw new Error(
            "Invalid value for arg #" + (argIndex + 1) + " (" +
            param.name + ") of " + classitem.name + "() according to " +
            "documentation in " + classitem.file + ":" + classitem.line
          );
        }
      }
    };
  }

  function buildValidator(classitem) {
    var fullName = classitem.class + "." + classitem.name;
    var paramValidators = (classitem.params || [])
      .map(buildParamValidator.bind(null, classitem));
    var defaultValidator = function(target, thisArg, argumentsList) {
      paramValidators.forEach(function(paramValidator, i) {
        paramValidator(argumentsList[i], i);
      });
    };
    var customValidator = customValidators[fullName];
    var validate;

    if (typeof(customValidator) === 'function') {
      validate = function(target, thisArg, argumentsList) {
        customValidator(target, thisArg, argumentsList,
                        defaultValidator.bind(null, target, thisArg,
                                              argumentsList));
      };
    } else {
      validate = defaultValidator;
    }

    return {
      validate: validate
    };
  };

  function decorateMethod(className, classObj, classitem) {
    var fullName = className + "." + classitem.name;
    var thisObj, target, validator;

    if (METHODS_TO_IGNORE_FOR_NOW.indexOf(fullName) !== -1) {
      return;
    }

    if (classitem.static) {
      thisObj = classObj;
      target = thisObj[classitem.name];
      if (typeof(target) !== 'function') {
          throw new Error(fullName + " is documented as a static method in " +
                          classitem.file + ", but " +
                          "is not a function defined on " +
                          className);
      }
    } else {
      thisObj = classObj.prototype;
      target = thisObj[classitem.name];
      if (typeof(target) !== 'function') {
        if (OK_UNDEFINED_METHODS.indexOf(fullName) !== -1) {
          return;
        } else {
          throw new Error(fullName + " is documented as an instance " +
                          "method in " + classitem.file + ", but " +
                          "is not a function defined on " +
                          className + ".prototype");
        }
      }
    }

    validator = buildValidator(classitem);

    thisObj[classitem.name] = function() {
      validator.validate(target, this, [].slice.call(arguments));
      return target.apply(this, arguments);
    };
  }

  function decorateMethods(className, classObj, classitems) {
    var proto = classObj.prototype;
    var classitemMap = {};

    classitems.forEach(function(classitem) {
      // Note that we check for classitem.name because some methods
      // don't appear to define them... Filed this as
      // https://github.com/processing/p5.js/issues/1252.
      if (classitem.class === className && classitem.name) {
        if (classitemMap.hasOwnProperty(classitem.name)) {
          throw new Error("Duplicate definition for " + className + "." +
                          classitem.name);
        }
        classitemMap[classitem.name] = classitem;
        if (classitem.itemtype === 'method' &&
            FILES_TO_IGNORE_FOR_NOW.indexOf(classitem.file) === -1) {
          decorateMethod(className, classObj, classitem);
        }
      }
    });
  }

  function install(p5, yuidocs) {
    Object.keys(yuidocs.classes).forEach(function(className) {
      var target;

      if (P5_ALIASES.indexOf(className) !== -1) {
        target = p5;
      } else if (P5_CLASS_RE.test(className)) {
        target = p5[className.match(P5_CLASS_RE)[1]];
        if (!target) {
          throw new Error(className + " is documented as a class but " +
                          "does not seem to exist");
        }
      } else {
        throw new Error("Unrecognized class: " + className);
      }

      decorateMethods(className, target, yuidocs.classitems);
    });
  }

  return {
    install: install
  };
})();
