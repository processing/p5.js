var fs = require('fs');
var Shader = require('./p5.Shader');

// var immediateVert = fs.readFileSync(__dirname + '/shaders/immediate.vert',
//                                     'utf-8');
//var vertexColorVert = fs.readFileSync(__dirname + '/shaders/vertexColor.vert',
//                                       'utf-8');
//var vertexColorFrag = fs.readFileSync(__dirname + '/shaders/vertexColor.frag',
//                                       'utf-8');
var normalVert = fs.readFileSync(__dirname + '/shaders/normal.vert', 'utf-8');
var normalFrag = fs.readFileSync(__dirname + '/shaders/normal.frag', 'utf-8');
// var basicFrag = fs.readFileSync(__dirname + '/shaders/basic.frag', 'utf-8');
var lightVert = fs.readFileSync(__dirname + '/shaders/light.vert', 'utf-8');
var lightTexFrag = fs.readFileSync(__dirname + '/shaders/light_texture.frag',
                                   'utf-8');

module.exports = {
  default: new Shader(lightTexFrag, lightVert),
  normal:  new Shader(normalFrag, normalVert)
};