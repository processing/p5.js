/* global suite, benchmark */
let p5Inst;

/**
 *  Compare the p5 random() function to the native Math.random()
 */
suite(
  'p5 random() vs Math.random()',
  function() {
    benchmark('p5 random()', function() {
      return p5Inst.random();
    });

    benchmark('Math.random()', function() {
      return Math.random();
    });
  },
  {
    onStart: function() {
      p5Inst = new p5();
    }
  }
);
