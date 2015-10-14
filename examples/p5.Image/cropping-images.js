var spriteSheet;

function setup() {
  createCanvas(600, 600);
  background(200);

  spriteSheet = loadImage('sprite_sheet.jpg', function () {
    // Full sprite sheet
    image(spriteSheet, 0, 0);

    // Alien guy
    image(spriteSheet, 110, 0, 53, 75, spriteSheet.width + 10, 0, 53, 75);

    // Fence
    image(spriteSheet, 110, 132, 55, 55, spriteSheet.width + 10, 80, 55, 55);

    // Water
    image(spriteSheet, 164, 75, 55, 55, spriteSheet.width + 10, 140, 55, 55);

    // Happy plant
    image(spriteSheet, 220, 20, 40, 110, spriteSheet.width + 10, 200, 40, 100);

    // Grass block
    image(spriteSheet, 0, 75, 53, 53, 0, spriteSheet.height + 10, 125, 125);

    // Three coins in a row
    var x = 70;
    for (var i = 0; i < 3; i++) {
      image(spriteSheet,
        67, 202, 30, 30, x += 75, spriteSheet.height + 10, 75, 75);
    }
  });
}
