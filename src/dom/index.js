import dom from './dom';
import element from './element';
import media from './media_element';
import file from './p5.File';

export default function(p5){
    p5.registerAddon(dom);
    p5.registerAddon(element);
    p5.registerAddon(media);
    p5.registerAddon(file);
  }