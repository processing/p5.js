var createEmitter = require('./emit');

// mod is used to make yuidocs "global". It actually just calls generate()
// This design was selected to avoid rewriting the whole file from
// https://github.com/toolness/friendly-error-fellowship/blob/2093aee2acc53f0885fcad252a170e17af19682a/experiments/typescript/generate-typescript-annotations.js
function mod(yuidocs, localFileame, globalFilename) {

  // http://stackoverflow.com/a/2008353/2422398
  var JS_SYMBOL_RE = /^[$A-Z_][0-9A-Z_$]*$/i;

  var P5_CLASS_RE = /^p5\.([^.]+)$/;

  var P5_ALIASES = [
    'p5',
    // These are supposedly "classes" in our docs, but they don't exist
    // as objects, and their methods are all defined on p5.
    'p5.dom',
    'p5.sound'
  ];

  var YUIDOC_TO_TYPESCRIPT_PARAM_MAP = {
    // TODO: Not sure if there's a better type for generic Objects...
    'Object': 'any',
    'Any': 'any',
    'Number': 'number',
    'Integer': 'number',
    'String': 'string',
    'Array': 'any[]',
    'Boolean': 'boolean',
    'P5': 'p5',
    // TODO: Not sure if there's a better type for functions. TypeScript's
    // spec seems to mention something called "wildcard function types"
    // here: https://github.com/Microsoft/TypeScript/issues/3970
    'Function': '() => any',
  };

  function getClassitems(className) {
    return yuidocs.classitems.filter(function(classitem) {
      // Note that we check for classitem.name because some methods
      // don't appear to define them... Filed this as
      // https://github.com/processing/p5.js/issues/1252.
      return classitem.class === className && classitem.name;
    });
  }

  function isValidP5ClassName(className) {
    return P5_CLASS_RE.test(className) && className in yuidocs.classes;
  }

  function validateType(type) {
    var subtypes = type.split('|');
    var subtype;

    for (var i = 0; i < subtypes.length; i++) {
      subtype = subtypes[i];
      if (subtype in YUIDOC_TO_TYPESCRIPT_PARAM_MAP ||
          isValidP5ClassName(subtype)) {
        continue;
      }
      return false;
    }

    return true;
  }

  function validateMethod(classitem) {
    var errors = [];
    var paramNames = {};
    var optionalParamFound = false;

    if (!classitem.is_constructor && !JS_SYMBOL_RE.test(classitem.name)) {
      errors.push('"' + classitem.name + '" is not a valid JS symbol name');
    }

    (classitem.params || []).forEach(function(param) {
      if (param.optional) {
        optionalParamFound = true;
      } else if (optionalParamFound) {
        errors.push('required param "' + param.name + '" follows an ' +
                    'optional param');
      }

      if (param.name in paramNames) {
        errors.push('param "' + param.name + '" is defined multiple times');
      }
      paramNames[param.name] = true;

      if (param.name === 'class') {
        errors.push('param "' + param.name + '" is a reserved word in JS');
      }

      if (!JS_SYMBOL_RE.test(param.name)) {
        errors.push('param "' + param.name +
                    '" is not a valid JS symbol name');
      }

      if (!validateType(param.type)) {
        errors.push('param "' + param.name + '" has invalid type: ' +
                    param.type);
      }
    });

    if (classitem.return && !validateType(classitem.return.type)) {
      errors.push('return has invalid type: ' + classitem.return.type);
    }

    return errors;
  }

  function translateType(type) {
    return type.split('|').map(function(subtype) {
      if (subtype in YUIDOC_TO_TYPESCRIPT_PARAM_MAP) {
        return YUIDOC_TO_TYPESCRIPT_PARAM_MAP[subtype];
      }
      return subtype;
    }).join('|');
  }

  function translateParam(param) {
    return param.name + (param.optional ? '?' : '') + ': ' +
           translateType(param.type);
  }

  function generateClassMethod(emit, className, classitem) {
    var errors = validateMethod(classitem);
    var params = (classitem.params || []).map(translateParam);
    var returnType = classitem.return ? translateType(classitem.return.type) : 'void';
    var decl;

    if (classitem.is_constructor) {
      decl = 'constructor(' + params.join(', ') + ')';
    } else {
      decl = (classitem.static ? 'static ' : '') + classitem.name + '(' +
              params.join(', ') + '): ' + returnType;
    }

    if (emit.getIndentLevel() === 0) {
      decl = 'declare function ' + decl + ';';
    }

    if (errors.length) {
      emit.sectionBreak();
      emit('// TODO: Fix ' + classitem.name + '() errors in ' +
           classitem.file + ':');
      emit('//');
      errors.forEach(function(error) {
        emit('//   ' + error);
      });
      emit('//');
      emit('// ' + decl);
      emit('');
    } else {
      emit.description(classitem.description);
      emit(decl);
    }
  }

  function generateClassConstructor(emit, className) {
    var classitem = yuidocs.classes[className];

    if (!classitem.is_constructor) {
      throw new Error(className + ' is not a constructor');
    }

    generateClassMethod(emit, className, classitem);
  }

  function generateClassProperty(emit, className, classitem) {
    var decl;

    if (JS_SYMBOL_RE.test(classitem.name)) {
      // TODO: It seems our properties don't carry any type information,
      // which is unfortunate. YUIDocs supports the @type tag on properties,
      // and even encourages using it, but we don't seem to use it.
      decl = classitem.name + ': any';

      emit.description(classitem.description);

      if (emit.getIndentLevel() === 0) {
        emit('declare var ' + decl + ';');
      } else {
        emit(decl);
      }
    } else {
      emit.sectionBreak();
      emit('// TODO: Property "' + classitem.name +
           '", defined in ' + classitem.file +
           ', is not a valid JS symbol name');
      emit.sectionBreak();
    }
  }

  function generateClassProperties(emit, className) {
    getClassitems(className).forEach(function(classitem) {
      emit.setCurrentSourceFile(classitem.file);
      if (classitem.itemtype === 'method') {
        generateClassMethod(emit, className, classitem);
      } else if (classitem.itemtype === 'property') {
        generateClassProperty(emit, className, classitem);
      } else {
        emit('// TODO: Annotate ' + classitem.itemtype + ' "' +
             classitem.name + '"');
      }
    });
  }

  function generateP5Properties(emit, className) {
    emit.sectionBreak();
    emit('// Properties from ' + className);
    emit.sectionBreak();

    generateClassProperties(emit, className);
  }

  function generateP5Subclass(emit, className) {
    var info = yuidocs.classes[className];
    var nestedClassName = className.match(P5_CLASS_RE)[1];

    emit.setCurrentSourceFile(info.file);

    emit('class ' + nestedClassName +
         (info.extends ? ' extends ' + info.extends : '') + ' {');
    emit.indent();

    generateClassConstructor(emit, className);
    generateClassProperties(emit, className);

    emit.dedent();
    emit('}');
  }

  function emitLocal(p5Aliases, p5Subclasses) {
    var emit = createEmitter(localFileame);

    emit('declare class p5 {');
    emit.indent();

    p5Aliases.forEach(generateP5Properties.bind(undefined, emit));

    emit.dedent();
    emit('}\n');

    emit('declare namespace p5 {');
    emit.indent();

    p5Subclasses.forEach(generateP5Subclass.bind(undefined, emit));

    emit.dedent();
    emit('}\n');

    emit.close();
  }

  function emitGlobal(p5Aliases) {
    var emit = createEmitter(globalFilename);

    emit('///<reference path="p5.d.ts" />\n');

    p5Aliases.forEach(generateP5Properties.bind(undefined, emit));

    emit.close();
  }

  function generate() {
    var p5Aliases = [];
    var p5Subclasses = [];

    Object.keys(yuidocs.classes).forEach(function(className) {
      if (P5_ALIASES.indexOf(className) !== -1) {
        p5Aliases.push(className);
      } else if (P5_CLASS_RE.test(className)) {
        p5Subclasses.push(className);
      } else {
        throw new Error(className + ' is documented as a class but ' +
                        'I\'m not sure how to generate a type definition ' +
                        'for it. I expect ' + className + ' to look like with p5.NAME');
      }
    });

    emitLocal(p5Aliases, p5Subclasses);
    emitGlobal(p5Aliases);
  }

  generate();
}


module.exports = mod;
