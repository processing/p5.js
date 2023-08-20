var spriteSheet;

function setup() {
  createCanvas(600, 600);
  background(200);

  spriteSheet = loadImage('sprite_sheet.jpg', function() {
    // Full sprite sheet
    image(spriteSheet, 0, 0);

    // Alien guy
    image(spriteSheet, spriteSheet.width + 10, 0, 53, 75, 110, 0, 53, 75);

    // Fence
    image(spriteSheet, spriteSheet.width + 10, 80, 55, 55, 110, 132, 55, 55);

    // Water
    image(spriteSheet, spriteSheet.width + 10, 140, 55, 55, 164, 75, 55, 55);

    // Happy plant
    image(spriteSheet, spriteSheet.width + 10, 200, 40, 100, 220, 20, 40, 110);

    // Grass block
    image(spriteSheet, 0, spriteSheet.height + 10, 125, 125, 0, 75, 53, 53);

    // Three coins in a row
    var x = 70;
    for (var i = 0; i < 3; i++) {
      image(
        spriteSheet,
        (x += 75), spriteSheet.height + 10, 75, 75,
        67, 202, 30, 30
      );
    }
  });
}
