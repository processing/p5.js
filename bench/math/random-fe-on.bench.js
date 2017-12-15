/* global suite, benchmark */
p5.disableFriendlyErrors = false;

var p5Inst = new p5();

/**
 *  Instance random() vs Math.random()
 */
suite('Friendly Errors: ON, Instance random() vs Math.random()', function() {
  benchmark('Instance random()', function() {
    return p5Inst.random();
  });

  benchmark('Math.random()', function() {
    return Math.random();
  });
});

/**
 *  Window random() vs Math.random()
 */
suite('Friendly Errors: ON, Window random() vs Math.random()', function() {
  benchmark('window random()', function() {
    return window.random();
  });

  benchmark('Math.random()', function() {
    return Math.random();
  });
});
