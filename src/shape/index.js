import primitives from './2d_primitives.js';
import attributes from './attributes.js';
import curves from './curves.js';
import vertex from './vertex.js';

export default function(p5){
  p5.registerAddon(primitives);
  p5.registerAddon(attributes);
  p5.registerAddon(curves);
  p5.registerAddon(vertex);
}
