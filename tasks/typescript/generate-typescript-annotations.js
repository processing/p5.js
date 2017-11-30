/// @ts-check
const createEmitter = require('./emit');

function position(file, line) {
  return file + ', line ' + line;
}

function classitemPosition(classitem) {
  return position(classitem.file, classitem.line);
}

function overloadPosition(classitem, overload) {
  return position(classitem.file, overload.line);
}

// mod is used to make yuidocs "global". It actually just calls generate()
// This design was selected to avoid rewriting the whole file from
// https://github.com/toolness/friendly-error-fellowship/blob/2093aee2acc53f0885fcad252a170e17af19682a/experiments/typescript/generate-typescript-annotations.js
function mod(yuidocs, localFileame, globalFilename, sourcePath) {
  var emit;
  var constants = {};
  var missingTypes = {};

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

  var EXTERNAL_TYPES = new Set([
    'HTMLCanvasElement',
    'HTMLElement',
    'Float32Array',
    'AudioParam',
    'AudioNode',
    'GainNode',
    'DelayNode',
    'ConvolverNode',
    'Event'
  ]);

  var YUIDOC_TO_TYPESCRIPT_PARAM_MAP = {
    Object: 'object',
    Any: 'any',
    Number: 'number',
    Integer: 'number',
    String: 'string',
    Constant: 'any',
    undefined: 'undefined',
    Null: 'null',
    Array: 'any[]',
    Boolean: 'boolean',
    '*': 'any',
    Void: 'void',
    P5: 'p5',
    // When the docs don't specify what kind of function we expect,
    // then we need to use the global type `Function`
    Function: 'Function',
    // Special ignore for hard to fix YUIDoc from p5.sound
    'Tone.Signal': 'any',
    SoundObject: 'any'
  };

  function getClassitems(className) {
    return yuidocs.classitems.filter(function(classitem) {
      // Note that we first find items with the right class name,
      // but we also check for classitem.name because
      // YUIDoc includes classitems that we want to be undocumented
      // just because we used block comments.
      // We have other checks in place for finding missing method names
      // on public methods so a missing classitem.name implies that
      // the method is undocumented on purpose.
      // See https://github.com/processing/p5.js/issues/1252 and
      // https://github.com/processing/p5.js/pull/2301
      return classitem.class === className && classitem.name;
    });
  }

  function isValidP5ClassName(className) {
    return (
      (P5_CLASS_RE.test(className) && className in yuidocs.classes) ||
      (P5_CLASS_RE.test('p5.' + className) &&
        'p5.' + className in yuidocs.classes)
    );
  }

  /**
   * @param {string} type
   */
  function validateType(type) {
    return translateType(type);
  }

  function validateMethod(classitem, overload) {
    var errors = [];
    var paramNames = {};
    var optionalParamFound = false;

    if (!(JS_SYMBOL_RE.test(classitem.name) || classitem.is_constructor)) {
      errors.push('"' + classitem.name + '" is not a valid JS symbol name');
    }

    (overload.params || []).forEach(function(param) {
      if (param.optional) {
        optionalParamFound = true;
      } else if (optionalParamFound) {
        errors.push(
          'required param "' + param.name + '" follows an ' + 'optional param'
        );
      }

      if (param.name in paramNames) {
        errors.push('param "' + param.name + '" is defined multiple times');
      }
      paramNames[param.name] = true;

      if (!JS_SYMBOL_RE.test(param.name)) {
        errors.push('param "' + param.name + '" is not a valid JS symbol name');
      }

      if (!validateType(param.type)) {
        errors.push(
          'param "' + param.name + '" has invalid type: ' + param.type
        );
      }

      if (param.type === 'Constant') {
        var constantRe = /either\s+(?:[A-Z0-9_]+\s*,?\s*(?:or)?\s*)+/g;
        var execResult = constantRe.exec(param.description);
        var match;
        if (execResult) {
          match = execResult[0];
        }
        if (classitem.name === 'endShape' && param.name === 'mode') {
          match = 'CLOSE';
        }
        if (match) {
          var values = [];

          var reConst = /[A-Z0-9_]+/g;
          var matchConst;
          while ((matchConst = reConst.exec(match)) !== null) {
            values.push(matchConst);
          }
          var paramWords = param.name
            .split('.')
            .pop()
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .split(' ');
          var propWords = classitem.name
            .split('.')
            .pop()
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .split(' ');

          var constName;
          if (paramWords.length > 1 || propWords[0] === 'create') {
            constName = paramWords.join('_');
          } else if (
            propWords[propWords.length - 1] ===
            paramWords[paramWords.length - 1]
          ) {
            constName = propWords.join('_');
          } else {
            constName = propWords[0] + '_' + paramWords[paramWords.length - 1];
          }

          constName = constName.toUpperCase();
          constants[constName] = values;

          param.type = constName;
        }
      }
    });

    if (overload.return && !validateType(overload.return.type)) {
      errors.push('return has invalid type: ' + overload.return.type);
    }

    return errors;
  }

  /**
   *
   * @param {string} type
   * @param {string} [defaultType]
   */
  function translateType(type, defaultType) {
    if (type === void 0) {
      return defaultType;
    }

    type = type.trim();

    if (type === '') {
      return '';
    }

    if (type.length > 2 && type.substring(type.length - 2) === '[]') {
      return translateType(type.substr(0, type.length - 2), defaultType) + '[]';
    }

    var matchFunction = type.match(/Function\(([^)]*)\)/i);
    if (matchFunction) {
      var paramTypes = matchFunction[1].split(',');
      const mappedParamTypes = paramTypes.map((t, i) => {
        const paramName = 'p' + (i + 1);
        const paramType = translateType(t, 'any');
        return paramName + ': ' + paramType;
      });
      return '(' + mappedParamTypes.join(',') + ') => any';
    }

    var parts = type.split('|');
    if (parts.length > 1) {
      return parts.map(t => translateType(t, defaultType)).join('|');
    }

    const staticallyMappedType = YUIDOC_TO_TYPESCRIPT_PARAM_MAP[type];
    if (staticallyMappedType != null) {
      return staticallyMappedType;
    }

    if (EXTERNAL_TYPES.has(type)) {
      return type;
    }

    if (isValidP5ClassName(type)) {
      return type;
    }

    if (constants[type]) {
      return type;
    }

    missingTypes[type] = true;
    return defaultType;
  }

  function translateParam(param) {
    var name = param.name;
    if (name === 'class') {
      name = 'theClass';
    }

    return (
      name +
      (param.optional ? '?' : '') +
      ': ' +
      translateType(param.type, 'any')
    );
  }

  function generateClassMethod(className, classitem) {
    if (classitem.overloads) {
      classitem.overloads.forEach(function(overload) {
        generateClassMethodWithParams(className, classitem, overload);
      });
    } else {
      generateClassMethodWithParams(className, classitem, classitem);
    }
  }

  function generateClassMethodWithParams(className, classitem, overload) {
    var errors = validateMethod(classitem, overload);
    var params = (overload.params || []).map(translateParam);
    var returnType = overload.chainable
      ? className
      : overload.return ? translateType(overload.return.type, 'any') : 'void';
    var decl;

    if (classitem.is_constructor) {
      decl = 'constructor(' + params.join(', ') + ')';
    } else {
      decl =
        (overload.static ? 'static ' : '') +
        classitem.name +
        '(' +
        params.join(', ') +
        '): ' +
        returnType;
    }

    if (emit.getIndentLevel() === 0) {
      decl = 'declare function ' + decl + ';';
    }

    if (errors.length) {
      emit.sectionBreak();
      emit(
        '// TODO: Fix ' +
          classitem.name +
          '() errors in ' +
          overloadPosition(classitem, overload) +
          ':'
      );
      emit('//');
      errors.forEach(function(error) {
        console.log(
          classitem.name +
            '() ' +
            overloadPosition(classitem, overload) +
            ', ' +
            error
        );
        emit('//   ' + error);
      });
      emit('//');
      emit('// ' + decl);
      emit('');
    } else {
      emit.description(classitem, overload);
      emit(decl);
    }
  }

  function generateClassConstructor(className) {
    var classitem = yuidocs.classes[className];
    if (classitem.is_constructor) {
      generateClassMethod(className, classitem);
    }
  }

  function generateClassProperty(className, classitem) {
    if (JS_SYMBOL_RE.test(classitem.name)) {
      // TODO: It seems our properties don't carry any type information,
      // which is unfortunate. YUIDocs supports the @type tag on properties,
      // and even encourages using it, but we don't seem to use it.
      var translatedType = translateType(classitem.type, 'any');
      var defaultValue = classitem.default;
      if (classitem.final && translatedType === 'string' && !defaultValue) {
        defaultValue = classitem.name.toLowerCase().replace(/_/g, '-');
      }

      var decl;
      if (defaultValue) {
        decl = classitem.name + ': ';
        if (translatedType === 'string') {
          decl += "'" + defaultValue.replace(/'/g, "\\'") + "'";
        } else {
          decl += defaultValue;
        }
      } else {
        decl = classitem.name + ': ' + translatedType;
      }

      emit.description(classitem);

      if (emit.getIndentLevel() === 0) {
        const declarationType = classitem.final ? 'const ' : 'var ';
        emit('declare ' + declarationType + decl + ';');
      } else {
        const modifier = classitem.final ? 'readonly ' : '';
        emit(modifier + decl);
      }
    } else {
      emit.sectionBreak();
      emit(
        '// TODO: Property "' +
          classitem.name +
          '", defined in ' +
          classitemPosition(classitem) +
          ', is not a valid JS symbol name'
      );
      emit.sectionBreak();
    }
  }

  function generateClassProperties(className) {
    getClassitems(className).forEach(function(classitem) {
      classitem.file = classitem.file.replace(/\\/g, '/');
      emit.setCurrentSourceFile(classitem.file);
      if (classitem.itemtype === 'method') {
        generateClassMethod(className, classitem);
      } else if (classitem.itemtype === 'property') {
        generateClassProperty(className, classitem);
      } else {
        emit(
          '// TODO: Annotate ' +
            classitem.itemtype +
            ' "' +
            classitem.name +
            '", defined in ' +
            classitemPosition(classitem)
        );
      }
    });
  }

  function generateP5Properties(className) {
    emit.sectionBreak();
    emit('// Properties from ' + className);
    emit.sectionBreak();

    generateClassConstructor(className);
    generateClassProperties(className);
  }

  function generateP5Subclass(className) {
    var info = yuidocs.classes[className];
    var nestedClassName = className.match(P5_CLASS_RE)[1];

    info.file = info.file.replace(/\\/g, '/');
    emit.setCurrentSourceFile(info.file);

    emit(
      'class ' +
        nestedClassName +
        (info.extends ? ' extends ' + info.extends : '') +
        ' {'
    );
    emit.indent();

    generateClassConstructor(className);
    generateClassProperties(className);

    emit.dedent();
    emit('}');
  }

  function emitConstants() {
    emit('// Constants ');
    Object.keys(constants).forEach(function(key) {
      var values = constants[key];

      emit('type ' + key + ' =');
      values.forEach(function(v, i) {
        var str = ' typeof ' + v;
        str = (i ? '|' : ' ') + str;
        if (i === values.length - 1) {
          str += ';';
        }
        emit('    ' + str);
      });

      emit('');
    });
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
        throw new Error(
          className +
            ' is documented as a class but ' +
            "I'm not sure how to generate a type definition for it"
        );
      }
    });

    emit = createEmitter(localFileame);

    emit('declare class p5 {');
    emit.indent();

    p5Aliases.forEach(generateP5Properties);

    emit.dedent();
    emit('}\n');

    emit('declare namespace p5 {');
    emit.indent();

    p5Subclasses.forEach(generateP5Subclass);

    emit.dedent();
    emit('}\n');

    emit.close();

    emit = createEmitter(globalFilename);

    emit('///<reference path="p5.d.ts" />\n');

    p5Aliases.forEach(generateP5Properties);

    emitConstants();

    emit.close();

    for (var t in missingTypes) {
      console.log('MISSING: ', t);
    }
  }

  generate();
}

module.exports = mod;
