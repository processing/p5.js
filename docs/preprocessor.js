var marked = require('marked');

var DocumentedMethod = require('./yuidoc-p5-theme-src/scripts/documented-method');

function smokeTestMethods(data) {
  data.classitems.forEach(function(classitem) {
    if (classitem.itemtype === 'method') {
      new DocumentedMethod(classitem);

      if (classitem.access !== 'private' &&
        classitem.file.substr(0, 3) === 'src' &&
        classitem.name &&
        !classitem.example) {
        console.log(classitem.file + ':' + classitem.line +
          ': ' + classitem.itemtype + ' ' +
          classitem.class + '.' + classitem.name +
          ' missing example');
      }
    }
  });
}

function mergeOverloadedMethods(data) {
  var methodsByFullName = {};
  var paramsForOverloadedMethods = {};

  data.classitems = data.classitems.filter(function(classitem) {
    var fullName, method;

    var assertEqual = function(a, b, msg) {
      if (a !== b) {
        throw new Error(
          'for ' + fullName + '() defined in ' + classitem.file + ':' +
          classitem.line + ', ' +
          msg + ' (' + JSON.stringify(a) + ' !== ' + JSON.stringify(b) + ')'
        );
      }
    };

    var processOverloadedParams = function(params) {
      var paramNames;

      if (!(fullName in paramsForOverloadedMethods)) {
        paramsForOverloadedMethods[fullName] = {};
      }

      paramNames = paramsForOverloadedMethods[fullName];

      params.forEach(function(param) {
        var origParam = paramNames[param.name];

        if (origParam) {
          assertEqual(origParam.type, param.type,
                      'types for param "' + param.name + '" must match ' +
                      'across all overloads');
          assertEqual(param.description, '',
                      'description for param "' + param.name + '" should ' +
                      'only be defined in its first use; subsequent ' +
                      'overloads should leave it empty');
        } else {
          paramNames[param.name] = param;
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

        assertEqual(method.file, classitem.file,
                    'all overloads must be defined in the same file');
        assertEqual(method.module, classitem.module,
                    'all overloads must be defined in the same module');
        assertEqual(method.submodule, classitem.submodule,
                    'all overloads must be defined in the same submodule');
        assertEqual(classitem.description || '', '',
                    'additional overloads should have no description');

        function makeOverload(method) {
          var overload = {
            line: method.line,
            params: processOverloadedParams(method.params || [])
          };
          // TODO: the doc renderer assumes (incorrectly) that
          //   these are the same for all overrides
          if (method.static)
            overload.static = method.static;
          if (method.chainable)
            overload.chainable = method.chainable;
          if (method.return)
            overload.return = method.return;
          return overload;
        }

        if (!method.overloads) {
          method.overloads = [makeOverload(method)];
          delete method.params;
        }
        method.overloads.push(makeOverload(classitem));
        return false;
      } else {
        methodsByFullName[fullName] = classitem;
      }
    }
    return true;
  });
}

function renderItemDescriptionsAsMarkdown(item) {
  if (item.description) {
    item.description = marked(item.description);
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

module.exports = function(data, options) {
  renderDescriptionsAsMarkdown(data);
  mergeOverloadedMethods(data);
  smokeTestMethods(data);
};

module.exports.mergeOverloadedMethods = mergeOverloadedMethods;
module.exports.renderDescriptionsAsMarkdown = renderDescriptionsAsMarkdown;



module.exports.register = function(Handlebars, options) {

  Handlebars.registerHelper('root', function(context, options) {
    // if (this.language === 'en') {
    //   return '';
    // } else {
    //   return '/'+this.language;
    // }
    return window.location.pathname
  });
};

