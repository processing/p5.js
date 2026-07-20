import { Vector } from './p5.Vector.js';

/**
 * @private
 * @internal
 */
export function _defaultEmptyVector(target){
  return function(...args){
    if(args.length === 0){
      this.constructor._friendlyError(
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
 * @param {Boolean} expectsSoloNumberArgument whether a single number scales
 *   every component (mult/div/rem)
 * @param {Number} [trailingArgCount=0] number of trailing args to peel off
 *   before treating the rest as vector components (e.g. 1 for lerp's amt)
 * @param {Number[]} [trailingDefaults] if provided, used when only component
 *   values are passed (no trailing args), e.g. `[0]` so `v.lerp(other)` uses amt 0
 */
export function _validatedVectorOperation(
  expectsSoloNumberArgument,
  trailingArgCount = 0,
  trailingDefaults
){
  return function(target){
    return function (...args) {
      const trailing = [];

      if (trailingArgCount > 0) {
        const onlyValues =
          args.length === 1 &&
          (args[0] instanceof Vector || Array.isArray(args[0]));

        if (onlyValues && trailingDefaults) {
          for (let i = 0; i < trailingDefaults.length; i++) {
            trailing.push(trailingDefaults[i]);
          }
        } else if (args.length < trailingArgCount) {
          if (trailingDefaults && args.length === 0) {
            // No arguments? No action (same as other vector ops)
            return this;
          }
          if (!this.friendlyErrorsDisabled()) {
            this._friendlyError(
              'Requires valid arguments',
              'p5.Vector'
            );
          }
          return this;
        } else {
          for (let i = 0; i < trailingArgCount; i++) {
            trailing.unshift(args.pop());
          }

          for (let i = 0; i < trailing.length; i++) {
            const t = trailing[i];
            if (typeof t !== 'number' || !Number.isFinite(t)) {
              if (!this.friendlyErrorsDisabled()) {
                this._friendlyError(
                  'Arguments contain non-finite numbers',
                  'p5.Vector'
                );
              }
              return this;
            }
          }

          if (args.length === 0) {
            if (!this.friendlyErrorsDisabled()) {
              this._friendlyError(
                'Requires valid arguments',
                'p5.Vector'
              );
            }
            return this;
          }
        }
      } else if (args.length === 0) {
        // No arguments? No action
        return this;
      }

      if (args[0] instanceof Vector) {
        // Do not allow extra args after a vector when trailing args are used
        if (trailingArgCount > 0 && args.length > 1) {
          if (!this.friendlyErrorsDisabled()) {
            this._friendlyError(
              'Requires valid arguments',
              'p5.Vector'
            );
          }
          return this;
        }
        // First argument is a vector? Make it an array
        args = args[0].values;
      } else if (Array.isArray(args[0])) {
        if (trailingArgCount > 0 && args.length > 1) {
          if (!this.friendlyErrorsDisabled()) {
            this._friendlyError(
              'Requires valid arguments',
              'p5.Vector'
            );
          }
          return this;
        }
        // First argument is an array? Great, keep it!
        args = args[0];
      } else if (args.length === 1){
        // Special case for a solo numeric arguments only applies sometimes
        if (expectsSoloNumberArgument) {
          args = args[0];
        }
      }

      if(Array.isArray(args)){
        for (let i = 0; i < args.length; i++) {
          const v = args[i];
          if (typeof v !== 'number' || !Number.isFinite(v)) {
            if (!this.friendlyErrorsDisabled()) {
              this._friendlyError(
                'Arguments contain non-finite numbers',
                'p5.Vector'
              );
            }
            return this;
          }
        }
      } else {
        if (typeof args !== 'number' || !Number.isFinite(args)) {
          if (!this.friendlyErrorsDisabled()) {
            this._friendlyError(
              'Arguments contain non-finite numbers',
              'p5.Vector'
            );
          }
          return this;
        }
      }

      return target.call(this, args, ...trailing);
    };
  };
}

/**
 * @private
 * @internal
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
  p5.registerDecorator('p5.Vector.prototype.lerp', _validatedVectorOperation(false, 1, [0]));

}
