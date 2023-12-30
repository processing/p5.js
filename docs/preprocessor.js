const marked = require('marked');
const Entities = require('html-entities').AllHtmlEntities;

const DocumentedMethod = require('./documented-method');

function smokeTestMethods(data) {
  data.classitems.forEach(function(classitem) {
    if (classitem.itemtype === 'method') {
      new DocumentedMethod(classitem);

      if (
        classitem.access !== 'private' &&
        classitem.file.slice(0, 3) === 'src' &&
        classitem.name &&
        !classitem.example
      ) {
        console.log(
          classitem.file +
            ':' +
            classitem.line +
            ': ' +
            classitem.itemtype +
            ' ' +
            classitem.class +
            '.' +
            classitem.name +
            ' missing example'
        );
      }
    }
  });
}

function mergeOverloadedMethods(data) {
  let methodsByFullName = {};
  let paramsForOverloadedMethods = {};

  let consts = (data.consts = {});

  data.classitems = data.classitems.filter(function(classitem) {
    if (classitem.access === 'private') {
      return false;
    }

    const itemClass = data.classes[classitem.class];
    if (!itemClass || itemClass.private) {
      return false;
    }

    let methodConsts = {};

    let fullName, method;

    var assertEqual = function(a, b, msg) {
      if (a !== b) {
        throw new Error(
          'for ' +
            fullName +
            '() defined in ' +
            classitem.file +
            ':' +
            classitem.line +
            ', ' +
            msg +
            ' (' +
            JSON.stringify(a) +
            ' !== ' +
            JSON.stringify(b) +
            ')'
        );
      }
    };

    var extractConsts = function(param) {
      if (!param.type) {
        console.log(param);
      }
      if (param.type.split('|').indexOf('Constant') >= 0) {
        let match;
        if (classitem.name === 'endShape' && param.name === 'mode') {
          match = 'CLOSE';
        } else {
          const constantRe = /either\s+(?:[A-Z0-9_]+\s*,?\s*(?:or)?\s*)+/g;
          const execResult = constantRe.exec(param.description);
          match = execResult && execResult[0];
          if (!match) {
            throw new Error(
              classitem.file +
                ':' +
                classitem.line +
                ', Constant-typed parameter ' +
                fullName +
                '(...' +
                param.name +
                '...) is missing valid value enumeration. ' +
                'See inline_documentation.md#specify-parameters.'
            );
          }
        }
        if (match) {
          const reConst = /[A-Z0-9_]+/g;
          let matchConst;
          while ((matchConst = reConst.exec(match)) !== null) {
            methodConsts[matchConst] = true;
          }
        }
      }
    };

    var processOverloadedParams = function(params) {
      let paramNames;

      if (!(fullName in paramsForOverloadedMethods)) {
        paramsForOverloadedMethods[fullName] = {};
      }

      paramNames = paramsForOverloadedMethods[fullName];

      params.forEach(function(param) {
        const origParam = paramNames[param.name];

        if (origParam) {
          assertEqual(
            origParam.type,
            param.type,
            'types for param "' +
              param.name +
              '" must match ' +
              'across all overloads'
          );
          assertEqual(
            param.description,
            '',
            'description for param "' +
              param.name +
              '" should ' +
              'only be defined in its first use; subsequent ' +
              'overloads should leave it empty'
          );
        } else {
          paramNames[param.name] = param;
          extractConsts(param);
        }
      });

      return params;
    };

    if (classitem.itemtype && classitem.itemtype === 'method') {
      fullName = classitem.class + '.' + classitem.name;
      if (fullName in methodsByFullName) {
        // It's an overloaded version of a method that we've already
        // indexed. We need to make sure that we don't list it multiple
        // times in our index pages and such.

        method = methodsByFullName[fullName];

        assertEqual(
          method.file,
          classitem.file,
          'all overloads must be defined in the same file'
        );
        assertEqual(
          method.module,
          classitem.module,
          'all overloads must be defined in the same module'
        );
        assertEqual(
          method.submodule,
          classitem.submodule,
          'all overloads must be defined in the same submodule'
        );
        assertEqual(
          classitem.description || '',
          '',
          'additional overloads should have no description'
        );

        var makeOverload = function(method) {
          const overload = {
            line: method.line,
            params: processOverloadedParams(method.params || [])
          };
          // TODO: the doc renderer assumes (incorrectly) that
          //   these are the same for all overrides
          if (method.static) overload.static = method.static;
          if (method.chainable) overload.chainable = method.chainable;
          if (method.return) overload.return = method.return;
          return overload;
        };

        if (!method.overloads) {
          method.overloads = [makeOverload(method)];
          delete method.params;
        }
        method.overloads.push(makeOverload(classitem));
        return false;
      } else {
        if (classitem.params) {
          classitem.params.forEach(function(param) {
            extractConsts(param);
          });
        }
        methodsByFullName[fullName] = classitem;
      }

      Object.keys(methodConsts).forEach(constName =>
        (consts[constName] || (consts[constName] = [])).push(fullName)
      );
    }
    return true;
  });
}

// build a copy of data.json for the FES, restructured for object lookup on
// classitems and removing all the parts not needed by the FES
function buildParamDocs(docs) {
  let newClassItems = {};
  // the fields we need for the FES, discard everything else
  let allowed = new Set(['name', 'class', 'module', 'params', 'overloads']);
  for (let classitem of docs.classitems) {
    if (classitem.name && classitem.class) {
      for (let key in classitem) {
        if (!allowed.has(key)) {
          delete classitem[key];
        }
      }
      if (classitem.hasOwnProperty('overloads')) {
        for (let overload of classitem.overloads) {
          // remove line number and return type
          if (overload.line) {
            delete overload.line;
          }

          if (overload.return) {
            delete overload.return;
          }
        }
      }
      if (!newClassItems[classitem.class]) {
        newClassItems[classitem.class] = {};
      }

      newClassItems[classitem.class][classitem.name] = classitem;
    }
  }

  let fs = require('fs');
  let path = require('path');
  let out = fs.createWriteStream(
    path.join(process.cwd(), 'docs', 'parameterData.json'),
    {
      flags: 'w',
      mode: '0644'
    }
  );
  out.write(JSON.stringify(newClassItems, null, 2));
  out.end();
}

function renderItemDescriptionsAsMarkdown(item) {
  if (item.description) {
    const entities = new Entities();
    item.description = entities.decode(marked.parse(item.description));
  }
  if (item.params) {
    item.params.forEach(renderItemDescriptionsAsMarkdown);
  }
}

function renderDescriptionsAsMarkdown(data) {
  Object.keys(data.modules).forEach(function(moduleName) {
    renderItemDescriptionsAsMarkdown(data.modules[moduleName]);
  });
  Object.keys(data.classes).forEach(function(className) {
    renderItemDescriptionsAsMarkdown(data.classes[className]);
  });
  data.classitems.forEach(function(classitem) {
    renderItemDescriptionsAsMarkdown(classitem);
  });
}

module.exports = (data, options) => {
  data.classitems
    .filter(
      ci => !ci.itemtype && (ci.params || ci.return) && ci.access !== 'private'
    )
    .forEach(ci => {
      p5._friendlyError(ci.file + ':' + ci.line + ': unnamed public member');
    });

  Object.keys(data.classes)
    .filter(k => data.classes[k].access === 'private')
    .forEach(k => delete data.classes[k]);

  renderDescriptionsAsMarkdown(data);
  mergeOverloadedMethods(data);
  smokeTestMethods(data);
  buildParamDocs(JSON.parse(JSON.stringify(data)));
};

module.exports.mergeOverloadedMethods = mergeOverloadedMethods;
module.exports.renderDescriptionsAsMarkdown = renderDescriptionsAsMarkdown;

module.exports.register = (Handlebars, options) => {
  Handlebars.registerHelper('root', function(context, options) {
    // if (this.language === 'en') {
    //   return '';
    // } else {
    //   return '/'+this.language;
    // }
    return window.location.pathname;
  });
};
