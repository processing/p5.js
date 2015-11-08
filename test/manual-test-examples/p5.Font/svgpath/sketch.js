function setup() {

  var canvas = createCanvas(200, 150).canvas;

  loadFont('../SourceSansPro-Regular.otf', function(font) {

    // render text with opentype font
    textAlign(RIGHT);
    textFont(font, 32);
    text('Text Path', 190, 60);

    // converted path to canvas Path2D then render
    var pathStr = font._getPathData('Path Data', 190, 90);
    var cPath = new Path2D(pathStr);
    canvas.getContext('2d').fill(cPath);

    // not displayed, just print <path> tag in console
    var pathTag = font._getSVG('SVG', 190, 120, {
      decimals: 4,
      fill: 'red',
      strokeWidth: 2,
      stroke: 'green'
    });
    console.log(pathTag);

    // hit detection for canvas Path2D (cursor changes)
    canvas.onmousemove = function(e) {

      var context = e.target.getContext('2d');
      var coordX = e.offsetX;
      var coordY = e.offsetY;

      // Test the square for clicks
      if (context.isPointInPath(cPath, coordX, coordY)) {
        e.target.style.cursor = 'pointer';
        return;
      }

      // Reset the pointer to the default
      e.target.style.cursor = 'default';
    }
  });
}
