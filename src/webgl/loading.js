/**
 * @module Shape
 * @submodule 3D Models
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

'use strict';

import p5 from '../core/main';
import './p5.Geometry';

/**
 * Load a 3d model from an OBJ or STL file.
 * <br><br>
 * One of the limitations of the OBJ and STL format is that it doesn't have a built-in
 * sense of scale. This means that models exported from different programs might
 * be very different sizes. If your model isn't displaying, try calling
 * <a href="#/p5/loadModel">loadModel()</a> with the normalized parameter set to true. This will resize the
 * model to a scale appropriate for p5. You can also make additional changes to
 * the final size of your model with the <a href="#/p5/scale">scale()</a> function.
 *
 * Also, the support for colored STL files is not present. STL files with color will be
 * rendered without color properties.
 *
 * @method loadModel
 * @param  {String} path              Path of the model to be loaded
 * @param  {Boolean} normalize        If true, scale the model to a
 *                                      standardized size when loading
 * @param  {function(p5.Geometry)} [successCallback] Function to be called
 *                                     once the model is loaded. Will be passed
 *                                     the 3D model object.
 * @param  {function(Event)} [failureCallback] called with event error if
 *                                         the model fails to load.
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

  var fileType = path.slice(-4);
  var model = new p5.Geometry();
  model.gid = path + '|' + normalize;
  var self = this;

  if (fileType === '.stl') {
    this.httpDo(
      path,
      'GET',
      'arrayBuffer',
      function(arrayBuffer) {
        parseSTL(model, arrayBuffer);

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
  } else if (fileType === '.obj') {
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
  } else {
    p5._friendlyFileLoadError(3, path);

    if (failureCallback) {
      failureCallback();
    } else {
      console.error(
        'Sorry, the file type is invalid. Only OBJ and STL files are supported.'
      );
    }
  }
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
 * STL files can be of two types, ASCII and Binary,
 *
 * We need to convert the arrayBuffer to an array of strings,
 * to parse it as an ASCII file.
 */
function parseSTL(model, buffer) {
  if (isBinary(buffer)) {
    parseBinarySTL(model, buffer);
  } else {
    var reader = new DataView(buffer);

    if (!('TextDecoder' in window)) {
      console.warn(
        'Sorry, ASCII STL loading only works in browsers that support TextDecoder (https://caniuse.com/#feat=textencoder)'
      );
      return model;
    }

    var decoder = new TextDecoder('utf-8');
    var lines = decoder.decode(reader);
    var lineArray = lines.split('\n');
    parseASCIISTL(model, lineArray);
  }
  return model;
}

/**
 * This function checks if the file is in ASCII format or in Binary format
 *
 * It is done by searching keyword `solid` at the start of the file.
 *
 * An ASCII STL data must begin with `solid` as the first six bytes.
 * However, ASCII STLs lacking the SPACE after the `d` are known to be
 * plentiful. So, check the first 5 bytes for `solid`.
 *
 * Several encodings, such as UTF-8, precede the text with up to 5 bytes:
 * https://en.wikipedia.org/wiki/Byte_order_mark#Byte_order_marks_by_encoding
 * Search for `solid` to start anywhere after those prefixes.
 */
function isBinary(data) {
  var reader = new DataView(data);

  // US-ASCII ordinal values for `s`, `o`, `l`, `i`, `d`
  var solid = [115, 111, 108, 105, 100];
  for (var off = 0; off < 5; off++) {
    // If "solid" text is matched to the current offset, declare it to be an ASCII STL.
    if (matchDataViewAt(solid, reader, off)) return false;
  }

  // Couldn't find "solid" text at the beginning; it is binary STL.
  return true;
}

/**
 * This function matches the `query` at the provided `offset`
 */
function matchDataViewAt(query, reader, offset) {
  // Check if each byte in query matches the corresponding byte from the current offset
  for (var i = 0, il = query.length; i < il; i++) {
    if (query[i] !== reader.getUint8(offset + i, false)) return false;
  }

  return true;
}

/**
 * This function parses the Binary STL files.
 * https://en.wikipedia.org/wiki/STL_%28file_format%29#Binary_STL
 *
 * Currently there is no support for the colors provided in STL files.
 */
function parseBinarySTL(model, buffer) {
  var reader = new DataView(buffer);

  // Number of faces is present following the header
  var faces = reader.getUint32(80, true);
  var r,
    g,
    b,
    hasColors = false,
    colors;
  var defaultR, defaultG, defaultB;

  // Binary files contain 80-byte header, which is generally ignored.
  for (var index = 0; index < 80 - 10; index++) {
    // Check for `COLOR=`
    if (
      reader.getUint32(index, false) === 0x434f4c4f /*COLO*/ &&
      reader.getUint8(index + 4) === 0x52 /*'R'*/ &&
      reader.getUint8(index + 5) === 0x3d /*'='*/
    ) {
      hasColors = true;
      colors = [];

      defaultR = reader.getUint8(index + 6) / 255;
      defaultG = reader.getUint8(index + 7) / 255;
      defaultB = reader.getUint8(index + 8) / 255;
      // To be used when color support is added
      // alpha = reader.getUint8(index + 9) / 255;
    }
  }
  var dataOffset = 84;
  var faceLength = 12 * 4 + 2;

  // Iterate the faces
  for (var face = 0; face < faces; face++) {
    var start = dataOffset + face * faceLength;
    var normalX = reader.getFloat32(start, true);
    var normalY = reader.getFloat32(start + 4, true);
    var normalZ = reader.getFloat32(start + 8, true);

    if (hasColors) {
      var packedColor = reader.getUint16(start + 48, true);

      if ((packedColor & 0x8000) === 0) {
        // facet has its own unique color
        r = (packedColor & 0x1f) / 31;
        g = ((packedColor >> 5) & 0x1f) / 31;
        b = ((packedColor >> 10) & 0x1f) / 31;
      } else {
        r = defaultR;
        g = defaultG;
        b = defaultB;
      }
    }

    for (var i = 1; i <= 3; i++) {
      var vertexstart = start + i * 12;

      var newVertex = new p5.Vector(
        reader.getFloat32(vertexstart, true),
        reader.getFloat32(vertexstart + 8, true),
        reader.getFloat32(vertexstart + 4, true)
      );

      model.vertices.push(newVertex);

      if (hasColors) {
        colors.push(r, g, b);
      }
    }

    var newNormal = new p5.Vector(normalX, normalY, normalZ);

    model.vertexNormals.push(newNormal, newNormal, newNormal);

    model.faces.push([3 * face, 3 * face + 1, 3 * face + 2]);
  }
  if (hasColors) {
    // add support for colors here.
  }
  return model;
}

/**
 * ASCII STL file starts with `solid 'nameOfFile'`
 * Then contain the normal of the face, starting with `facet normal`
 * Next contain a keyword indicating the start of face vertex, `outer loop`
 * Next comes the three vertex, starting with `vertex x y z`
 * Vertices ends with `endloop`
 * Face ends with `endfacet`
 * Next face starts with `facet normal`
 * The end of the file is indicated by `endsolid`
 */
function parseASCIISTL(model, lines) {
  var state = '';
  var curVertexIndex = [];
  var newNormal, newVertex;

  for (var iterator = 0; iterator < lines.length; ++iterator) {
    var line = lines[iterator].trim();
    var parts = line.split(' ');

    for (var partsiterator = 0; partsiterator < parts.length; ++partsiterator) {
      if (parts[partsiterator] === '') {
        // Ignoring multiple whitespaces
        parts.splice(partsiterator, 1);
      }
    }

    if (parts.length === 0) {
      // Remove newline
      continue;
    }

    switch (state) {
      case '': // First run
        if (parts[0] !== 'solid') {
          // Invalid state
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "solid"');
          return;
        } else {
          state = 'solid';
        }
        break;

      case 'solid': // First face
        if (parts[0] !== 'facet' || parts[1] !== 'normal') {
          // Invalid state
          console.error(line);
          console.error(
            'Invalid state "' + parts[0] + '", should be "facet normal"'
          );
          return;
        } else {
          // Push normal for first face
          newNormal = new p5.Vector(
            parseFloat(parts[2]),
            parseFloat(parts[3]),
            parseFloat(parts[4])
          );
          model.vertexNormals.push(newNormal, newNormal, newNormal);
          state = 'facet normal';
        }
        break;

      case 'facet normal': // After normal is defined
        if (parts[0] !== 'outer' || parts[1] !== 'loop') {
          // Invalid State
          console.error(line);
          console.error(
            'Invalid state "' + parts[0] + '", should be "outer loop"'
          );
          return;
        } else {
          // Next should be vertices
          state = 'vertex';
        }
        break;

      case 'vertex':
        if (parts[0] === 'vertex') {
          //Vertex of triangle
          newVertex = new p5.Vector(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          );
          model.vertices.push(newVertex);
          curVertexIndex.push(model.vertices.indexOf(newVertex));
        } else if (parts[0] === 'endloop') {
          // End of vertices
          model.faces.push(curVertexIndex);
          curVertexIndex = [];
          state = 'endloop';
        } else {
          // Invalid State
          console.error(line);
          console.error(
            'Invalid state "' + parts[0] + '", should be "vertex" or "endloop"'
          );
          return;
        }
        break;

      case 'endloop':
        if (parts[0] !== 'endfacet') {
          // End of face
          console.error(line);
          console.error(
            'Invalid state "' + parts[0] + '", should be "endfacet"'
          );
          return;
        } else {
          state = 'endfacet';
        }
        break;

      case 'endfacet':
        if (parts[0] === 'endsolid') {
          // End of solid
        } else if (parts[0] === 'facet' && parts[1] === 'normal') {
          // Next face
          newNormal = new p5.Vector(
            parseFloat(parts[2]),
            parseFloat(parts[3]),
            parseFloat(parts[4])
          );
          model.vertexNormals.push(newNormal, newNormal, newNormal);
          state = 'facet normal';
        } else {
          // Invalid State
          console.error(line);
          console.error(
            'Invalid state "' +
              parts[0] +
              '", should be "endsolid" or "facet normal"'
          );
          return;
        }
        break;

      default:
        console.error('Invalid state "' + state + '"');
        break;
    }
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

export default p5;
