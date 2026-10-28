import fesCore from './fes_core';
import validateParams from './param_validator.js';
import sketchVerifier from './sketch_verifier.js';
import fes from './fes';

export default function (p5) {
  p5.registerAddon(fes);
  p5.registerAddon(fesCore);
  p5.registerAddon(validateParams);
  p5.registerAddon(sketchVerifier);
}
