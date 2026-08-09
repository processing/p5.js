import { Vector } from '../type/textCore.js';
// TODO implement clickable arialabels for text written to canvas


/**
 * @private
 * @internal
 */
export function _helper(target){
  return function(...args){
    // this.constructor._friendlyError('if need to emit non-blocking warning');
    // do something
    console.log("text was called")
    // wrap the call to the function
    return target.call(this, ...args);
  };
}


/**
 * @private
 * @internal
 * TODO
 */
export default function vectorValidation(p5, fn, lifecycles){

  p5.registerDecorator('p5.prototype.text', _helper);
  // text to model etc

}
