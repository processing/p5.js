# Typography Benchmarks

To isolate typography tests, run the following:

```shell
npx vitest bench test/bench/typography.bench.js --reporter=verbose
```

Implementation notes:

- All pre-existing benchmarks included the full p5 instance setup which adds ~50ms to each test. The `textToPoints() single word, isolated benchmark` test is included as a potential way to isolate performance testing away from setup overhead.
- The `with render` test draws the points, others just run `textToPoints()`.

## Open tasks

1. Add benchmarks for the following functions:

    - textToContours()
    - textToPaths()
    - textToPoints()
    - textToContours()
    - textToPaths()
    - textToModel()

2. Consider how we might parameterize code re-use accross tests for the 3 renderers. See initial notes in `typography.bench.js`. Without this, tests may begin to drift over time without careful code reviews.
3. Create a custom vitest reporter to help automate updating this document.

## 2D

### textToPoints()

 ✓  unit-tests-webgpu (chrome)  test/bench/typography.bench.js > Typography: bench 2D 8671ms
     name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · textToPoints() single word                       18.9179  51.9000  54.2000  52.8600  53.2000  54.2000  54.2000  54.2000  ±0.49%       20
   · textToPoints() single word, 150pt                18.2715  53.4000  57.1000  54.7300  55.0000  57.1000  57.1000  57.1000  ±0.68%       20
   · textToPoints() single word, isolated benchmark  1,220.78   0.5000   4.4000   0.8191   0.8000   3.0000   3.5000   4.4000  ±4.35%      611
   · textToPoints() single word, with render          18.7161  52.7000  54.4000  53.4300  53.6000  54.4000  54.4000  54.4000  ±0.43%       20
   · textToPoints() 10 words                          18.0766  54.8000  56.2000  55.3200  55.5000  56.2000  56.2000  56.2000  ±0.34%       20
   · textToPoints() Paragraph                          9.9265  97.8000   112.10   100.74   101.00   112.10   112.10   112.10  ±1.36%       20

## WebGL

### textToPoints()

 ✓  unit-tests-webgpu (chrome)  test/bench/typography.bench.js > Typography: bench WebGL 9082ms
     name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · textToPoints() single word                       18.9502  52.0000  54.4000  52.7700  53.0000  54.4000  54.4000  54.4000  ±0.52%       20
   · textToPoints() single word, 150pt                18.3469  53.6000  55.7000  54.5050  54.9000  55.7000  55.7000  55.7000  ±0.52%       20
   · textToPoints() single word, isolated benchmark  1,288.71   0.5000   5.8000   0.7760   0.7000   2.6000   4.0000   5.8000  ±4.69%      645
   · textToPoints() single word, with render          14.2867  68.9000  72.1000  69.9950  70.5000  72.1000  72.1000  72.1000  ±0.61%       20
   · textToPoints() 10 words                          17.9388  55.0000  56.8000  55.7450  56.0000  56.8000  56.8000  56.8000  ±0.48%       20
   · textToPoints() Paragraph                          9.9285  99.1000   102.90   100.72   101.40   102.90   102.90   102.90  ±0.46%       20

## WebGPU

### textToPoints()

  ✓  unit-tests-webgpu (chrome)  test/bench/typography.bench.js > Typography: bench WebGPU 8687ms
     name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · textToPoints() single word                       18.8840  52.2000  54.0000  52.9550  53.3000  54.0000  54.0000  54.0000  ±0.45%       20
   · textToPoints() single word, 150pt                18.4349  53.5000  55.3000  54.2450  54.6000  55.3000  55.3000  55.3000  ±0.52%       20
   · textToPoints() single word, isolated benchmark  1,248.50   0.6000   6.8000   0.8010   0.7000   2.9000   3.7000   6.8000  ±5.27%      625
   · textToPoints() single word, with render          18.5874  52.8000  55.7000  53.8000  54.1000  55.7000  55.7000  55.7000  ±0.56%       20
   · textToPoints() 10 words                          17.9937  55.0000  56.7000  55.5750  55.9000  56.7000  56.7000  56.7000  ±0.44%       20
   · textToPoints() Paragraph                          9.8712  99.6000   103.40   101.30   102.00   103.40   103.40   103.40  ±0.46%       20
