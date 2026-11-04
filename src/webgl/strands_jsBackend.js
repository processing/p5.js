const CPU_COMPUTE_WARN_ITEMS = 4096;

export function runCpuCompute(shader, x, y=1, z=1) {
  const cpuIR = shader._cpuIR;
  if(!cpuIR){
    throw new Error(
      'Internal error: missing recorded program for the CPU compute fallback.'
    );
  }
  const total = x*y*z;
  if (!Number.isInteger(total) || total < 0) {
    throw new Error(`compute() counts must be non-negative integers. Got (${x}, ${y}, ${z}).`);
  }
  if (total > CPU_COMPUTE_WARN_ITEMS) {
    console.warn(
      `compute() dispatched ${total} iterations on the CPU fallback, which will be slow. ` +
        `Consider fewer items when running without WebGPU.`
    );
  }
}
