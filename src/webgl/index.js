import primitives3D from './3d_primitives';
import interaction from './interaction';
import light from './light';
import loading from './loading';
import material from './material';
import text from './text';
import renderBuffer from './p5.RenderBuffer';
import quat from './p5.Quat';
import matrix from '../math/p5.Matrix';
import geometry from './p5.Geometry';
import framebuffer from './p5.Framebuffer';
import dataArray from './p5.DataArray';
import shader from './p5.Shader';
import camera from './p5.Camera';
import texture from './p5.Texture';
import rendererGL from './p5.RendererGL';
import shadergenerator from './ShaderGenerator';

export default function(p5){
  rendererGL(p5, p5.prototype);
  primitives3D(p5, p5.prototype);
  interaction(p5, p5.prototype);
  light(p5, p5.prototype);
  loading(p5, p5.prototype);
  material(p5, p5.prototype);
  text(p5, p5.prototype);
  renderBuffer(p5, p5.prototype);
  quat(p5, p5.prototype);
  matrix(p5, p5.prototype);
  geometry(p5, p5.prototype);
  camera(p5, p5.prototype);
  framebuffer(p5, p5.prototype);
  dataArray(p5, p5.prototype);
  shader(p5, p5.prototype);
  texture(p5, p5.prototype);
  shadergenerator(p5, p5.prototype);
}
