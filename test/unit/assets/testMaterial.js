// Test material shader that creates a gradient based on position
getPixelInputs((inputs) => {
  // Create a color gradient based on texture coordinates
  const red = inputs.texCoord.x;
  const green = inputs.texCoord.y;
  const blue = 0.5;
  inputs.color = [red, green, blue, 1.0];
  return inputs;
});