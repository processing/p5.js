import arrayFunctions from './array_functions.js';
import conversion from './conversion.js';
import stringFunctions from './string_functions.js';
import timeDate from './time_date.js';

export default function(p5){
  p5.registerAddon(arrayFunctions);
  p5.registerAddon(conversion);
  p5.registerAddon(stringFunctions);
  p5.registerAddon(timeDate);
}
