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

  test('should handle ReferenceError without throwing when friendlyStack is null', function () {
    // This test verifies the fix for issue #8381: FES should not throw an error
    // when friendlyStack is null (which happens when processStack returns [false, null])
    // Before the fix, accessing friendlyStack[0].lineNumber would throw a TypeError,
    // causing a second error that masks the actual ReferenceError
    
    let fesThrewError = false;
    let errorMessage = '';
    
    // Create a ReferenceError similar to what happens when a variable is undefined
    const referenceError = new ReferenceError('s is not defined');
    
    // Manually trigger FES error monitor
    // This should not throw even if friendlyStack is null
    try {
      if (myp5 && myp5._fesErrorMonitor) {
        myp5._fesErrorMonitor(referenceError);
      }
    } catch (e) {
      fesThrewError = true;
      errorMessage = e.message;
    }

    // FES should not throw its own error
    // This is the core fix: before the fix, accessing friendlyStack[0].lineNumber
    // when friendlyStack is null would throw a TypeError, causing a second error
    assert.isFalse(
      fesThrewError,
      `FES should not throw an error when handling ReferenceError. Error: ${errorMessage}`
    );
  });
});

