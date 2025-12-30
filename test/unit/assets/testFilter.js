// Test filter shader that inverts red and green channels
getColor((inputs, canvasContent) => {
  const originalColor = getTexture(canvasContent, inputs.texCoord);
  // Swap red and green channels, keep blue and alpha
  return [originalColor.g, originalColor.r, originalColor.b, originalColor.a];
});