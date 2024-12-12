# Benchmark Report

## Sample Test Results

This benchmark report summarizes the performance of tests on the `test/bench/cpu_transforms.ench.js` script, comparing CPU transforms set to true and false. The results show that TEST CPU TRANSFORMS false consistently outperforms true, with higher operations per second (ops/sec) and lower statistical variations. For example, in one test, false achieved 0.9418 ops/sec compared to true at 0.7533 ops/sec, making false 1.25x faster. The report includes detailed metrics and a summary of the relative performance differences.

https://editor.p5js.org/davepagurek/sketches/FAqbP5k8i

## Script that we are benchmarking

Since in the test environment we are not running the draw function we are benchmarking the first run of the draw.

```
const TEST_CPU_TRANSFORMS = false

// Not testing strokes rn because they're slower in general and we don't
// need them for this test to make sense
p5.Geometry.prototype._edgesToVertices = () => {}

let fps
const state = []

function setup() {
  createCanvas(400, 400, WEBGL);
  for (let i = 0; i < 100; i++) {
    state.push({
      pos: createVector(random(-200, 200), random(-200, 200)),
      vel: createVector(random(-2, 2), random(-2, 2)),
    })
  }
  fps = createP()
}

function draw() {
  background(220);
  
  for (const s of state) {
    s.pos.add(s.vel)
    for (const axis of ['x', 'y']) {
      if (s.pos[axis] < -200) {
        s.pos[axis] = -200
        s.vel[axis] *= -1
      }
      if (s.pos[axis] > 200) {
        s.pos[axis] = 200
        s.vel[axis] *= -1
      }
    }
  }
  
  const drawCircles = () => {
    for (const s of state) {
      push()
      translate(s.pos.x, s.pos.y)
      const pts = 500
      beginShape(TRIANGLE_FAN)
      vertex(0,0)
      for (let i = 0; i <= pts; i++) {
        const a = (i/pts) * TWO_PI
        vertex(5*cos(a), 5*sin(a))
      }
      endShape()
      pop()
    }
  }
  if (TEST_CPU_TRANSFORMS) {
    // Flattens into a single buffer
    const shape = buildGeometry(drawCircles)
    model(shape)
    freeGeometry(model)
  } else {
    drawCircles()
  }
  
  fps.html(round(frameRate()))
}
```


### test/bench/dave.bench.js (2) 35272ms
- **Dave bench test (2) 35268ms**
  - **TEST CPU TRANSFORMS true**: 0.7533 ops/sec ±3.80% (10 samples)
  - **TEST CPU TRANSFORMS false**: 0.9418 ops/sec ±0.20% (10 samples) _fastest_

#### Summary
- **TEST CPU TRANSFORMS false** is 1.25x faster than **TEST CPU TRANSFORMS true**

### Separated
#### test/bench/dave.bench.js (2) 27912ms
- **Dave bench test (2) 27909ms**
  - **TEST CPU TRANSFORMS false**: 0.5350 ops/sec ±4.39% (10 samples)
  - **TEST CPU TRANSFORMS true**: _skipped_

#### test/bench/dave.bench.js (2) 19331ms
- **Dave bench test (2) 19327ms**
  - **TEST CPU TRANSFORMS false**: _skipped_
  - **TEST CPU TRANSFORMS true**: 0.7519 ops/sec ±3.80% (10 samples)

### Comparing
#### DEV v2.1.5 /Users/cristianbanuelos/repos/p5.js.git/bench
- **test/bench/dave.bench.js (2) 15671ms**
  - **Dave bench test (2) 15667ms**
    - **TEST CPU TRANSFORMS false**: 0.9719 ops/sec ±1.36% (2 samples) _fastest_
    - **TEST CPU TRANSFORMS true**: 0.8170 ops/sec ±15.16% (2 samples)

#### Summary
- **TEST CPU TRANSFORMS false** is 1.19x faster than **TEST CPU TRANSFORMS true**

#### DEV v2.1.5 /Users/cristianbanuelos/repos/p5.js.git/bench
- **test/bench/dave.bench.js (2) 15915ms**
  - **Dave bench test (2) 15905ms**
    - **TEST CPU TRANSFORMS true**: 0.7961 ops/sec ±4.86% (2 samples)
    - **TEST CPU TRANSFORMS false**: 0.9286 ops/sec ±36.88% (2 samples) _fastest_

#### Summary
- **TEST CPU TRANSFORMS false** is 1.17x faster than **TEST CPU TRANSFORMS true**

## With 1000 Elements
### test/bench/dave.bench.js (2) 151509ms
- **Dave bench test (2) 151505ms**
  - **TEST CPU TRANSFORMS true**: 0.0582 ops/sec ±0.00% (1 sample)
  - **TEST CPU TRANSFORMS false**: 0.0912 ops/sec ±0.00% (1 sample) _fastest_

#### Summary
- **TEST CPU TRANSFORMS false** is 1.57x faster than **TEST CPU TRANSFORMS true**

### 1000 Elements Second Run
#### test/bench/dave.bench.js (2) 150601ms
- **Dave bench test (2) 150597ms**
  - **TEST CPU TRANSFORMS true**: 0.0589 ops/sec ±0.00% (1 sample)
  - **TEST CPU TRANSFORMS false**: 0.0914 ops/sec ±0.00% (1 sample) _fastest_

#### Summary
- **TEST CPU TRANSFORMS false** is 1.55x faster than **TEST CPU TRANSFORMS true**
