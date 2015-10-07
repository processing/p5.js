/**
 * @module Shape
 * @submodule 3D Models
 * @for p5
 * @requires core
 * @requires p5.Geometry3D
 */

'use strict';

var p5 = require('../core/core');
require('./p5.Geometry3D');

/**
 * Load a 3d model from an OBJ file.
 * @method makeModel
 * @param  {String} url        width of the plane
 * @return {p5}
 * @example
 * <div>
 * <code>
 * // example goes here
 * </code>
 * </div>
 */
p5.prototype.loadModel = function(path, scaleFactor){
  var model = new p5.Geometry3D();

  // TODO: This shouldn't just be thrown on to the geometry object now
  model.gid = path;

  // Check for a duplicate loaded object ??
  if(!this._renderer.geometryInHash(model.gid)){
    this.loadStrings(path, function(strings) {
      parseObj(model, strings, scaleFactor);
    }.bind(this));
  }

  return model;
};

/**
 * k;jlkj;lk
 */
function parseObj(model, lines, scaleFactor){
  var uvs = [];
  var normals = [];

  for(var i = 0; i < lines.length; ++i) {
    var tokens = lines[i].split(/\b\s+/);

    if(tokens.length > 0) {
      if(tokens[0] === 'v') {
        var vertex = new p5.Vector(parseFloat(tokens[1]) * scaleFactor,
                                   parseFloat(tokens[2]) * scaleFactor,
                                   parseFloat(tokens[3]) * scaleFactor);
        model.vertices.push(vertex);
      } else if(tokens[0] === 'vt') {
        var texVertex = [parseFloat(tokens[1]), parseFloat(tokens[2])];
        uvs.push(texVertex);
      } else if(tokens[0] === 'vn') {
        var normal = new p5.Vector(parseFloat(tokens[1]),
                                   parseFloat(tokens[2]),
                                   parseFloat(tokens[3]));
        normals.push(normal);
      } else if(tokens[0] === 'f') {
        // Parse faces
        var faces = [];
        for(var j = 1; j < tokens.length; ++j) {
          faces.push(tokens[j].split('/'));
        }

        // Triangulate faces with more than 4 vertices
        for(var vertIndex = 1; vertIndex < faces.length - 1; ++vertIndex) {
          var face = [parseInt(faces[0][0]) - 1,
                      parseInt(faces[vertIndex][0]) - 1,
                      parseInt(faces[vertIndex + 1][0]) - 1];
          model.faces.push(face);

          //TODO: check to make sure that there are UVs
          var faceUVs = [uvs[parseInt(faces[0][1]) - 1],
                         uvs[parseInt(faces[vertIndex][1]) - 1],
                         uvs[parseInt(faces[vertIndex + 1][1]) - 1]];
          model.uvs.push(faceUVs);

          //TODO: check to make sure that there are normals
          // var faceNormals = [normals[parseInt(faces[0][2]) - 1],
          //                    normals[parseInt(faces[vertIndex][2]) - 1],
          //                    normals[parseInt(faces[vertIndex + 1][2]) - 1]];
          // model.vertexNormals.push(faceUVs);
        }
      }
    }
  }

  return model;
}

/**
 * Draw a 3d model
 */
p5.prototype.model = function(model){
  // TODO: Some sort of "not loaded" flag? See what PImage does
  if(model.vertices.length > 0) {
    if(!this._renderer.geometryInHash(model.gid)){
      var obj = model.generateObj();
      this._renderer.initBuffer(model.gid, obj);
    }

    this._renderer.drawBuffer(model.gid);
  }
};

module.exports = p5;
