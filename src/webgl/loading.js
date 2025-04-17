/**
 * @module Shape
 * @submodule 3D Models
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

import { Geometry } from './p5.Geometry';
import { Vector } from '../math/p5.Vector';
import { request } from '../io/files';

async function fileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function loading(p5, fn){
  /**
   * Loads a 3D model to create a
   * <a href="#/p5.Geometry">p5.Geometry</a> object.
   *
   * `loadModel()` can load 3D models from OBJ and STL files. Once the model is
   * loaded, it can be displayed with the
   * <a href="#/p5/model">model()</a> function, as in `model(shape)`.
   *
   * There are three ways to call `loadModel()` with optional parameters to help
   * process the model.
   *
   * The first parameter, `path`, is a `String` with the path to the file. Paths
   * to local files should be relative, as in `loadModel('assets/model.obj')`.
   * URLs such as `'https://example.com/model.obj'` may be blocked due to browser
   * security. The `path` parameter can also be defined as a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
   * object for more advanced usage.
   * Note: When loading a `.obj` file that references materials stored in
   * `.mtl` files, p5.js will attempt to load and apply those materials.
   * To ensure that the `.obj` file reads the `.mtl` file correctly include the
   * `.mtl` file alongside it.
   *
   * The first way to call `loadModel()` has three optional parameters after the
   * file path. The first optional parameter, `successCallback`, is a function
   * to call once the model loads. For example,
   * `loadModel('assets/model.obj', handleModel)` will call the `handleModel()`
   * function once the model loads. The second optional parameter,
   * `failureCallback`, is a function to call if the model fails to load. For
   * example, `loadModel('assets/model.obj', handleModel, handleFailure)` will
   * call the `handleFailure()` function if an error occurs while loading. The
   * third optional parameter, `fileType`, is the model’s file extension as a
   * string. For example,
   * `loadModel('assets/model', handleModel, handleFailure, '.obj')` will try to
   * load the file model as a `.obj` file.
   *
   * The second way to call `loadModel()` has four optional parameters after the
   * file path. The first optional parameter is a `Boolean` value. If `true` is
   * passed, as in `loadModel('assets/model.obj', true)`, then the model will be
   * resized to ensure it fits the canvas. The next three parameters are
   * `successCallback`, `failureCallback`, and `fileType` as described above.
   *
   * The third way to call `loadModel()` has one optional parameter after the
   * file path. The optional parameter, `options`, is an `Object` with options,
   * as in `loadModel('assets/model.obj', options)`. The `options` object can
   * have the following properties:
   *
   * ```js
   * let options = {
   *   // Enables standardized size scaling during loading if set to true.
   *   normalize: true,
   *
   *   // Function to call once the model loads.
   *   successCallback: handleModel,
   *
   *   // Function to call if an error occurs while loading.
   *   failureCallback: handleError,
   *
   *   // Model's file extension.
   *   fileType: '.stl',
   *
   *   // Flips the U texture coordinates of the model.
   *   flipU: false,
   *
   *   // Flips the V texture coordinates of the model.
   *   flipV: false
   * };
   *
   * // Pass the options object to loadModel().
   * loadModel('assets/model.obj', options);
   * ```
   *
   * This function returns a `Promise` and should be used in an `async` setup with
   * `await`. See the examples for the usage syntax.
   *
   * Note: There’s no support for colored STL files. STL files with color will
   * be rendered without color.
   *
   * @method loadModel
   * @param  {String|Request} path      path of the model to be loaded.
   * @param  {String} [fileType]          model’s file extension. Either `'.obj'` or `'.stl'`.
   * @param  {Boolean} normalize        if `true`, scale the model to fit the canvas.
   * @param  {function(p5.Geometry)} [successCallback] function to call once the model is loaded. Will be passed
   *                                                   the <a href="#/p5.Geometry">p5.Geometry</a> object.
   * @param  {function(Event)} [failureCallback] function to call if the model fails to load. Will be passed an `Error` event object.
   * @return {Promise<p5.Geometry>} the <a href="#/p5.Geometry">p5.Geometry</a> object
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * // Load the file and create a p5.Geometry object.
   * async function setup() {
   *   shape = await loadModel('assets/teapot.obj');
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white teapot drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the shape.
   *   model(shape);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * // Load the file and create a p5.Geometry object.
   * // Normalize the geometry's size to fit the canvas.
   * async function setup() {
   *   shape = await loadModel('assets/teapot.obj', true);
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white teapot drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the shape.
   *   model(shape);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * // Load the file and create a p5.Geometry object.
   * async function setup() {
   *   await loadModel('assets/teapot.obj', true, handleModel);
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white teapot drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the shape.
   *   model(shape);
   * }
   *
   * // Set the shape variable and log the geometry's
   * // ID to the console.
   * function handleModel(data) {
   *   shape = data;
   *   console.log(shape.gid);
   * }
   * </code>
   * </div>
   *
   * <div class='notest'>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * // Load the file and create a p5.Geometry object.
   * async function setup() {
   *   await loadModel('assets/teapot.obj', true, handleModel, handleError);
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white teapot drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the shape.
   *   model(shape);
   * }
   *
   * // Set the shape variable and print the geometry's
   * // ID to the console.
   * function handleModel(data) {
   *   shape = data;
   *   console.log(shape.gid);
   * }
   *
   * // Print an error message if the file doesn't load.
   * function handleError(error) {
   *   console.error('Oops!', error);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * // Load the file and create a p5.Geometry object.
   * async function setup() {
   *   await loadModel('assets/teapot.obj', '.obj', true, handleModel, handleError);
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white teapot drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the shape.
   *   model(shape);
   * }
   *
   * // Set the shape variable and print the geometry's
   * // ID to the console.
   * function handleModel(data) {
   *   shape = data;
   *   console.log(shape.gid);
   * }
   *
   * // Print an error message if the file doesn't load.
   * function handleError(error) {
   *   console.error('Oops!', error);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   * let options = {
   *   fileType: '.obj',
   *   normalize: true,
   *   successCallback: handleModel,
   *   failureCallback: handleError
   * };
   *
   * // Load the file and create a p5.Geometry object.
   * async function setup() {
   *   await loadModel('assets/teapot.obj', options);
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white teapot drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the shape.
   *   model(shape);
   * }
   *
   * // Set the shape variable and print the geometry's
   * // ID to the console.
   * function handleModel(data) {
   *   shape = data;
   *   console.log(shape.gid);
   * }
   *
   * // Print an error message if the file doesn't load.
   * function handleError(error) {
   *   console.error('Oops!', error);
   * }
   * </code>
   * </div>
   */
  /**
   * @method loadModel
   * @param  {String|Request} path
   * @param  {String} [fileType]
   * @param  {function(p5.Geometry)} [successCallback]
   * @param  {function(Event)} [failureCallback]
   * @return {Promise<p5.Geometry>} new <a href="#/p5.Geometry">p5.Geometry</a> object.
   */
  /**
   * @method loadModel
   * @param  {String|Request} path
   * @param  {Object} [options] loading options.
   * @param  {String} [options.fileType]
   * @param  {function(p5.Geometry)} [options.successCallback]
   * @param  {function(Event)} [options.failureCallback]
   * @param  {Boolean} [options.normalize]
   * @param  {Boolean} [options.flipU]
   * @param  {Boolean} [options.flipV]
   * @return {Promise<p5.Geometry>} new <a href="#/p5.Geometry">p5.Geometry</a> object.
   */
  fn.loadModel = async function (path, fileType, normalize, successCallback, failureCallback) {
    // p5._validateParameters('loadModel', arguments);

    let flipU = false;
    let flipV = false;

    if (typeof fileType === 'object') {
      // Passing in options object
      normalize = fileType.normalize || false;
      successCallback = fileType.successCallback;
      failureCallback = fileType.failureCallback;
      fileType = fileType.fileType || fileType;
      flipU = fileType.flipU || false;
      flipV = fileType.flipV || false;

    } else {
      // Passing in individual parameters
      if(typeof arguments[arguments.length-1] === 'function'){
        if(typeof arguments[arguments.length-2] === 'function'){
          successCallback = arguments[arguments.length-2];
          failureCallback = arguments[arguments.length-1];
        }else{
          successCallback = arguments[arguments.length-1];
        }
      }

      if (typeof fileType === 'string') {
        if(typeof normalize !== 'boolean') normalize = false;

      } else if (typeof fileType === 'boolean') {
        normalize = fileType;
        fileType = path.slice(-4);

      } else {
        fileType = path.slice(-4);
        normalize = false;
      }
    }

    if (fileType.toLowerCase() !== '.obj' && fileType.toLowerCase() !== '.stl') {
      fileType = '.obj';
    }

    const model = new Geometry(undefined, undefined, undefined, this._renderer);
    model.gid = `${path}|${normalize}`;

    async function getMaterials(lines) {
      const parsedMaterialPromises = [];

      for (let line of lines) {
        const mtllibMatch = line.match(/^mtllib (.+)/);

        if (mtllibMatch) {
          // Object has material
          let mtlPath = '';
          const mtlFilename = mtllibMatch[1];
          const objPathParts = path.split('/');
          if (objPathParts.length > 1) {
            objPathParts.pop();
            const objFolderPath = objPathParts.join('/');
            mtlPath = objFolderPath + '/' + mtlFilename;
          } else {
            mtlPath = mtlFilename;
          }

          parsedMaterialPromises.push(
            fileExists(mtlPath).then(exists => {
              if (exists) {
                return parseMtl(mtlPath);
              } else {
                console.warn(`MTL file not found or error in parsing; proceeding without materials: ${mtlPath}`);
                return {};

              }
            }).catch(error => {
              console.warn(`Error loading MTL file: ${mtlPath}`, error);
              return {};
            })
          );
        }
      }

      try {
        const parsedMaterials = await Promise.all(parsedMaterialPromises);
        const materials = Object.assign({}, ...parsedMaterials);
        return materials;
      } catch (error) {
        return {};
      }
    }

    try{
      if (fileType.match(/\.stl$/i)) {
        const { data } = await request(path, 'arrayBuffer');
        parseSTL(model, data);

        if (normalize) {
          model.normalize();
        }

        if (flipU) {
          model.flipU();
        }

        if (flipV) {
          model.flipV();
        }
        model._makeTriangleEdges();

        if (successCallback) {
          return successCallback(model);
        } else {
          return model;
        }

      } else if (fileType.match(/\.obj$/i)) {
        const { data } = await request(path, 'text');
        const lines = data.split('\n');

        const parsedMaterials = await getMaterials(lines);
        parseObj(model, lines, parsedMaterials);

        if (normalize) {
          model.normalize();
        }
        if (flipU) {
          model.flipU();
        }
        if (flipV) {
          model.flipV();
        }
        model._makeTriangleEdges();

        if (successCallback) {
          return successCallback(model);
        } else {
          return model;
        }
      }
    } catch(err) {
      p5._friendlyFileLoadError(3, path);
      if(failureCallback) {
        return failureCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * @private
   */
  async function parseMtl(mtlPath) {
    let currentMaterial = null;
    let materials = {};

    const { data } = await request(mtlPath, "text");
    const lines = data.split('\n');

    for (let line = 0; line < lines.length; ++line) {
      const tokens = lines[line].trim().split(/\s+/);
      if (tokens[0] === 'newmtl') {
        const materialName = tokens[1];
        currentMaterial = materialName;
        materials[currentMaterial] = {};
      } else if (tokens[0] === 'Kd') {
        //Diffuse color
        materials[currentMaterial].diffuseColor = [
          parseFloat(tokens[1]),
          parseFloat(tokens[2]),
          parseFloat(tokens[3])
        ];
      } else if (tokens[0] === 'Ka') {
        //Ambient Color
        materials[currentMaterial].ambientColor = [
          parseFloat(tokens[1]),
          parseFloat(tokens[2]),
          parseFloat(tokens[3])
        ];
      } else if (tokens[0] === 'Ks') {
        //Specular color
        materials[currentMaterial].specularColor = [
          parseFloat(tokens[1]),
          parseFloat(tokens[2]),
          parseFloat(tokens[3])
        ];

      } else if (tokens[0] === 'map_Kd') {
        //Texture path
        materials[currentMaterial].texturePath = tokens[1];
      }
    }

    return materials;
  }

  /**
   * @private
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
  function parseObj(model, lines, materials = {}) {
    // OBJ allows a face to specify an index for a vertex (in the above example),
    // but it also allows you to specify a custom combination of vertex, UV
    // coordinate, and vertex normal. So, "3/4/3" would mean, "use vertex 3 with
    // UV coordinate 4 and vertex normal 3". In WebGL, every vertex with different
    // parameters must be a different vertex, so loadedVerts is used to
    // temporarily store the parsed vertices, normals, etc., and indexedVerts is
    // used to map a specific combination (keyed on, for example, the string
    // "3/4/3"), to the actual index of the newly created vertex in the final
    // object.
    const loadedVerts = {
      v: [],
      vt: [],
      vn: []
    };


    // Map from source index → Map of material → destination index
    const usedVerts = {}; // Track colored vertices
    let currentMaterial = null;
    let hasColoredVertices = false;
    let hasColorlessVertices = false;
    for (let line = 0; line < lines.length; ++line) {
      // Each line is a separate object (vertex, face, vertex normal, etc)
      // For each line, split it into tokens on whitespace. The first token
      // describes the type.
      const tokens = lines[line].trim().split(/\b\s+/);

      if (tokens.length > 0) {
        if (tokens[0] === 'usemtl') {
          // Switch to a new material
          currentMaterial = tokens[1];
        } else if (tokens[0] === 'v' || tokens[0] === 'vn') {
          // Check if this line describes a vertex or vertex normal.
          // It will have three numeric parameters.
          const vertex = new Vector(
            parseFloat(tokens[1]),
            parseFloat(tokens[2]),
            parseFloat(tokens[3])
          );
          loadedVerts[tokens[0]].push(vertex);
        } else if (tokens[0] === 'vt') {
          // Check if this line describes a texture coordinate.
          // It will have two numeric parameters U and V (W is omitted).
          // Because of WebGL texture coordinates rendering behaviour, the V
          // coordinate is inversed.
          const texVertex = [parseFloat(tokens[1]), 1 - parseFloat(tokens[2])];
          loadedVerts[tokens[0]].push(texVertex);
        } else if (tokens[0] === 'f') {
          // Check if this line describes a face.
          // OBJ faces can have more than three points. Triangulate points.
          for (let tri = 3; tri < tokens.length; ++tri) {
            const face = [];
            const vertexTokens = [1, tri - 1, tri];

            for (let tokenInd = 0; tokenInd < vertexTokens.length; ++tokenInd) {
              // Now, convert the given token into an index
              const vertString = tokens[vertexTokens[tokenInd]];
              let vertParts = vertString.split('/');

              // TODO: Faces can technically use negative numbers to refer to the
              // previous nth vertex. I haven't seen this used in practice, but
              // it might be good to implement this in the future.

              for (let i = 0; i < vertParts.length; i++) {
                vertParts[i] = parseInt(vertParts[i]) - 1;
              }

              if (!usedVerts[vertString]) {
                usedVerts[vertString] = {};
              }

              if (usedVerts[vertString][currentMaterial] === undefined) {
                const vertIndex = model.vertices.length;
                model.vertices.push(loadedVerts.v[vertParts[0]].copy());
                model.uvs.push(loadedVerts.vt[vertParts[1]] ?
                  loadedVerts.vt[vertParts[1]].slice() : [0, 0]);
                model.vertexNormals.push(loadedVerts.vn[vertParts[2]] ?
                  loadedVerts.vn[vertParts[2]].copy() : new Vector());

                usedVerts[vertString][currentMaterial] = vertIndex;
                face.push(vertIndex);
                if (currentMaterial
                  && materials[currentMaterial]
                  && materials[currentMaterial].diffuseColor) {
                  hasColoredVertices = true;
                  const materialDiffuseColor =
                    materials[currentMaterial].diffuseColor;
                  model.vertexColors.push(materialDiffuseColor[0]);
                  model.vertexColors.push(materialDiffuseColor[1]);
                  model.vertexColors.push(materialDiffuseColor[2]);
                  model.vertexColors.push(1);
                } else {
                  hasColorlessVertices = true;
                }
              } else {
                face.push(usedVerts[vertString][currentMaterial]);
              }
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
    if (hasColoredVertices === hasColorlessVertices) {
      // If both are true or both are false, throw an error because the model is inconsistent
      throw new Error('Model coloring is inconsistent. Either all vertices should have colors or none should.');
    }

    return model;
  }

  /**
   * @private
   * STL files can be of two types, ASCII and Binary,
   *
   * We need to convert the arrayBuffer to an array of strings,
   * to parse it as an ASCII file.
   */
  function parseSTL(model, buffer) {
    if (isBinary(buffer)) {
      parseBinarySTL(model, buffer);
    } else {
      const reader = new DataView(buffer);

      if (!('TextDecoder' in window)) {
        console.warn(
          'Sorry, ASCII STL loading only works in browsers that support TextDecoder (https://caniuse.com/#feat=textencoder)'
        );
        return model;
      }

      const decoder = new TextDecoder('utf-8');
      const lines = decoder.decode(reader);
      const lineArray = lines.split('\n');
      parseASCIISTL(model, lineArray);
    }
    return model;
  }

  /**
   * @private
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
    const reader = new DataView(data);

    // US-ASCII ordinal values for `s`, `o`, `l`, `i`, `d`
    const solid = [115, 111, 108, 105, 100];
    for (let off = 0; off < 5; off++) {
      // If "solid" text is matched to the current offset, declare it to be an ASCII STL.
      if (matchDataViewAt(solid, reader, off)) return false;
    }

    // Couldn't find "solid" text at the beginning; it is binary STL.
    return true;
  }

  /**
   * @private
   * This function matches the `query` at the provided `offset`
   */
  function matchDataViewAt(query, reader, offset) {
    // Check if each byte in query matches the corresponding byte from the current offset
    for (let i = 0, il = query.length; i < il; i++) {
      if (query[i] !== reader.getUint8(offset + i, false)) return false;
    }

    return true;
  }

  /**
   * @private
   * This function parses the Binary STL files.
   * https://en.wikipedia.org/wiki/STL_%28file_format%29#Binary_STL
   *
   * Currently there is no support for the colors provided in STL files.
   */
  function parseBinarySTL(model, buffer) {
    const reader = new DataView(buffer);

    // Number of faces is present following the header
    const faces = reader.getUint32(80, true);
    let r,
      g,
      b,
      hasColors = false,
      colors;
    let defaultR, defaultG, defaultB;

    // Binary files contain 80-byte header, which is generally ignored.
    for (let index = 0; index < 80 - 10; index++) {
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
    const dataOffset = 84;
    const faceLength = 12 * 4 + 2;

    // Iterate the faces
    for (let face = 0; face < faces; face++) {
      const start = dataOffset + face * faceLength;
      const normalX = reader.getFloat32(start, true);
      const normalY = reader.getFloat32(start + 4, true);
      const normalZ = reader.getFloat32(start + 8, true);

      if (hasColors) {
        const packedColor = reader.getUint16(start + 48, true);

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
      const newNormal = new Vector(normalX, normalY, normalZ);

      for (let i = 1; i <= 3; i++) {
        const vertexstart = start + i * 12;

        const newVertex = new Vector(
          reader.getFloat32(vertexstart, true),
          reader.getFloat32(vertexstart + 4, true),
          reader.getFloat32(vertexstart + 8, true)
        );

        model.vertices.push(newVertex);
        model.vertexNormals.push(newNormal);

        if (hasColors) {
          colors.push(r, g, b);
        }
      }

      model.faces.push([3 * face, 3 * face + 1, 3 * face + 2]);
      model.uvs.push([0, 0], [0, 0], [0, 0]);
    }
    if (hasColors) {
      // add support for colors here.
    }
    return model;
  }

  /**
   * @private
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
    let state = '';
    let curVertexIndex = [];
    let newNormal, newVertex;

    for (let iterator = 0; iterator < lines.length; ++iterator) {
      const line = lines[iterator].trim();
      const parts = line.split(' ');

      for (let partsiterator = 0; partsiterator < parts.length; ++partsiterator) {
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
            console.error(`Invalid state "${parts[0]}", should be "solid"`);
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
              `Invalid state "${parts[0]}", should be "facet normal"`
            );
            return;
          } else {
            // Push normal for first face
            newNormal = new Vector(
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
            console.error(`Invalid state "${parts[0]}", should be "outer loop"`);
            return;
          } else {
            // Next should be vertices
            state = 'vertex';
          }
          break;

        case 'vertex':
          if (parts[0] === 'vertex') {
            //Vertex of triangle
            newVertex = new Vector(
              parseFloat(parts[1]),
              parseFloat(parts[2]),
              parseFloat(parts[3])
            );
            model.vertices.push(newVertex);
            model.uvs.push([0, 0]);
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
              `Invalid state "${parts[0]}", should be "vertex" or "endloop"`
            );
            return;
          }
          break;

        case 'endloop':
          if (parts[0] !== 'endfacet') {
            // End of face
            console.error(line);
            console.error(`Invalid state "${parts[0]}", should be "endfacet"`);
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
            newNormal = new Vector(
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
              `Invalid state "${parts[0]
              }", should be "endsolid" or "facet normal"`
            );
            return;
          }
          break;

        default:
          console.error(`Invalid state "${state}"`);
          break;
      }
    }
    return model;
  }

  /**
   * Draws a <a href="#/p5.Geometry">p5.Geometry</a> object to the canvas.
   *
   * The parameter, `model`, is the
   * <a href="#/p5.Geometry">p5.Geometry</a> object to draw.
   * <a href="#/p5.Geometry">p5.Geometry</a> objects can be built with
   * <a href="#/p5/buildGeometry">buildGeometry()</a>, or
   * <a href="#/p5/beginGeometry">beginGeometry()</a> and
   * <a href="#/p5/endGeometry">endGeometry()</a>. They can also be loaded from
   * a file with <a href="#/p5/loadGeometry">loadGeometry()</a>.
   *
   * Note: `model()` can only be used in WebGL mode.
   *
   * @method model
   * @param  {p5.Geometry} model 3D shape to be drawn.
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the p5.Geometry object.
   *   shape = buildGeometry(createShape);
   *
   *   describe('A white cone drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the p5.Geometry object.
   *   model(shape);
   * }
   *
   * // Create p5.Geometry object from a single cone.
   * function createShape() {
   *   cone();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the p5.Geometry object.
   *   shape = buildGeometry(createArrow);
   *
   *   describe('Two white arrows drawn on a gray background. The arrow on the right rotates slowly.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Style the arrows.
   *   noStroke();
   *
   *   // Draw the p5.Geometry object.
   *   model(shape);
   *
   *   // Translate and rotate the coordinate system.
   *   translate(30, 0, 0);
   *   rotateZ(frameCount * 0.01);
   *
   *   // Draw the p5.Geometry object again.
   *   model(shape);
   * }
   *
   * function createArrow() {
   *   // Add shapes to the p5.Geometry object.
   *   push();
   *   rotateX(PI);
   *   cone(10);
   *   translate(0, -10, 0);
   *   cylinder(3, 20);
   *   pop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * async function setup() {
   *   shape = await loadModel('assets/octahedron.obj');
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white octahedron drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the shape.
   *   model(shape);
   * }
   * </code>
   * </div>
   */
  fn.model = function (model, count = 1) {
    this._assert3d('model');
    // p5._validateParameters('model', arguments);
    this._renderer.model(model, count);
  };

  /**
   * Load a 3d model from an OBJ or STL string.
   *
   * OBJ and STL files lack a built-in sense of scale, causing models exported from different programs to vary in size.
   * If your model doesn't display correctly, consider using `loadModel()` with `normalize` set to `true` to standardize its size.
   * Further adjustments can be made using the `scale()` function.
   *
   * Also, the support for colored STL files is not present. STL files with color will be
   * rendered without color properties.
   *
   * * Options can include:
   * - `modelString`: Specifies the plain text string of either an stl or obj file to be loaded.
   * - `fileType`: Defines the file extension of the model.
   * - `normalize`: Enables standardized size scaling during loading if set to true.
   * - `successCallback`: Callback for post-loading actions with the 3D model object.
   * - `failureCallback`: Handles errors if model loading fails, receiving an event error.
   * - `flipU`: Flips the U texture coordinates of the model.
   * - `flipV`: Flips the V texture coordinates of the model.
   *
   *
   * @method createModel
   * @param  {String} modelString         String of the object to be loaded
   * @param  {String} [fileType]          The file extension of the model
   *                                      (<code>.stl</code>, <code>.obj</code>).
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
   * const octahedron_model = `
   * v 0.000000E+00 0.000000E+00 40.0000
   * v 22.5000 22.5000 0.000000E+00
   * v 22.5000 -22.5000 0.000000E+00
   * v -22.5000 -22.5000 0.000000E+00
   * v -22.5000 22.5000 0.000000E+00
   * v 0.000000E+00 0.000000E+00 -40.0000
   * f     1 2 3
   * f     1 3 4
   * f     1 4 5
   * f     1 5 2
   * f     6 5 4
   * f     6 4 3
   * f     6 3 2
   * f     6 2 5
   * `;
   * //draw a spinning octahedron
   * let octahedron;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   octahedron = createModel(octahedron_model, '.obj');
   *   describe('Vertically rotating 3D octahedron.');
   * }
   *
   * function draw() {
   *   background(200);
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   model(octahedron);
   *}
   * </code>
   * </div>
   */
  /**
   * @method createModel
   * @param  {String} modelString
   * @param  {String} [fileType]
   * @param  {function(p5.Geometry)} [successCallback]
   * @param  {function(Event)} [failureCallback]
   * @return {p5.Geometry} the <a href="#/p5.Geometry">p5.Geometry</a> object
   */
  /**
   * @method createModel
   * @param  {String} modelString
   * @param  {String} [fileType]
   * @param  {Object} [options]
   * @param  {function(p5.Geometry)} [options.successCallback]
   * @param  {function(Event)} [options.failureCallback]
   * @param  {boolean} [options.normalize]
   * @param  {boolean} [options.flipU]
   * @param  {boolean} [options.flipV]
   * @return {p5.Geometry} the <a href="#/p5.Geometry">p5.Geometry</a> object
   */
  let modelCounter = 0;
  fn.createModel = function(modelString, fileType=' ', options) {
    // p5._validateParameters('createModel', arguments);
    let normalize= false;
    let successCallback;
    let failureCallback;
    let flipU = false;
    let flipV = false;
    if (options && typeof options === 'object') {
      normalize = options.normalize || false;
      successCallback = options.successCallback;
      failureCallback = options.failureCallback;
      flipU = options.flipU || false;
      flipV = options.flipV || false;
    } else if (typeof options === 'boolean') {
      normalize = options;
      successCallback = arguments[3];
      failureCallback = arguments[4];
    } else {
      successCallback = typeof arguments[2] === 'function' ? arguments[2] : undefined;
      failureCallback = arguments[3];
    }
    const model = new p5.Geometry();
    model.gid = `${fileType}|${normalize}|${modelCounter++}`;

    if (fileType.match(/\.stl$/i)) {
      try {
        let uint8array = new TextEncoder().encode(modelString);
        let arrayBuffer = uint8array.buffer;
        parseSTL(model, arrayBuffer);
      } catch (error) {
        if (failureCallback) {
          failureCallback(error);
        } else {
          p5._friendlyError('Error during parsing: ' + error.message);
        }
        return;
      }
    } else if (fileType.match(/\.obj$/i)) {
      try {
        const lines = modelString.split('\n');
        parseObj(model, lines);
      } catch (error) {
        if (failureCallback) {
          failureCallback(error);
        } else {
          p5._friendlyError('Error during parsing: ' + error.message);
        }
        return;
      }
    } else {
      p5._friendlyFileLoadError(3, modelString);
      if (failureCallback) {
        failureCallback();
      } else {
        p5._friendlyError(
          'Sorry, the file type is invalid. Only OBJ and STL files are supported.'
        );
      }
    }
    if (normalize) {
      model.normalize();
    }

    if (flipU) {
      model.flipU();
    }

    if (flipV) {
      model.flipV();
    }

    model._makeTriangleEdges();

    if (typeof successCallback === 'function') {
      successCallback(model);
    }

    return model;
  };
}

export default loading;

if(typeof p5 !== 'undefined'){
  loading(p5, p5.prototype);
}
