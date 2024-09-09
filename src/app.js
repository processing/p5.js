// core
import p5 from './core/main';
import './core/constants';
import './core/environment';
import './core/friendly_errors/stacktrace';
import './core/friendly_errors/validate_params';
import './core/friendly_errors/file_errors';
import './core/friendly_errors/fes_core';
import './core/friendly_errors/sketch_reader';
import './core/helpers';
import './core/legacy';
// import './core/preload';
import './core/p5.Element';
import './core/p5.Graphics';
// import './core/p5.Renderer';
import './core/p5.Renderer2D';
import './core/rendering';
import './core/structure';
import './core/transform';
import './core/shape/2d_primitives';
import './core/shape/attributes';
import './core/shape/curves';
import './core/shape/vertex';
//accessibility
import './accessibility/outputs';
import './accessibility/textOutput';
import './accessibility/gridOutput';
import './accessibility/color_namer';
// color
import './color/creating_reading';
import './color/p5.Color';
import './color/setting';

// data
import './data/p5.TypedDict';
import './data/local_storage.js';

// DOM
import './dom/dom';

// accessibility
import './accessibility/describe';

// events
import events from './events';
events(p5);

// image
import './image/filters';
import './image/image';
import './image/loading_displaying';
import './image/p5.Image';
import './image/pixels';

// io
import './io/files';
import './io/p5.Table';
import './io/p5.TableRow';
import './io/p5.XML';

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
import './webgl/3d_primitives';
import './webgl/interaction';
import './webgl/light';
import './webgl/loading';
import './webgl/material';
import './webgl/p5.Camera';
import './webgl/p5.DataArray';
import './webgl/p5.Geometry';
import './webgl/p5.Matrix';
import './webgl/p5.Quat';
import './webgl/p5.RendererGL.Immediate';
import './webgl/p5.RendererGL';
import './webgl/p5.RendererGL.Retained';
import './webgl/p5.Framebuffer';
import './webgl/p5.Shader';
import './webgl/p5.RenderBuffer';
import './webgl/p5.Texture';
import './webgl/text';

import './core/init';

export default p5;
