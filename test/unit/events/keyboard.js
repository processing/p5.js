suite('Keyboard Events', function() {
  suite('keyPressed', function() {
    test('keyPressed functions on multiple instances must run once', async function() {
      let sketchFn = function(sketch, resolve, reject) {
        let count = 0;
        sketch.keyPressed = function() {
          count += 1;
        };

        sketch.finish = function() {
          resolve(count);
        };
      };
      let sketches = parallelSketches([sketchFn, sketchFn]); //create two sketches
      await sketches.setup; //wait for all sketches to setup
      window.dispatchEvent(new KeyboardEvent('keydown')); //dipatch a keyboard event to trigger the keyPressed functions
      sketches.end(); //resolve all sketches by calling their finish functions
      let counts = await sketches.result; //get array holding number of times keyPressed was called. Rejected sketches also thrown here
      assert.deepEqual(counts, [1, 1]); //check if every keyPressed function was called once
    });
  });
});
