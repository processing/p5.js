<!-- Guide to writing performance tests for p5.js source code.  -->

# Performance Testing

Performance testing is an essential part of measuring how fasst isolated code paths take to execute under a known range of conditions.

Implementation notes:

- All pre-existing benchmarks included the full p5 instance setup which adds ~50ms to each test. The typography performance tests show how to isolate performance testing away from setup overhead.
- The `textToPoints() single word, with render` test draws the calculated points, others just run `textToPoints()`.

## Typography Tests

To isolate typography tests, run the following:

```shell
npx vitest bench test/bench/typography.bench.js --reporter=verbose
```
