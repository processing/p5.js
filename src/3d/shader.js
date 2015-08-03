var fs = require('fs');

module.exports = {
  vertexColorVert:
    fs.readFileSync(__dirname +'/shaders/vertexColor.vert', 'utf-8'),
  vertexColorFrag:
    fs.readFileSync(__dirname +'/shaders/vertexColor.frag', 'utf-8'),
  normalVert: fs.readFileSync(__dirname +'/shaders/normal.vert', 'utf-8'),
  normalFrag: fs.readFileSync(__dirname +'/shaders/normal.frag', 'utf-8'),
  basicFrag: fs.readFileSync(__dirname +'/shaders/basic.frag', 'utf-8'),
  textureFrag: fs.readFileSync(__dirname +'/shaders/texture.frag', 'utf-8'),
  lightFrag: fs.readFileSync(__dirname +'/shaders/light.frag', 'utf-8'),
  directionalLightVert:
    fs.readFileSync(__dirname +'/shaders/directionalLight.vert', 'utf-8'),
  spotLightVert:
    fs.readFileSync(__dirname +'/shaders/pointLight.vert', 'utf-8')
};