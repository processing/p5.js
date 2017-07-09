var fs = require('fs');

module.exports = {
  immediateVert:
    fs.readFileSync(__dirname + '/shaders/immediate.vert', 'utf-8'),
  vertexColorVert:
    fs.readFileSync(__dirname + '/shaders/vertexColor.vert', 'utf-8'),
  vertexColorFrag:
    fs.readFileSync(__dirname + '/shaders/vertexColor.frag', 'utf-8'),
  normalVert:
    fs.readFileSync(__dirname + '/shaders/normal.vert', 'utf-8'),
  normalFrag:
    fs.readFileSync(__dirname + '/shaders/normal.frag', 'utf-8'),
  basicFrag:
    fs.readFileSync(__dirname + '/shaders/basic.frag', 'utf-8'),
  lightVert:
    fs.readFileSync(__dirname + '/shaders/light.vert', 'utf-8'),
  lightTextureFrag:
    fs.readFileSync(__dirname + '/shaders/light_texture.frag', 'utf-8')
};