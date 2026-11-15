// Test color shader that swaps the red and green channels
getFinalColor(color => {
  return [color.g, color.r, color.b, color.a];
});
