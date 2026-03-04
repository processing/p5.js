export default function patchVector(p5, fn, lifecycles){

  // An empty vector defaults to a 3D vector.
  // TODO might need p5.prototype
  p5.registerDecorator('createVector', function(target){
    return function(...args){
      console.log("!!!!!")
      if(args.length === 0){
        p5._friendlyError(
          'In 1.x, createVector() was a shortcut for createVector(0, 0, 0). In 2.x, p5.js has vectors of any dimension, so you must provide your desired number of zeros. Use createVector(0, 0) for a 2D vector and createVector(0, 0, 0) for a 3D vector.'
        );
        return target.call(this, 0, 0, 0);
      }else{
        return target.call(this, ...args);
      }
    };
  });

  p5.registerDecorator('p5.Vector.prototype.add', function(target){
    return function(...args){
      console.log("hi")
    };
  });
  /*
    add(...args) {

    // TODO Implement using decorator API to reduce duplication.
    if (args[0] instanceof Vector) {
      args = args[0].values;
    } else if (Array.isArray(args[0])) {
      args = args[0];
    } else if (args.length === 0) {
      return this;
    }

    */

}
