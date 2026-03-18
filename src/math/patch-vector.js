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
      console.log("vVO", target.name, args);
      if (args.length === 0) {
        // No arguments? No action
        return this;
      } else if (args[0] instanceof Vector) {
        args = args[0].values;
      } else if (Array.isArray(args[0])) {
        args = args[0];
      } else if (args.length === 1) {
        console.log("A")
        if (expectsSoloNumberArgument){
          console.log("b")
          // && typeof args[0] === 'number' && Number.isFinite(args[0])
          // Special case handling for a solo numeric argument
          args = new Array(3).fill(args[0]);
        }
      } // (1,2,3) ...args is 1,2,3

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

  p5.registerDecorator(function(path){
    return ['p5.Vector.prototype.add', 'p5.Vector.prototype.sub'].includes(path);
  }, _validatedVectorOperation(false));

  p5.registerDecorator(function(path){
    return ['p5.Vector.prototype.rem', 'p5.Vector.prototype.div'].includes(path);
  }, _validatedVectorOperation(true));

}
