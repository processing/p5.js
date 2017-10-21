var generate = require('./generate-typescript-annotations');
var path = require('path');

module.exports = function(grunt) {
  var yuidocs = require('../../docs/reference/data.json');
  var base = path.join(__dirname, '../../lib');
  generate(yuidocs, path.join(base, 'p5.d.ts'), path.join(base, 'p5.global-mode.d.ts'));
};
