let data;

async function setup() {
  createCanvas(100, 100); // Create a canvas
  data = await loadBytes('mammals.xml'); // Load the bytes from the XML file

  background(255); // Set a white background
  fill(0);       // Set text color to black

  // Display the first 5 byte values on the canvas in hexadecimal format
  for (let i = 0; i < 5; i++) {
    let byteHex = data[i].toString(16);
    text(byteHex, 10, 18 * (i + 1)); // Adjust spacing as needed
  }
  
  describe('no image displayed');
}
