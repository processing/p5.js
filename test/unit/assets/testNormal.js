// Test normal shader that shifts every vertex to the right
getWorldInputs(inputs => {
  inputs.position.x += 10;
  return inputs;
});
