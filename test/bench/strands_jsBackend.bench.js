import { bench, describe } from 'vitest';
import p5 from '../../src/app';

const PARTICLE_COUNT = 100;
const options = { iterations: 20, time: 500 };

function makeParticles(instance) {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * instance.TWO_PI;
    const speed = 0.5 + (i % 16) / 10;
    return {
      position: instance.createVector(50, 50),
      velocity: instance.createVector(
        instance.cos(angle) * speed,
        instance.sin(angle) * speed
      )
    };
  });
}

function createInstance() {
  return new Promise(resolve => {
    new p5(p => {
      p.setup = () => {
        p.createCanvas(100, 100, p.WEBGL);
        p.noLoop();
        resolve(p);
      };
    });
  });
}

async function createBenchmarkState() {
  const previousFES = p5.disableFriendlyErrors;
  p5.disableFriendlyErrors = true;
  const instance = await createInstance();
  try {
    const particles = instance.createStorage(makeParticles(instance));
    const computeShader = instance.buildComputeShader(
      () => {
        const data = instance.uniformStorage(particles);
        const idx = instance.index.x;
        data[idx].position = data[idx].position + data[idx].velocity;
      },
      { instance, particles }
    );

    return {
      instance,
      computeShader,
      manualParticles: makeParticles(instance),
      previousFES
    };
  } catch (error) {
    instance.remove();
    p5.disableFriendlyErrors = previousFES;
    throw error;
  }
}

function disposeBenchmarkState(state) {
  state.instance.remove();
  p5.disableFriendlyErrors = state.previousFES;
}

describe('Strands CPU compute fallback', () => {
  let computeState;
  let loopState;

  bench(
    'lower and run Strands particle compute for 100 particles',
    () => {
      // Drop the cached compiled hook so each iteration also pays the
      // lowering cost, like the first compute() call in a sketch.
      computeState.computeShader._cpuComputeFn = null;
      computeState.instance.compute(
        computeState.computeShader,
        PARTICLE_COUNT
      );
    },
    {
      ...options,
      setup: async () => {
        computeState = await createBenchmarkState();
      },
      teardown: () => disposeBenchmarkState(computeState)
    }
  );

  bench(
    'run handwritten JavaScript particle loop for 100 particles',
    () => {
      for (let i = 0; i < loopState.manualParticles.length; i++) {
        loopState.manualParticles[i].position.add(
          loopState.manualParticles[i].velocity
        );
      }
    },
    {
      ...options,
      setup: async () => {
        loopState = await createBenchmarkState();
      },
      teardown: () => disposeBenchmarkState(loopState)
    }
  );
});
