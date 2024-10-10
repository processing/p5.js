import validateParams from './param_validator.js';
import sketchVerifier from './sketch_verifier.js';

export default function (p5) {
  p5.registerAddon(validateParams);
  p5.registerAddon(sketchVerifier);
}