# Benchmark Report

## Strands CPU compute fallback vs handwritten particle loop

This benchmark compares two ways of advancing 100 particles by one step:

1. Lowering a Strands compute shader to JavaScript using `strands_jsBackend.js` and running it for 100
   particles.
2. Running an equivalent handwritten JavaScript loop over 100 particles.

Both are measured as a single unit of work. The Strands case clears the cached
compiled hook before every dispatch, so each iteration pays the lowering cost
(`compileCpuComputeHook`) plus the per-particle execution, matching the first
`compute()` call in a sketch. The result: the handwritten loop is about
**12x faster** (averaged over 5 runs).

## Script that we are benchmarking

`test/bench/strands_jsBackend.bench.js`:

Command:

```
npx vitest bench test/bench/strands_jsBackend.bench.js
```

## Methodology

- Runs in Vitest browser mode (Chromium). The config runs the bench file under
  both browser projects (`unit-tests` and `unit-tests-webgpu`), so each command
  produces two result blocks. Both are reported below.
- Bench options: `iterations: 20, time: 500`. Vitest reports the ops/sec and
  mean per-op time from thousands of samples per case.
- The whole command was run 5 times. The tables below report the mean and
  standard deviation across those 5 runs (not just within a single run).
- Particle count is 100. Each iteration does `position += velocity`.
- Lowering here means IR to JavaScript (`new Function` codegen). The IR itself
  is recorded once at `buildComputeShader()` time and is not re-recorded per
  iteration.


## Summary

- The handwritten loop is **11.8x** faster on `unit-tests`, **12.2x** on
  `unit-tests-webgpu`, and **12.0x** faster when both projects are combined.
- Lowering (`new Function` codegen) is not the bottleneck.
  Nearly all of the Strands cost is the per-particle storage read,
  vector add, and storage write.
