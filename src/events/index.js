import acceleration from './acceleration.js';
import keyboard from './keyboard.js';
import pointer from './pointer.js';

export default function(p5){
  p5.registerAddon(acceleration);
  p5.registerAddon(keyboard);
  p5.registerAddon(pointer);
}
