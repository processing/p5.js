import p5 from '../../../src/app.js';

suite('FES Error Monitoring', function () {
  let myp5;
  let logs = [];
  let originalFesLogger;

  beforeEach(function () {
    logs = [];
    myp5 = new p5(function () {});
    // Use _fesLogger to capture FES error messages (proper way to test FES)
    originalFesLogger = myp5._fesLogger;
    myp5._fesLogger = function (...args) {
      logs.push(args.join(' '));
    };
  });

  afterEach(function () {
    myp5._fesLogger = originalFesLogger;
    if (myp5) {
      myp5.remove();
    }
  });

  test('should handle ReferenceError without throwing when friendlyStack is null', function (done) {
    // This test verifies the fix for issue #8381: FES should not throw an error
    // when friendlyStack is null (which happens when processStack returns [false, null])
    // Before the fix, accessing friendlyStack[0].lineNumber would throw a TypeError,
    // causing a second error that masks the actual ReferenceError
    //
    // This test reproduces the scenario from the example sketch:
    // https://editor.p5js.org/davepagurek/sketches/aVaqe0sNn
    // where accessing an undefined variable (like `s + 20`) triggers a ReferenceError
    // that goes through handleMisspelling -> get pixels -> fesErrorMonitor
    
    // Track if FES itself throws an error (the bug we're fixing)
    let fesThrewError = false;
    let referenceErrorCaught = false;
    let errorMessages = [];
    const originalErrorHandler = window.onerror;
    
    // Set up error handler to catch any errors
    window.onerror = function(message, source, lineno, colno, error) {
      errorMessages.push({
        message: message,
        name: error ? error.name : 'Unknown',
        errorMessage: error ? error.message : message
      });
      
      // Check if this is the specific TypeError from FES accessing friendlyStack[0].lineNumber
      // This is the bug we're fixing: when friendlyStack is null, accessing friendlyStack[0].lineNumber
      // at line 730 in fes_core.js throws "Cannot read property 'lineNumber' of undefined"
      // We specifically check for errors about 'lineNumber' to avoid false positives from
      // other TypeErrors (like the 'pixels' error from handleMisspelling)
      if (error && error.name === 'TypeError' && error.message && 
          (error.message.includes('lineNumber') || 
           error.message.includes("can't access property 'lineNumber'"))) {
        fesThrewError = true;
      }
      // Check if this is the original ReferenceError
      if (error && error.name === 'ReferenceError') {
        referenceErrorCaught = true;
      }
      return false; // Don't prevent default error handling
    };
    
    // Create a p5 instance that will trigger a ReferenceError naturally
    // Similar to the example sketch: console.log(s + 20) where s is undefined
    // This will trigger the same code path: ReferenceError -> handleMisspelling -> fesErrorMonitor
    const testP5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100);
      };
      
      p.draw = function() {
        // Access undefined variable to trigger ReferenceError naturally
        // This mimics the example sketch: console.log(s + 20)
        // The error will propagate to the browser's error handler, which FES monitors
        // This triggers the same code path as the example: handleMisspelling -> fesErrorMonitor
        const result = s + 20; // eslint-disable-line no-undef
        p.noLoop(); // Stop after first frame
      };
    });
    
    // Give FES time to process the error
    setTimeout(function() {
      window.onerror = originalErrorHandler;
      
      // FES should not throw its own error
      // This is the core fix: before the fix, accessing friendlyStack[0].lineNumber
      // when friendlyStack is null would throw a TypeError, causing a second error
      assert.isFalse(
        fesThrewError,
        'FES should not throw its own error when handling ReferenceError. ' +
        'If this fails, FES is throwing a TypeError when friendlyStack is null. ' +
        'Error messages: ' + JSON.stringify(errorMessages, null, 2)
      );
      
      // Should have caught the original ReferenceError
      assert.isTrue(
        referenceErrorCaught,
        'Should have caught the original ReferenceError from undefined variable. ' +
        'Error messages: ' + JSON.stringify(errorMessages, null, 2)
      );
      
      testP5.remove();
      done();
    }, 200);
  });
});

