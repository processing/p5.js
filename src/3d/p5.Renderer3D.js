define(function(require) {

  var p5 = require('core/core');
  var shaders = require('3d/shaders');
  require('core/p5.Renderer');
  require('3d/p5.Matrix');
  var gl, shaderProgram;
  var uMVMatrixStack = [];

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
   * A p5.Renderer3D object can be constructed
   *
   */
  p5.Renderer3D = function(elt, pInst, isMainCanvas) {
    p5.Renderer.call(this, elt, pInst, isMainCanvas);

    try {
      this.drawingContext = this.canvas.getContext('webgl', attributes) ||
        this.canvas.getContext('experimental-webgl', attributes);
      if (this.drawingContext === null) {
        throw 'Error creating webgl context';
      } else {
        console.log('p5.Renderer3D: enabled webgl context');
      }
    } catch (er) {
      console.error(er);
    }

    this.isP3D = true; //lets us know we're in 3d mode
    gl = this.drawingContext;
    gl.clearColor(1.0, 1.0, 1.0, 1.0); //background is initialized white
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.initShaders(); //initialize our default shaders
    //create our default matrices
    this.initHash();
    this.initMatrix();
    return this;
  };

  /**
   * [prototype description]
   * @type {[type]}
   */
  p5.Renderer3D.prototype = Object.create(p5.Renderer.prototype);

  /**
   * [_applyDefaults description]
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype._applyDefaults = function() {
    return this;
  };

  /**
   * [resize description]
   * @param  {[type]} w [description]
   * @param  {[type]} h [description]
   * @return {[type]}   [description]
   */
  p5.Renderer3D.prototype.resize = function(w,h) {
    p5.Renderer.prototype.resize.call(this, w,h);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  };

  /**
   * [initShaders description]
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype.initShaders = function() {
    //set up our default shaders by:
    // 1. create the shader,
    // 2. load the shader source,
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

    //vertex normal Attribute
    shaderProgram.vertexNormalAttribute =
      gl.getAttribLocation(shaderProgram, 'normal');
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    //projection Matrix uniform
    shaderProgram.uPMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'transformMatrix');
    //model view Matrix uniform
    shaderProgram.uMVMatrixUniform =
      gl.getUniformLocation(shaderProgram, 'modelviewMatrix');

    //normal Matrix uniform
    shaderProgram.uNMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'normalMatrix');
  };

  /**
   * [initBuffer description]
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype.initHash = function(){
    this.hash = {};
    window.hash = this.hash;//for debug
  };

  /**
   * [initMatrix description]
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype.initMatrix = function(){
    this.uMVMatrix = new p5.Matrix();
    this.uPMatrix  = new p5.Matrix();
    this.uNMatrix = new p5.Matrix();
    this._perspective(60 / 180 * Math.PI, this.width / this.height, 0.1, 100);
  };

  /**
   * resets the model view matrix to a mat4 identity
   * matrix.
   * @return {void}
   */
  p5.Renderer3D.prototype.resetMatrix = function() {
    this.uMVMatrix = p5.Matrix.identity();
  };

  //////////////////////////////////////////////
  // COLOR | Setting
  //////////////////////////////////////////////

  /**
   * [background description]
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype.background = function() {
    var _col = this._pInst.color.apply(this._pInst, arguments);
    // gl.clearColor(0.0,0.0,0.0,1.0);
    var _r = (_col.color_array[0]) / 255;
    var _g = (_col.color_array[1]) / 255;
    var _b = (_col.color_array[2]) / 255;
    var _a = (_col.color_array[3]) / 255;
    gl.clearColor(_r, _g, _b, _a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.resetMatrix();
  };

  //@TODO implement this
  // p5.Renderer3D.prototype.clear = function() {
  //@TODO
  // };

  //@TODO implement this
  // p5.Renderer3D.prototype.fill = function() {
  //@TODO
  // };

  /**
   * [stroke description]
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype.stroke = function() {
    this._stroke = this._pInst.color.apply(this._pInst, arguments);
  };


  p5.Renderer3D.prototype.notInHash = function(uuid){
    return this.hash[uuid] === undefined;
  };

  p5.Renderer3D.prototype.initBuffer = function(uuid, obj) {

    this.hash[uuid] = {};
    this.hash[uuid].len = obj.len;
    this.hash[uuid].vertexBuffer = gl.createBuffer();
    this.hash[uuid].normalBuffer = gl.createBuffer();
    this.hash[uuid].indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(obj.vertexNormals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.hash[uuid].indexBuffer);
    gl.bufferData
     (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.faces), gl.STATIC_DRAW);
  };

  p5.Renderer3D.prototype.drawBuffer = function(uuid) {
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].vertexBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].normalBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.hash[uuid].indexBuffer);
    
    this.setMatrixUniforms();
    gl.drawElements(
      gl.TRIANGLES, this.hash[uuid].len,
       gl.UNSIGNED_SHORT, 0);
  };

  /**
   * [translate description]
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   * @todo implement handle for components or vector as args
   */
  p5.Renderer3D.prototype.translate = function(x, y, z) {
    x = x / 100;
    y = -y / 100;
    z = z / 100;
    this.uMVMatrix.translate([x,y,z]);
    return this;
  };

  /**
   * Scales the Model View Matrix by a vector
   * @param  {Number} x [description]
   * @param  {Number} y [description]
   * @param  {Number} z [description]
   * @return {this}   [description]
   */
  p5.Renderer3D.prototype.scale = function(x, y, z) {
    this.uMVMatrix.scale([x,y,z]);
    return this;
  };

  /**
   * [rotateX description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Renderer3D.prototype.rotateX = function(rad) {
    this.uMVMatrix.rotateX(rad);
    return this;
  };

  /**
   * [rotateY description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Renderer3D.prototype.rotateY = function(rad) {
    this.uMVMatrix.rotateY(rad);
    return this;
  };

  /**
   * [rotateZ description]
   * @param  {[type]} rad [description]
   * @return {[type]}     [description]
   */
  p5.Renderer3D.prototype.rotateZ = function(rad) {
    this.uMVMatrix.rotateZ(rad);
    return this;
  };

  /**
   * pushes a copy of the model view matrix onto the
   * MV Matrix stack.
   * NOTE to self: could probably make this more readable
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype.push = function() {
    uMVMatrixStack.push(this.uMVMatrix.copy());
  };

  /**
   * [pop description]
   * @return {[type]} [description]
   */
  p5.Renderer3D.prototype.pop = function() {
    if (uMVMatrixStack.length === 0) {
      throw 'Invalid popMatrix!';
    }
    this.uMVMatrix = uMVMatrixStack.pop();
  };

  /**
   * Sets the Matrix Uniforms inside our default shader.
   * @param {Array float} projection projection matrix
   * @param {Array float} modelView  model view matrix
   */
  p5.Renderer3D.prototype.setMatrixUniforms = function() {
    gl.uniformMatrix4fv(
      shaderProgram.uPMatrixUniform, false, this.uPMatrix.mat4);
    gl.uniformMatrix4fv(
      shaderProgram.uMVMatrixUniform, false, this.uMVMatrix.mat4);
    this.uNMatrix = new p5.Matrix();
    this.uNMatrix.invert(this.uMVMatrix);
    this.uNMatrix.transpose(this.uNMatrix);
    gl.uniformMatrix4fv(
      shaderProgram.uNMatrixUniform, false, this.uNMatrix.mat4);
  };
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
  //var _mvMatrix =
  //[
  //  1.0,0.0,0.0,0.0,
  //  0.0,1.0,0.0,0.0,
  //  0.0,0.0,1.0,0.0,
  //  0.0,0.0,0.0,1.0
  //];

  //////////////////////////////////////////
  /// CAMERA
  //////////////////////////////////////////
  p5.prototype.perspective = function(fovy,aspect,near,far){
    this._pInst._graphics._perspective(arguments);
  };
  /**
   * sets the perspective matrix
   * @param  {Number} fovy   [description]
   * @param  {Number} aspect [description]
   * @param  {Number} near   near clipping plane
   * @param  {Number} far    far clipping plane
   * @return {void}
   */
  p5.Renderer3D.prototype._perspective = function(){
    var fovy = arguments[0];
    var aspect = arguments[1];
    var near = arguments[2];
    var far = arguments[3];

    var f = 1.0 / Math.tan(fovy / 2),
      nf = 1 / (near - far);
    this.uPMatrix.mat4[0] = f / aspect;
    this.uPMatrix.mat4[1] = 0;
    this.uPMatrix.mat4[2] = 0;
    this.uPMatrix.mat4[3] = 0;
    this.uPMatrix.mat4[4] = 0;
    this.uPMatrix.mat4[5] = f;
    this.uPMatrix.mat4[6] = 0;
    this.uPMatrix.mat4[7] = 0;
    this.uPMatrix.mat4[8] = 0;
    this.uPMatrix.mat4[9] = 0;
    this.uPMatrix.mat4[10] = (far + near) * nf;
    this.uPMatrix.mat4[11] = -1;
    this.uPMatrix.mat4[12] = 0;
    this.uPMatrix.mat4[13] = 0;
    this.uPMatrix.mat4[14] = (2 * far * near) * nf;
    this.uPMatrix.mat4[15] = 0;
    return this;
  };
  //// create a perspective matrix with
  //// fovy, aspect, znear, zfar
  //var _pMatrix = _makePerspective(45,
  //  gl.drawingBufferWidth/gl.drawingBufferHeight,
  //  0.1, 1000.0);
  return p5.Renderer3D;
});