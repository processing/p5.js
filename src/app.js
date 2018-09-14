'use strict';

// core
var p5 = require('./core/main');
require('./core/constants');
require('./core/environment');
require('./core/error_helpers');
require('./core/helpers');
require('./core/legacy');
require('./core/p5.Element');
require('./core/p5.Graphics');
require('./core/p5.Renderer');
require('./core/p5.Renderer2D');
require('./core/rendering');
require('./core/shim');
require('./core/structure');
require('./core/transform');
require('./core/shape/2d_primitives');
require('./core/shape/attributes');
require('./core/shape/curves');
require('./core/shape/vertex');

// color
require('./color/color_conversion');
require('./color/creating_reading');
require('./color/p5.Color');
require('./color/setting');

// data
require('./data/p5.TypedDict');

// events
require('./events/acceleration');
require('./events/keyboard');
require('./events/mouse');
require('./events/touch');

// image
require('./image/filters');
require('./image/image');
require('./image/loading_displaying');
require('./image/p5.Image');
require('./image/pixels');

// io
require('./io/files');
require('./io/p5.Table');
require('./io/p5.TableRow');
require('./io/p5.XML');

// math
require('./math/calculation');
require('./math/math');
require('./math/noise');
require('./math/p5.Vector');
require('./math/random');
require('./math/trigonometry');

// typography
require('./typography/attributes');
require('./typography/loading_displaying');
require('./typography/p5.Font');

// utilities
require('./utilities/array_functions');
require('./utilities/conversion');
require('./utilities/string_functions');
require('./utilities/time_date');

// webgl
require('./webgl/3d_primitives');
require('./webgl/interaction');
require('./webgl/light');
require('./webgl/loading');
require('./webgl/material');
require('./webgl/p5.Camera');
require('./webgl/p5.Geometry');
require('./webgl/p5.Matrix');
require('./webgl/p5.RendererGL.Immediate');
require('./webgl/p5.RendererGL');
require('./webgl/p5.RendererGL.Retained');
require('./webgl/p5.Shader');
require('./webgl/p5.Texture');
require('./webgl/text');

require('./core/init');

module.exports = p5;
