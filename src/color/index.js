import creatingReading from './creating_reading.js';
import p5color from './p5.Color.js';
import setting from './setting.js';

export default function(p5){
  p5.registerAddon(creatingReading);
  p5.registerAddon(p5color);
  p5.registerAddon(setting);
}
