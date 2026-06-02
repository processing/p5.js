import image from './image.js';
import loadingDisplaying from './loading_displaying.js';
import p5image from './p5.Image.js';
import pixels from './pixels.js';
import shader from '../webgl/p5.Shader.js';
import texture from '../webgl/p5.Texture.js';

export default function(p5){
  p5.registerAddon(image);
  p5.registerAddon(loadingDisplaying);
  p5.registerAddon(p5image);
  p5.registerAddon(pixels);
  p5.registerAddon(shader);
  p5.registerAddon(texture);
}
