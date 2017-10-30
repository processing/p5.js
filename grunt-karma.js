/**
 *  This is the grunt config for karma. It is in it's own file because the
 *  list of benchmark targets could grow large over time as we add benchmarks
 *  for p5 functions.  Benchamrks are separated so you can run specific
 *  benchmarks when developing for speed.
 */
module.exports = {
  options: {
    configFile: 'karma.conf.js',
  },
  'random-prod': {
    options: {
      files: [
        'https://cdnjs.cloudflare.com/ajax/libs/p5.js/<%= pkg.version %>/p5.js',
        'bench/random.bench.js',
      ],
    },
  },
  'random-dev': {
    options: {
      files: [
        'lib/p5.js',
        'bench/random.bench.js',
      ],
    },
  },
};
