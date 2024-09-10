import describe from './describe.js';
import gridOutput from './gridOutput.js';
import textOutput from './textOutput.js';
import outputs from './outputs.js';

export default function(p5){
  p5.registerAddon(describe);
  p5.registerAddon(gridOutput);
  p5.registerAddon(textOutput);
  p5.registerAddon(outputs);
}
