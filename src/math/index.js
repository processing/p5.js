import calculation from './calculation.js';
import noise from './noise.js';
import random from './random.js';
import trigonometry from './trigonometry.js';
import math from './math.js';
import vector from './p5.Vector.js';

export default function(p5){
  p5.registerAddon(calculation);
  p5.registerAddon(noise);
  p5.registerAddon(random);
  p5.registerAddon(trigonometry);
  p5.registerAddon(math);
  p5.registerAddon(vector);
}
