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

		mousePressed: false

	};
}(window));
