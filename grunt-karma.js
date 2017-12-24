/**
 *  This is the grunt config for karma. It is in it's own file because the
 *  list of benchmark targets could grow large over time as we add benchmarks
 *  for p5 functions.  Benchmarks are separated so you can run specific
 *  benchmarks when developing for speed.
 */
module.exports = {
  options: {
    configFile: 'karma.conf.js'
  },
  'random-fe-on-prod': {
    options: {
      files: [
        'https://cdnjs.cloudflare.com/ajax/libs/p5.js/<%= pkg.version %>/p5.js',
        'bench/math/random-fe-on.bench.js'
      ]
    }
  },
  'random-fe-on-prod-min': {
    options: {
      files: [
        'https://cdnjs.cloudflare.com/ajax/libs/p5.js/<%= pkg.version %>/p5.min.js',
        'bench/math/random-fe-on.bench.js'
      ]
    }
  },
  'sin-prod': {
    options: {
      files: [
        'https://cdnjs.cloudflare.com/ajax/libs/p5.js/<%= pkg.version %>/p5.js',
        'bench/math/sin.bench.js'
      ]
    }
  },
  'sin-dev': {
    options: {
      files: ['lib/p5.js', 'bench/math/sin.bench.js']
    }
  },
  'random-fe-on-dev': {
    options: {
      files: ['lib/p5.js', 'bench/math/random-fe-on.bench.js']
    }
  },
  'random-fe-off-prod': {
    options: {
      files: [
        'https://cdnjs.cloudflare.com/ajax/libs/p5.js/<%= pkg.version %>/p5.js',
        'bench/math/random-fe-off.bench.js'
      ]
    }
  },
  'random-fe-off-prod-min': {
    options: {
      files: [
        'https://cdnjs.cloudflare.com/ajax/libs/p5.js/<%= pkg.version %>/p5.min.js',
        'bench/math/random-fe-off.bench.js'
      ]
    }
  },
  'random-fe-off-dev': {
    options: {
      files: ['lib/p5.js', 'bench/math/random-fe-off.bench.js']
    }
  }
};
