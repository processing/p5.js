/* eslint-disable no-unused-vars */

// let saving = false;
// function setup() {
//   // put setup code here
//   createCanvas(500, 500);
// }

// function draw() {
//   // put drawing code here
//   let hue = map(sin(frameCount), -1, 1, 127, 255);
//   let hue_2 = map(sin(frameCount / 100) + 0.791, -1, 1, 127, 255);

//   strokeWeight(0);
//   line(width / 2, 0, width / 2, height);
//   line(0, height / 2, width, height / 2);

//   fill(250, 250, 20);
//   rect(0, 0, width / 2, height / 2);

//   //   fill(80, 80, hue);
//   rect(width / 2, 0, width / 2, height / 2);

//   fill(20, 250, 250);
//   rect(0, height / 2, width / 2, height / 2);

//   //   fill(240, 240, 0);
//   rect(width / 2, height / 2, width / 2, height / 2);

//   fill(30);
//   stroke(20, 250, 20);
//   strokeWeight(4);
//   circle(
//     100 * sin(frameCount / 20) + width / 2,
//     // 100 * sin(frameCount / 20) + height / 2,
//     // width / 2,
//     height / 2,
//     100
//   );

//   if (saving) {
//     save('frame' + frameCount.toString());
//   }
// }

// function mousePressed() {
//   if (mouseButton === RIGHT) {
//     saveGif('mySketch', 1, 3);
//   }
// }

// function keyPressed() {
//   switch (key) {
//     case 's':
//       frameRate(3);
//       frameCount = 0;
//       saving = !saving;

//       if (!saving) frameRate(60);
//       break;
//   }
// }

// / COMPLEX SKETCH
let offset;
let spacing;

function setup() {
  //   randomSeed(1312);

  w = min(windowHeight, windowWidth);
  createCanvas(w, w);
  print(w);
  looping = false;
  saving = false;
  noLoop();

  divisor = random(1.2, 3).toFixed(2);

  frameWidth = w / divisor;
  offset = (-frameWidth + w) / 2;

  gen_num_total_squares = int(random(2, 20));
  spacing = frameWidth / gen_num_total_squares;

  initHue = random(0, 360);
  compColor = (initHue + 360 / random(1, 4)) % 360;

  gen_stroke_weight = random(-100, 100);
  gen_stroke_fade_speed = random(30, 150);
  gen_shift_small_squares = random(0, 10);

  gen_offset_small_sq_i = random(3, 10);
  gen_offset_small_sq_j = random(3, 10);

  gen_rotation_speed = random(30, 250);

  gen_depth = random(5, 20);
  gen_offset_i = random(1, 10);
  gen_offset_j = random(1, 10);

  gen_transparency = random(20, 255);

  background(24);
}

function draw() {
  colorMode(HSB);
  background(initHue, 80, 20, gen_transparency);
  makeSquares();
  //   addHandle();

  if (saving) save('grid' + frameCount + '.png');
}

function makeSquares(depth = gen_depth) {
  colorMode(HSB);
  let count_i = 0;

  for (let i = offset; i < w - offset; i += spacing) {
    let count_j = 0;
    count_i++;

    if (count_i > gen_num_total_squares) break;

    for (let j = offset; j < w - offset; j += spacing) {
      count_j++;

      if (count_j > gen_num_total_squares) break;

      for (let n = 0; n < depth; n++) {
        noFill();

        if (n === 0) {
          stroke(initHue, 100, 100);
          fill(
            initHue,
            100,
            100,
            map(
              sin(
                gen_stroke_weight * (i + j) + frameCount / gen_stroke_fade_speed
              ),
              -1,
              1,
              0,
              0.3
            )
          );
        } else {
          stroke(compColor, map(n, 0, depth, 100, 0), 100);
          fill(
            compColor,
            100,
            100,
            map(
              cos(
                gen_stroke_weight * (i + j) + frameCount / gen_stroke_fade_speed
              ),
              -1,
              1,
              0,
              0.3
            )
          );
        }

        strokeWeight(
          map(
            sin(
              gen_stroke_weight * (i + j) + frameCount / gen_stroke_fade_speed
            ),
            -1,
            1,
            0,
            1.5
          )
        );

        push();
        translate(i + spacing / 2, j + spacing / 2);

        rotate(
          i * gen_offset_i +
            j * gen_offset_j +
            frameCount / (gen_rotation_speed / (n + 1))
        );

        if (n % 2 !== 0) {
          translate(
            sin(frameCount / 50) * gen_shift_small_squares,
            cos(frameCount / 50) * gen_shift_small_squares
          );
          rotate(i * gen_offset_i + j * gen_offset_j + frameCount / 100);
        }

        if (n > 0)
          rect(
            -spacing / (gen_offset_small_sq_i + n),
            -spacing / (gen_offset_small_sq_j + n),
            spacing / (n + 1),
            spacing / (n + 1)
          );
        else rect(-spacing / 2, -spacing / 2, spacing, spacing);

        pop();
      }
      //   strokeWeight(40);
      //   point(i, j);
    }
  }
}

function addHandle() {
  fill(40);
  noStroke();
  textAlign(RIGHT, BOTTOM);
  textFont(font);
  textSize(20);
  text('@jesi_rgb', w - 30, w - 30);
}

function mousePressed() {
  if (mouseButton === LEFT) {
    if (looping) {
      noLoop();
      looping = false;
    } else {
      loop();
      looping = true;
    }
  }
}

function keyPressed() {
  console.log(key);
  switch (key) {
    // pressing the 's' key
    case 's':
      saveGif('mySketch', 1);
      break;

    // pressing the '0' key
    case '0':
      frameCount = 0;
      loop();
      noLoop();
      break;

    // pressing the ← key
    case 'ArrowLeft':
      frameCount >= 0 ? (frameCount -= 1) : (frameCount = 0);
      noLoop();
      console.log(frameCount);
      break;

    // pressing the → key
    case 'ArrowRights':
      frameCount += 1;
      noLoop();
      console.log(frameCount);
      break;

    default:
      break;
  }
}
