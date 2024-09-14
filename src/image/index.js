import image from './image.js';
import loadingDisplaying from './loading_displaying.js';
import p5image from './p5.Image.js';
import pixels from './pixels.js';

export default function(p5){
  p5.registerAddon(image);
  p5.registerAddon(loadingDisplaying);
  p5.registerAddon(p5image);
  p5.registerAddon(pixels);
}
