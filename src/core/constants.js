(function(exports) {

	exports.HALF_PI = Math.PI*0.5;
	exports.PI = Math.PI;
	exports.QUARTER_PI = Math.PI*0.25;
	exports.TAU = Math.PI*2.0;
	exports.TWO_PI = Math.PI*2.0;

	exports.CORNER = 'corner', CORNERS = 'corners', exports.RADIUS = 'radius';
	exports.RIGHT = 'right', exports.LEFT = 'left', exports.CENTER = 'center';
	exports.POINTS = 'points', exports.LINES = 'lines', exports.TRIANGLES = 'triangles', exports.TRIANGLE_FAN = 'triangles_fan',
	exports.TRIANGLE_STRIP = 'triangles_strip', exports.QUADS = 'quads', exports.QUAD_STRIP = 'quad_strip';
	exports.CLOSE = 'close';
	exports.OPEN = 'open', exports.CHORD = 'chord', exports.PIE = 'pie';
	exports.SQUARE = 'butt', exports.ROUND = 'round', exports.PROJECT = 'square'; // PEND: careful this is counterintuitive
	exports.BEVEL = 'bevel', exports.MITER = 'miter';
	exports.RGB = 'rgb', exports.HSB = 'hsb';
	exports.AUTO = 'auto';
	exports.CROSS = 'crosshair', exports.HAND = 'pointer', exports.MOVE = 'move', exports.TEXT = 'text', exports.WAIT = 'wait';

}(window));
