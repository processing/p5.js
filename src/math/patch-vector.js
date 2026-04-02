import { Vector } from './p5.Vector.js';

/**
 * @private
 * @internal
 */
export function _defaultEmptyVector(target){
  return function(...args){
    if(args.length === 0){
      p5._friendlyError(
        'In 1.x, createVector() was a shortcut for createVector(0, 0, 0). In 2.x, p5.js has vectors of any dimension, so you must provide your desired number of zeros. Use createVector(0, 0) for a 2D vector and createVector(0, 0, 0) for a 3D vector.',
        'p5.createVector'
      );
      return target.call(this, 0, 0, 0);
    }else{
      if (Array.isArray(args[0])) {
        args = args[0];
      }
      return target.call(this, ...args);
    }
  };
}


/**
 * @private
 * @internal
 */
export function _validatedVectorOperation(expectsSoloNumberArgument){
  return function(target){
    return function(...args){
      if (args.length === 0) {
        // No arguments? No action
        return this;
      } else if (args[0] instanceof Vector) {
        // First argument is a vector? Make it an array
        args = args[0].values;
      } else if (Array.isArray(args[0])) {
        // First argument is an array? Great, keep it!
        args = args[0];
      } else if (expectsSoloNumberArgument && args.length === 1){
        // Special case for a solo numeric arguments only applies sometimes
        args = new Array(3).fill(args[0]);
      }

      if(Array.isArray(args) && !args.every(v => typeof v === 'number' && Number.isFinite(v))){
        p5._friendlyError(
          'Arguments contain non-finite numbers',
          target.name
        );
        return this;
      };

      return target.call(this, ...args);
    };
  };
}

/**
 * Each of the following decorators validates the data on vector operations.
 * These ensure that the arguments are consistently formatted, and that
 * pre-conditions are met.
 */
export default function vectorValidation(p5, fn, lifecycles){

  p5.registerDecorator('p5.prototype.createVector', _defaultEmptyVector);
  p5.registerDecorator('p5.Vector.prototype.mult', _validatedVectorOperation(true));
  p5.registerDecorator('p5.Vector.prototype.rem', _validatedVectorOperation(true));
  p5.registerDecorator('p5.Vector.prototype.div', _validatedVectorOperation(true));
  p5.registerDecorator('p5.Vector.prototype.add', _validatedVectorOperation(false));
  p5.registerDecorator('p5.Vector.prototype.sub', _validatedVectorOperation(false));

}
