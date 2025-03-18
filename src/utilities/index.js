import conversion from './conversion.js';
import utilityFunctions from './utility_functions.js';
import timeDate from './time_date.js';

export default function(p5){
  p5.registerAddon(conversion);
  p5.registerAddon(utilityFunctions);
  p5.registerAddon(timeDate);
}
