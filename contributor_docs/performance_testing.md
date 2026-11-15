<!-- Guide to writing performance tests for p5.js source code.  -->

# Performance Testing

Performance testing is an essential part of measuring how fast isolated code paths take to execute under a known range of conditions.

Implementation notes:

- All pre-existing benchmarks included the full p5 instance setup which adds ~50ms to each test. The typography performance tests show how to isolate performance testing away from setup overhead.
- The `textToPoints() single word, with render` test draws the calculated points, others just run `textToPoints()`.

## Typography Tests

To isolate typography tests, run the following:

```shell
npx vitest bench test/bench/typography.bench.js --reporter=verbose
```

### Manual tests on v1.x

These manual tests are useful to loosely check performance against v2.x as a baseline. The test harness is compatible with the one in `test/bench/typography.bench.js`. 

To manually run typography tests against p5.js v1.x, open the following files in a browser:

- `textToPoints()`: `test/bench/v1_manual/text_to_points.html`

Note: you will need to use a [local server](https://github.com/processing/p5.js/wiki/Local-server) to avoid CORS issues when loading fonts. For example, from the root of the repo:

```shell
npx http-server -c-1
```

Then tests can be accessed at `http://localhost:8080/test/bench/v1_manual/text_to_points.html`.
