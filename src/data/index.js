import storage from './local_storage.js';
import typedDict from './p5.TypedDict.js';

export default function(p5){
  p5.registerAddon(storage);
  p5.registerAddon(typedDict);
}
