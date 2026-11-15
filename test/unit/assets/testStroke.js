// Test stroke shader that makes strokes three times as thick
getWorldInputs(inputs => {
  inputs.weight *= 3;
  return inputs;
});
