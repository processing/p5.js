/* global suite, benchmark */
p5.disableFriendlyErrors = true;

var p5Inst = new p5();

/**
 *  Compare the p5 sin() function to the native Math.sin()
 */
suite('p5 sin() vs Math.sin()', function() {
  benchmark('p5 sin()', function() {
    return p5Inst.sin();
  });

  benchmark('Math.sin()', function() {
    return Math.sin();
  });
});
