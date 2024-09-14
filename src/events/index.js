import acceleration from './acceleration.js';
import keyboard from './keyboard.js';
import mouse from './mouse.js';
import touch from './touch.js';

export default function(p5){
  p5.registerAddon(acceleration);
  p5.registerAddon(keyboard);
  p5.registerAddon(mouse);
  p5.registerAddon(touch);
}
