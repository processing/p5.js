export default function patchVector(p5, fn, lifecycles){
  p5.decorateHelper('createVector', function(target){
    return function(...args){
      if(args.length === 0){
        // console.log('empty call to createVector');
        return new Proxy(new p5.Vector(0, 0, 0), {

        });
      }else{
        return target.call(this, ...args);
      }
    };
  });
}
