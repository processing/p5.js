/**
 * @module Shape
 * @submodule 3D Models
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

'use strict';

var p5 = require('../core/main');
require('./p5.Geometry');

/**
 * Load a 3d model from an OBJ file.
 * <br><br>
 * One of the limitations of the OBJ format is that it doesn't have a built-in
 * sense of scale. This means that models exported from different programs might
 * be very different sizes. If your model isn't displaying, try calling
 * <a href="#/p5/loadModel">loadModel()</a> with the normalized parameter set to true. This will resize the
 * model to a scale appropriate for p5. You can also make additional changes to
 * the final size of your model with the <a href="#/p5/scale">scale()</a> function.
 *
 * @method loadModel
 * @param  {String} path              Path of the model to be loaded
 * @param  {Boolean} normalize        If true, scale the model to a
 *                                      standardized size when loading
 * @param  {function(p5.Geometry)} [successCallback] Function to be called
 *                                     once the model is loaded. Will be passed
 *                                     the 3D model object.
 * @param  {function(Event)} [failureCallback] called with event error if
 *                                         the image fails to load.
 * @return {p5.Geometry} the <a href="#/p5.Geometry">p5.Geometry</a> object
 *
 * @example
 * <div>
 * <code>
 * //draw a spinning octahedron
 * let octahedron;
 *
 * function preload() {
 *   octahedron = loadModel('assets/octahedron.obj');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   model(octahedron);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Vertically rotating 3-d octahedron.
 *
 * @example
 * <div>
 * <code>
 * //draw a spinning teapot
 * let teapot;
 *
 * function preload() {
 *   // Load model with normalise parameter set to true
 *   teapot = loadModel('assets/teapot.obj', true);
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   scale(0.4); // Scaled to make model fit into canvas
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   normalMaterial(); // For effect
 *   model(teapot);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Vertically rotating 3-d teapot with red, green and blue gradient.
 */
/**
 * @method loadModel
 * @param  {String} path
 * @param  {function(p5.Geometry)} [successCallback]
 * @param  {function(Event)} [failureCallback]
 * @return {p5.Geometry} the <a href="#/p5.Geometry">p5.Geometry</a> object
 */
p5.prototype.loadModel = function(path) {
  p5._validateParameters('loadModel', arguments);
  var normalize;
  var successCallback;
  var failureCallback;
  if (typeof arguments[1] === 'boolean') {
    normalize = arguments[1];
    successCallback = arguments[2];
    failureCallback = arguments[3];
  } else {
    normalize = false;
    successCallback = arguments[1];
    failureCallback = arguments[2];
  }

  var model = new p5.Geometry();
  model.gid = path + '|' + normalize;
  var self = this;
  this.loadStrings(
    path,
    function(strings) {
      parseObj(model, strings);

      if (normalize) {
        model.normalize();
      }

      self._decrementPreload();
      if (typeof successCallback === 'function') {
        successCallback(model);
      }
    }.bind(this),
    failureCallback
  );

  return model;
};

/**
 * Parse OBJ lines into model. For reference, this is what a simple model of a
 * square might look like:
 *
 * v -0.5 -0.5 0.5
 * v -0.5 -0.5 -0.5
 * v -0.5 0.5 -0.5
 * v -0.5 0.5 0.5
 *
 * f 4 3 2 1
 */
function parseObj(model, lines) {
  // OBJ allows a face to specify an index for a vertex (in the above example),
  // but it also allows you to specify a custom combination of vertex, UV
  // coordinate, and vertex normal. So, "3/4/3" would mean, "use vertex 3 with
  // UV coordinate 4 and vertex normal 3". In WebGL, every vertex with different
  // parameters must be a different vertex, so loadedVerts is used to
  // temporarily store the parsed vertices, normals, etc., and indexedVerts is
  // used to map a specific combination (keyed on, for example, the string
  // "3/4/3"), to the actual index of the newly created vertex in the final
  // object.
  var loadedVerts = {
    v: [],
    vt: [],
    vn: []
  };
  var indexedVerts = {};

  for (var line = 0; line < lines.length; ++line) {
    // Each line is a separate object (vertex, face, vertex normal, etc)
    // For each line, split it into tokens on whitespace. The first token
    // describes the type.
    var tokens = lines[line].trim().split(/\b\s+/);

    if (tokens.length > 0) {
      if (tokens[0] === 'v' || tokens[0] === 'vn') {
        // Check if this line describes a vertex or vertex normal.
        // It will have three numeric parameters.
        var vertex = new p5.Vector(
          parseFloat(tokens[1]),
          parseFloat(tokens[2]),
          parseFloat(tokens[3])
        );
        loadedVerts[tokens[0]].push(vertex);
      } else if (tokens[0] === 'vt') {
        // Check if this line describes a texture coordinate.
        // It will have two numeric parameters.
        var texVertex = [parseFloat(tokens[1]), parseFloat(tokens[2])];
        loadedVerts[tokens[0]].push(texVertex);
      } else if (tokens[0] === 'f') {
        // Check if this line describes a face.
        // OBJ faces can have more than three points. Triangulate points.
        for (var tri = 3; tri < tokens.length; ++tri) {
          var face = [];

          var vertexTokens = [1, tri - 1, tri];

          for (var tokenInd = 0; tokenInd < vertexTokens.length; ++tokenInd) {
            // Now, convert the given token into an index
            var vertString = tokens[vertexTokens[tokenInd]];
            var vertIndex = 0;

            // TODO: Faces can technically use negative numbers to refer to the
            // previous nth vertex. I haven't seen this used in practice, but
            // it might be good to implement this in the future.

            if (indexedVerts[vertString] !== undefined) {
              vertIndex = indexedVerts[vertString];
            } else {
              var vertParts = vertString.split('/');
              for (var i = 0; i < vertParts.length; i++) {
                vertParts[i] = parseInt(vertParts[i]) - 1;
              }

              vertIndex = indexedVerts[vertString] = model.vertices.length;
              model.vertices.push(loadedVerts.v[vertParts[0]].copy());
              if (loadedVerts.vt[vertParts[1]]) {
                model.uvs.push(loadedVerts.vt[vertParts[1]].slice());
              } else {
                model.uvs.push([0, 0]);
              }

              if (loadedVerts.vn[vertParts[2]]) {
                model.vertexNormals.push(loadedVerts.vn[vertParts[2]].copy());
              }
            }

            face.push(vertIndex);
          }

          if (
            face[0] !== face[1] &&
            face[0] !== face[2] &&
            face[1] !== face[2]
          ) {
            model.faces.push(face);
          }
        }
      }
    }
  }
  // If the model doesn't have normals, compute the normals
  if (model.vertexNormals.length === 0) {
    model.computeNormals();
  }

  return model;
}

/**
 * Render a 3d model to the screen.
 *
 * @method model
 * @param  {p5.Geometry} model Loaded 3d model to be rendered
 * @example
 * <div>
 * <code>
 * //draw a spinning octahedron
 * let octahedron;
 *
 * function preload() {
 *   octahedron = loadModel('assets/octahedron.obj');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   model(octahedron);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Vertically rotating 3-d octahedron.
 *
 */
p5.prototype.model = function(model) {
  this._assert3d('model');
  p5._validateParameters('model', arguments);
  if (model.vertices.length > 0) {
    if (!this._renderer.geometryInHash(model.gid)) {
      model._makeTriangleEdges()._edgesToVertices();
      this._renderer.createBuffers(model.gid, model);
    }

    this._renderer.drawBuffers(model.gid);
  }
};

module.exports = p5;
