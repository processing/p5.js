(function(exports) {
	PVariables = {
		loop: true,
		curElement: null,
		shapeKind: null,
		shapeInited: false,
		fill: false,
		startTime: 0,
		updateInterval: 0,
		rectMode: exports.CORNER,
		imageMode: exports.CORNER,
		ellipseMode: exports.CENTER,
		matrices: [[1,0,0,1,0,0]],
		textLeading: 15,
		textFont: 'sans-serif',
		textSize: 12,
		textStyle: exports.NORMAL,
		colorMode: exports.RGB,
		styles: [],

		sketches: [],
		sketchCanvases: [],
		curSketchIndex: -1,

		mousePressed: false,
    preload_count: 0

	};

	PHelper = {};

  
  // THIS IS THE MAIN FUNCTION, CALLED ON PAGE LOAD
  exports.onload = function() {
    PHelper.create();
  };

  PHelper.create = function() {
    exports.createGraphics(800, 600, true); // default canvas
    PVariables.startTime = new Date().getTime();
    
    if (typeof preload == 'function') {
      exports.loadJSON = function(path) { return PHelper.preloadFunc("loadJSON", path); };
      exports.loadStrings = function(path) { return PHelper.preloadFunc("loadStrings", path); };
      exports.loadXML = function(path) { return PHelper.preloadFunc("loadXML", path); };
      exports.loadImage = function(path) { return PHelper.preloadFunc("loadImage", path); };
      preload();
      exports.loadJSON = PHelper.loadJSON;
      exports.loadStrings = PHelper.loadStrings;
      exports.loadXML = PHelper.loadXML;
      exports.loadImage = PHelper.loadImage;
    } else {
      exports.loadJSON = PHelper.loadJSON;
      exports.loadStrings = PHelper.loadStrings;
      exports.loadXML = PHelper.loadXML;
      exports.loadImage = PHelper.loadImage;
      PHelper.setup();
    }
  };

  PHelper.preloadFunc = function(func, path) {
    PVariables.preload_count++;
    return PHelper[func](path, function (resp) {
      if (--PVariables.preload_count === 0) PHelper.setup();
    });    
  };

  PHelper.setup = function() {
    if (typeof setup === 'function' || PVariables.sketches.length > 0) { // pend whats happening here?
      if (typeof setup === 'function') setup();    
      PVariables.updateInterval = setInterval(PHelper.update, 1000/frameRate);
      PHelper.draw();
    } else console.log("sketch must include a setup function");
  };

  PHelper.applyDefaults = function() {
    PVariables.curElement.context.fillStyle = '#FFFFFF';
    PVariables.curElement.context.strokeStyle = '#000000';
    PVariables.curElement.context.lineCap=exports.ROUND;
  };
  PHelper.update = function() {
    frameCount++;
  };
  PHelper.draw = function() {
    if (PVariables.loop) {
      setTimeout(function() {
        requestDraw(PHelper.draw);
      }, 1000 / frameRate);
    }
    // call draw
    if (typeof draw === 'function') draw();
    for (var i = 0; i < PVariables.sketches.length; i++) {
      var s = PVariables.sketches[i];
      if (typeof s.draw === 'function') {
        PVariables.curSketchIndex = i;
        pushStyle();
        s.draw();
        popStyle();    
        PVariables.curSketchIndex = -1;    
      }      
    }
    PVariables.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  PHelper.modeAdjust = function(a, b, c, d, mode) {
    if (mode == exports.CORNER) {
      return { x: a, y: b, w: c, h: d };
    } else if (mode == exports.CORNERS) {
      return { x: a, y: b, w: c-a, h: d-b };
    } else if (mode == exports.RADIUS) {
      return { x: a-c, y: b-d, w: 2*c, h: 2*d };
    } else if (mode == exports.CENTER) {
      return { x: a-c*0.5, y: b-d*0.5, w: c, h: d };
    }
  };

  PHelper.multiplyMatrix = function(m1, m2) {
    var result = [];
    for(var j = 0; j < m2.length; j++) {
      result[j] = [];
      for(var k = 0; k < m1[0].length; k++) {
        var sum = 0;
        for(var i = 0; i < m1.length; i++) {
          sum += m1[i][k] * m2[j][i];
        }
        result[j].push(sum);
      }
    }
    return result;
  };


  exports.sketch = function(s) {
    PVariables.sketches[PVariables.sketches.length] = s;
    s.mouseX = 0;
    s.mouseY = 0;
    s.pmouseX = 0;
    s.pmouseY = 0;
    s.mouseButton = 0;
    s.touchX = 0;
    s.touchY = 0;
    if (typeof s.setup === 'function') {
      PVariables.curSketchIndex = PVariables.sketches.length - 1;
      s.setup();
      PVariables.curSketchIndex = -1;
    } else console.log("sketch must include a setup function");
  };


}(window));
