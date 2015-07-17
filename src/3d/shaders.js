/*
Part of the Processing project - http://processing.org

Copyright (c) 2011-13 Ben Fry and Casey Reas

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License version 2.1 as published by the Free Software Foundation.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General
Public License along with this library; if not, write to the
Free Software Foundation, Inc., 59 Temple Place, Suite 330,
Boston, MA  02111-1307  USA
 */
/**
 * @description Default full shaders for our WebGL context
 */
module.exports = {
  texLightVert : [
    'uniform mat4 modelviewMatrix;',
    'uniform mat4 transformMatrix;',
    'uniform mat3 normalMatrix;',
    'uniform mat4 texMatrix;',

    'uniform int lightCount;',
    'uniform vec4 lightPosition[8];',
    'uniform vec3 lightNormal[8];',
    'uniform vec3 lightAmbient[8];',
    'uniform vec3 lightDiffuse[8];',
    'uniform vec3 lightSpecular[8];',
    'uniform vec3 lightFalloff[8];',
    'uniform vec2 lightSpot[8];',

    'attribute vec4 position;',
    'attribute vec4 color;',
    'attribute vec3 normal;',
    'attribute vec2 texCoord;',

    'attribute vec4 ambient;',
    'attribute vec4 specular;',
    'attribute vec4 emissive;',
    'attribute float shininess;',

    'varying vec4 vertColor;',
    'varying vec4 backVertColor;',
    'varying vec4 vertTexCoord;',

    'const float zero_float = 0.0;',
    'const float one_float = 1.0;',
    'const vec3 zero_vec3 = vec3(0);',

    'float falloffFactor(vec3 lightPos, vec3 vertPos, vec3 coeff) {',
    'vec3 lpv = lightPos - vertPos;',
    'vec3 dist = vec3(one_float);',
    'dist.z = dot(lpv, lpv);',
    'dist.y = sqrt(dist.z);',
    'return one_float / dot(dist, coeff);',
    '}',

    'float spotFactor(vec3 lightPos,vec3 vertPos,',
    'vec3 lightNorm,float minCos,float spotExp) {',
    'vec3 lpv = normalize(lightPos - vertPos);',
    'vec3 nln = -one_float * lightNorm;',
    'float spotCos = dot(nln, lpv);',
    'return spotCos <= minCos ? zero_float : pow(spotCos, spotExp);',
    '}',
    'float lambertFactor(vec3 lightDir, vec3 vecNormal) {',
    'return max(zero_float, dot(lightDir, vecNormal));',
    '}',

    'float blinnPhongFactor(vec3 lightDir,',
    'vec3 vertPos,vec3 vecNormal, float shine) {',
    'vec3 np = normalize(vertPos);',
    'vec3 ldp = normalize(lightDir - np);',
    'return pow(max(zero_float, dot(ldp, vecNormal)), shine);',
    '}',

    'void main() {',
      // Vertex in clip coordinates
    'gl_Position = transformMatrix * position;',

      // Vertex in eye coordinates
    'vec3 ecVertex = vec3(modelviewMatrix * position);',

      // Normal vector in eye coordinates
    'vec3 ecNormal = normalize(normalMatrix * normal);',
    'vec3 ecNormalInv = ecNormal * -one_float;',

    // Light calculations
    'vec3 totalAmbient = vec3(0, 0, 0);',

    'vec3 totalFrontDiffuse = vec3(0, 0, 0);',
    'vec3 totalFrontSpecular = vec3(0, 0, 0);',

    'vec3 totalBackDiffuse = vec3(0, 0, 0);',
    'vec3 totalBackSpecular = vec3(0, 0, 0);',

    'for (int i = 0; i < 8; i++) {',
    'if (lightCount == i) break;',

    'vec3 lightPos = lightPosition[i].xyz;',
    'bool isDir = zero_float < lightPosition[i].w;',
    'float spotCos = lightSpot[i].x;',
    'float spotExp = lightSpot[i].y;',

    'vec3 lightDir;',
    'float falloff;',
    'float spotf;',

    'if (isDir) {',
    'falloff = one_float;',
    'lightDir = -one_float * lightNormal[i];',
    '} else {',
    'falloff = falloffFactor(lightPos, ecVertex, lightFalloff[i]);',
    'lightDir = normalize(lightPos - ecVertex);',
    '}',

    'spotf=spotExp > zero_float ? spotFactor(lightPos,',
    'ecVertex,',
    'lightNormal[i],',
    'spotCos,',
    'spotExp):one_float;',

    'if (any(greaterThan(lightAmbient[i], zero_vec3))) {',
    'totalAmbient+= lightAmbient[i] * falloff;',
    '}',

    'if (any(greaterThan(lightDiffuse[i], zero_vec3))) {',
    'totalFrontDiffuse  += lightDiffuse[i] * falloff * spotf *',
    'lambertFactor(lightDir, ecNormal);',
    'totalBackDiffuse   += lightDiffuse[i] * falloff * spotf *',
    'lambertFactor(lightDir, ecNormalInv);',
    '}',

    'if (any(greaterThan(lightSpecular[i], zero_vec3))) {',
    'totalFrontSpecular += lightSpecular[i] * falloff * spotf * ',
    'blinnPhongFactor(lightDir, ecVertex, ecNormal, shininess);',
    'totalBackSpecular  += lightSpecular[i] * falloff * spotf *',
    'blinnPhongFactor(lightDir, ecVertex, ecNormalInv, shininess);',
    '}',
    '}',

    // Calculating final color as result of all lights (plus emissive term).
    // Transparency is determined exclusively by the diffuse component.
    'vertColor =vec4(totalAmbient, 0) * ambient + ',
    'vec4(totalFrontDiffuse, 1) * color +' ,
    'vec4(totalFrontSpecular, 0) * specular +',
    'vec4(emissive.rgb, 0);',

    'backVertColor = vec4(totalAmbient, 0) * ambient + ',
    'vec4(totalBackDiffuse, 1) * color +',
    'vec4(totalBackSpecular, 0) * specular +',
    'vec4(emissive.rgb, 0);',

      // Calculating texture coordinates, with r and q set both to one
    'vertTexCoord = texMatrix * vec4(texCoord, 1.0, 1.0);',
    '}'
  ].join('\n'),
  texLightFrag : [
    'precision mediump float;',
    'precision mediump int;',
    'uniform sampler2D texture;',

    'uniform vec2 texOffset;',

    'varying vec4 vertColor;',
    'varying vec4 backVertColor;',
    'varying vec4 vertTexCoord;',

    'void main() {',
    'gl_FragColor = texture2D(texture,vertTexCoord.st)*',
    '(gl_FrontFacing ? vertColor : backVertColor);',
    '}'
  ].join('\n'),
  normalVert: [
    'attribute vec3 position;',
    'attribute vec3 normal;',

    'uniform mat4 modelviewMatrix;',
    'uniform mat4 transformMatrix;',
    'uniform mat4 normalMatrix;',

    'varying vec3 vertexNormal;',

    'void main(void) {',
    'vec3 zeroToOne = position / 1000.0;',
    'vec4 positionVec4 = vec4(zeroToOne, 1.);',
    'gl_Position = transformMatrix * modelviewMatrix * positionVec4;',
    'vertexNormal = vec3( normalMatrix * vec4( normal, 1.0 ) );',
    '}'
  ].join('\n'),
  normalFrag: [
    'precision mediump float;',
    'varying vec3 vertexNormal;',
    'void main(void) {',
    'gl_FragColor = vec4(vertexNormal, 1.0);',
    '}'
  ].join('\n'),
  basicFrag: [
    'precision mediump float;',
    'varying vec3 vertexNormal;',
    //'uniform vec3 uBasic'
    'void main(void) {',
    // 'gl_FragColor = vec4(vertexNormal * uBasic, 1.0);',
    'gl_FragColor = vec4(vertexNormal * vec3(0.5, 0.5, 0.5), 1.0);',
    '}'
   ].join('\n'),
  vertexColorVert:[
    'attribute vec3 position;',

    'attribute vec4 aVertexColor;',

    'uniform mat4 modelviewMatrix;',
    'uniform mat4 transformMatrix;',

    'varying vec4 vColor;',
    'void main(void) {',
    'vec3 zeroToOne = position / 1000.0;',
    'vec4 positionVec4 = vec4(zeroToOne, 1.);',
    'gl_Position = transformMatrix * modelviewMatrix * positionVec4;',
    'vColor = aVertexColor;',
    '}'
  ].join('\n'),
  vertexColorFrag:[
    'precision mediump float;',
    'varying vec4 vColor;',
    'void main(void) {',
    '    gl_FragColor = vColor;',
    '}'
  ].join('\n')
};