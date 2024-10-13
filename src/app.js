// core
import p5 from './core/main';
import './core/friendly_errors/stacktrace';
import './core/friendly_errors/validate_params';
import './core/friendly_errors/file_errors';
import './core/friendly_errors/fes_core';
import './core/friendly_errors/sketch_reader';
import './core/p5.Element';
// import './core/p5.Graphics';
// import './core/rendering';
import shape from './shape';
shape(p5);

//accessibility
import accessibility from './accessibility';
accessibility(p5);

// color
import color from './color';
color(p5);

// core
// currently, it only contains the test for parameter validation
import friendlyErrors from './core/friendly_errors';
friendlyErrors(p5);

// data
import data from './data';
data(p5);

// DOM
import dom from './dom/dom';
dom(p5, p5.prototype);

// events
import events from './events';
events(p5);

// image
import image from './image';
image(p5);

// io
import io from './io';
io(p5);

// math
import math from './math';
math(p5);

// typography
import './typography/attributes';
import './typography/loading_displaying';
import './typography/p5.Font';

// utilities
import utilities from './utilities';
utilities(p5);

// webgl
import webgl from './webgl';
webgl(p5);

import './core/init';

export default p5;
