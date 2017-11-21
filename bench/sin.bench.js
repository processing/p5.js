/* global suite, benchmark */
let p5Inst;

/**
 *  Compare the p5 sin() function to the native Math.sin()
 */
suite('p5 sin() vs Math.sin()', function () {
  benchmark('p5 sin()', function () {
    return p5Inst.sin();
  });

  benchmark('Math.sin()', function () {
    return Math.sin();
  });
}, {
  onStart: function() {
    p5Inst = new p5();
  },
});
