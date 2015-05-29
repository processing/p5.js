define(function(require) {

  var p5 = require('core');
  var shaders = require('shaders');
  require('p5.Graphics');
  var mat4 = require('mat4');
  var gl,
    shaderProgram;
  var uMVMatrix;
  var uPMatrix;
  var nMatrix;
  var uMVMatrixStack = [];
  var vertexBuffer;
  var indexBuffer;
  //var normalBuffer;

  //@TODO should probably implement an override for these attributes
  var attributes = {
    alpha: false,
    depth: true,
    stencil: true,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false
  };
  /**
   * 3D graphics class.  Can also be used as an off-screen graphics buffer.
   * A p5.Graphics3D object can be constructed
   *
   */
  p5.Graphics3D = function(elt, pInst, isMainCanvas) {
    p5.Graphics.call(this, elt, pInst, isMainCanvas);

    try {
      this.drawingContext = this.canvas.getContext('webgl', attributes) ||
        this.canvas.getContext('experimental-webgl', attributes);
      if (this.drawingContext === null) {
        throw 'Error creating webgl context';
      } else {
        console.log('p5.Graphics3d: enabled webgl context');
      }
    } catch (er) {
      console.error(er);
    }

    this._pInst._setProperty('_graphics', this);
    this.isP3D = true; //lets us know we're in 3d mode
    gl = this.drawingContext;
    gl.clearColor(1.0, 1.0, 1.0, 1.0); //background is initialized white
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.width * this._pInst._pixelDensity,
      this.height * this._pInst._pixelDensity);
    this.initShaders(); //initialize our default shaders
    this.initMatrix(); //initialize default uPMatrix and mvatrix
    return this;
  };

  /**
   * [prototype description]
   * @type {[type]}
   */
  p5.Graphics3D.prototype = Object.create(p5.Graphics.prototype);

  /**
   * [initShaders description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.initShaders = function() {
    //set up our default shaders by:
    // 1. create the shader, 2. load the shader source,
    // 3. compile the shader
    var _vertShader = gl.createShader(gl.VERTEX_SHADER);
    //load in our default vertex shader
    gl.shaderSource(_vertShader, shaders.testVert);
    gl.compileShader(_vertShader);
    // if our vertex shader failed compilation?
    if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
      alert('Yikes! An error occurred compiling the shaders:' +
        gl.getShaderInfoLog(_vertShader));
      return null;
    }

    var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    //load in our material frag shader
    gl.shaderSource(_fragShader, shaders.testFrag);
    gl.compileShader(_fragShader);
    // if our frag shader failed compilation?
    if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
      alert('Darn! An error occurred compiling the shaders:' +
        gl.getShaderInfoLog(_fragShader));
      return null;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, _vertShader);
    gl.attachShader(shaderProgram, _fragShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Snap! Error linking shader program');
    }
    gl.useProgram(shaderProgram);
    //END SHADERS SETUP

    // var vertexResolution =
      // gl.getUniformLocation(shaderProgram, 'u_resolution');
    // @TODO replace 4th argument with far plane once we implement
    // a view frustrum

    //vertex position Attribute
    shaderProgram.vertexPositionAttribute =
      gl.getAttribLocation(shaderProgram, 'position');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    //projection Matrix uniform
    shaderProgram.uPMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'transformMatrix');
    //model view Matrix uniform
    shaderProgram.uMVMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'modelviewMatrix');

    //normal Matrix uniform
    // shaderProgram.nMatrixUniform =
    // gl.getUniformLocation(shaderProgram, 'uNVMatrix');

    //material color uniform
    //@TODO: remove hard coded white rgba 
    shaderProgram.uMaterialColorLoc = gl.getUniformLocation(shaderProgram,
      'uMaterialColor');
    // Set material uniform
    gl.uniform4f(shaderProgram.uMaterialColorLoc, 1.0, 1.0, 1.0, 1.0);

    vertexBuffer = gl.createBuffer();
    indexBuffer = gl.createBuffer();


  };

  /**
   * [initMatrix description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.initMatrix = function() {
    // Create a projection / perspective matrix
    uMVMatrix = mat4.create();
    uPMatrix = mat4.create();
    nMatrix = mat4.create();
    mat4.perspective(
      uPMatrix, 60 / 180 * Math.PI,
      this.width / this.height, 0.1, 100);
  };

  /**
   * [resetMatrix description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.resetMatrix = function() {
    mat4.identity(uMVMatrix);
  };

  //////////////////////////////////////////////
  // COLOR | Setting
  //////////////////////////////////////////////

  p5.Graphics3D.prototype.background = function() {
    var _col = this._pInst.color.apply(this._pInst, arguments);
    // gl.clearColor(0.0,0.0,0.0,1.0);
    var _r = (_col.color_array[0]) / 255;
    var _g = (_col.color_array[1]) / 255;
    var _b = (_col.color_array[2]) / 255;
    var _a = (_col.color_array[3]) / 255;
    gl.clearColor(_r, _g, _b, _a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //this.resetMatrix();
  };

  // p5.Graphics3D.prototype.clear = function() {
  //@TODO
  // };

  // p5.Graphics3D.prototype.fill = function() {
  //@TODO
  // };

  p5.Graphics3D.prototype.stroke = function() {
    this._stroke = this._pInst.color.apply(this._pInst, arguments);
  };

  /**
   * draw geometry with given vertices array
   * @param  {Array} vertices generated vertices
   * @return {[type]}          [description]
   */
  p5.Graphics3D.prototype.drawGeometry = function(vertices, faces) {

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData
    (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);
    
    _setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, faces.length, gl.UNSIGNED_SHORT, 0);

    return this;
  };
  

  /**
   * [translate description]
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  p5.Graphics3D.prototype.translate = function(x, y, z) {
    mat4.translate(uMVMatrix, uMVMatrix, [x, y, z]);
    return this;
  };

  /**
   * [scale description]
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  p5.Graphics3D.prototype.scale = function(x, y, z) {
    mat4.scale(uMVMatrix, uMVMatrix, [x, y, z]);
    return this;
  };

  /**
   * [rotateX description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Graphics3D.prototype.rotateX = function(rad) {
    mat4.rotateX(uMVMatrix, uMVMatrix, rad);
    return this;
  };

  /**
   * [rotateY description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Graphics3D.prototype.rotateY = function(rad) {
    mat4.rotateY(uMVMatrix, uMVMatrix, rad);
    return this;
  };

  /**
   * [rotateZ description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Graphics3D.prototype.rotateZ = function(rad) {
    mat4.rotateZ(uMVMatrix, uMVMatrix, rad);
    return this;
  };

  p5.Graphics3D.prototype.push = function() {
    var copy = mat4.create();
    mat4.copy(copy, uMVMatrix);
    uMVMatrixStack.push(copy);
  };

  /**
   * [pop description]
   * @return {[type]} [description]
   */
  p5.Graphics3D.prototype.pop = function() {
    if (uMVMatrixStack.length === 0) {
      throw 'Invalid pouPMatrix!';
    }
    uMVMatrix = uMVMatrixStack.pop();
  };

  /**
   * [_setMatrixUniforms description]
   */
  function _setMatrixUniforms() {
      // mat4.identity( nMatrix );
      // mat4.invert( nMatrix, uMVMatrix );
      // mat4.transpose( nMatrix, nMatrix );
      gl.uniformMatrix4fv(shaderProgram.uPMatrixUniform, false, uPMatrix);
      gl.uniformMatrix4fv(shaderProgram.uMVMatrixUniform, false, uMVMatrix);
      //gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
    }
    /**
     * PRIVATE
     */
    // matrix methods adapted from:
    // https://developer.mozilla.org/en-US/docs/Web/WebGL/
    // gluPerspective
    //
    // function _makePerspective(fovy, aspect, znear, zfar){
    //    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    //    var ymin = -ymax;
    //    var xmin = ymin * aspect;
    //    var xmax = ymax * aspect;
    //    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
    //  }

  ////
  //// glFrustum
  ////
  //function _makeFrustum(left, right, bottom, top, znear, zfar){
  //  var X = 2*znear/(right-left);
  //  var Y = 2*znear/(top-bottom);
  //  var A = (right+left)/(right-left);
  //  var B = (top+bottom)/(top-bottom);
  //  var C = -(zfar+znear)/(zfar-znear);
  //  var D = -2*zfar*znear/(zfar-znear);
  //  var frustrumMatrix =[
  //  X, 0, A, 0,
  //  0, Y, B, 0,
  //  0, 0, C, D,
  //  0, 0, -1, 0
  //];
  //return frustrumMatrix;
  // }

  // function _setMVPMatrices(){
  ////an identity matrix
  ////@TODO use the p5.Matrix class to abstract away our MV matrices and
  ///other math
  //var _uMVMatrix =
  //[
  //  1.0,0.0,0.0,0.0,
  //  0.0,1.0,0.0,0.0,
  //  0.0,0.0,1.0,0.0,
  //  0.0,0.0,0.0,1.0
  //];

  //// create a perspective matrix with
  //// fovy, aspect, znear, zfar
  //var _uPMatrix = _makePerspective(45,
  //  gl.drawingBufferWidth/gl.drawingBufferHeight,
  //  0.1, 1000.0);

  //var _uPMatrixUniform =
  //  gl.getUniformLocation(shaderProgram, 'uuPMatrix');

  //var _uMVMatrixUniform =
  //  gl.getUniformLocation(shaderProgram, 'uuMVMatrix');

  //gl.uniformMatrix4fv(_uMVMatrixUniform,
  //  false, new Float32Array(_uMVMatrix));
  //gl.uniformMatrix4fv(_uPMatrixUniform,
  //  false, new Float32Array(_uPMatrix));
  // }

  return p5.Graphics3D;
});