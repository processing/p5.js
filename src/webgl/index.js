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
import camera from './p5.Camera';
import texture from './p5.Texture';
import rendererGL from './p5.RendererGL';

export default function(p5){
  p5.registerAddon(rendererGL);
  p5.registerAddon(primitives3D);
  p5.registerAddon(interaction);
  p5.registerAddon(light);
  p5.registerAddon(loading);
  p5.registerAddon(material);
  p5.registerAddon(text);
  p5.registerAddon(renderBuffer);
  p5.registerAddon(quat);
  p5.registerAddon(matrix);
  p5.registerAddon(geometry);
  p5.registerAddon(camera);
  p5.registerAddon(framebuffer);
  p5.registerAddon(dataArray);
  p5.registerAddon(texture);
}
