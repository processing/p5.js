import primitives3D from '../webgl/3d_primitives';
import interaction from '../webgl/interaction';
import light from '../webgl/light';
import loading from '../webgl/loading';
import material from '../webgl/material';
import text from '../webgl/text';
import renderBuffer from '../webgl/p5.RenderBuffer';
import quat from '../webgl/p5.Quat';
import matrix from '../math/p5.Matrix';
import geometry from '../webgl/p5.Geometry';
import framebuffer from '../webgl/p5.Framebuffer';
import dataArray from '../webgl/p5.DataArray';
import shader from '../webgl/p5.Shader';
import camera from '../webgl/p5.Camera';
import texture from '../webgl/p5.Texture';
import rendererGL from '../webgl/p5.RendererGL';
import strands from '../strands/p5.strands';

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
  p5.registerAddon(shader);
  p5.registerAddon(texture);
  p5.registerAddon(strands);
}
