module.exports = function (runner) {
  var failures = runner.failures = [];

  var stats = runner.stats = {
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0,
    duration: 0,
    start: 0,
    end: 0
  };

  runner.on('start', function () {
    console.log('-> start');
    stats.start = new Date().getTime();
  });

  runner.on('test', function (test) {
    stats.tests++;
  });

  runner.on('suite', function (suite) {
    stats.suites++;
  });

  runner.on('suite end', function (suite) {
  });

  runner.on('pending', function (test) {
    stats.pending++;
    console.log('?  pending: %s', test.fullTitle());
  });

  runner.on('pass', function (test) {
    stats.passes++;
    console.log('-> pass: %s', test.fullTitle());
  });

  runner.on('fail', function (test, err) {
    stats.failures++;
    test.err = err;
    failures.push(test);
    console.log('!! fail: %s -- error: %s', test.fullTitle(), err.message);
  });

  runner.on('end', function () {
    stats.end = new Date().getTime();
    stats.duration = (stats.end - stats.start);
    console.log('-> end: %d/%d', stats.passes, stats.passes + stats.failures);
  });
};