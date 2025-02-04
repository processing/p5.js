// core
import p5 from './core/main';

// shape
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
import dom from './dom';
dom(p5);

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

// utilities
import utilities from './utilities';
utilities(p5);

// webgl
import webgl from './webgl';
webgl(p5);

// typography
import type from './type'
type(p5);

import { waitForDocumentReady, waitingForTranslator, _globalInit } from './core/init';
Promise.all([waitForDocumentReady(), waitingForTranslator]).then(_globalInit);

export default p5;

