import fesCore from './fes_core';
import stacktrace from './stacktrace';
import validateParams from './param_validator.js';
import sketchVerifier from './sketch_verifier.js';
import fileErrors from './file_errors';

export default function (p5) {
  p5.registerAddon(fesCore);
  p5.registerAddon(stacktrace);
  p5.registerAddon(validateParams);
  p5.registerAddon(sketchVerifier);
  p5.registerAddon(fileErrors);
}
