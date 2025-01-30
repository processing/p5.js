import dom from './dom';
import element from './p5.Element';
import media from './p5.MediaElement';
import file from './p5.File';

export default function(p5){
  p5.registerAddon(dom);
  p5.registerAddon(element);
  p5.registerAddon(media);
  p5.registerAddon(file);
}
