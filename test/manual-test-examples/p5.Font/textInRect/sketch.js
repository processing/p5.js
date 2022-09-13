let xpos = 50;
let ypos = 100;
let str =
  'One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen Twenty Twenty-one Twenty-two Twenty-three Twenty-four Twenty-five Twenty-six Twenty-seven Twenty-eight Twenty-nine Thirty Thirty-one Thirty-two Thirty-three Thirty-four Thirty-five Thirty-six Thirty-seven Thirty-eight Thirty-nine Forty Forty-one Forty-two Forty-three Forty-four Forty-five Forty-six Forty-seven Forty-eight Forty-nine Fifty Fifty-one Fifty-two Fifty-three';

function setup() {
  createCanvas(1050, 800);
  background(245);

  let ta = textAscent();

  textAlign(CENTER, TOP);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200, 200);
  xpos += 250;

  textAlign(CENTER, CENTER);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200, 200);
  xpos += 250;

  textAlign(CENTER, BOTTOM);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200, 200);
  xpos += 250;

  textAlign(CENTER, BASELINE);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200, 200);

  textSize(18);
  textAlign(CENTER, TOP);
  text('TOP', 150, height / 2 - 40);
  text('CENTER', 400, height / 2 - 40);
  text('BOTTOM', 650, height / 2 - 40);
  text('BASELINE', 900, height / 2 - 40);
  textSize(12);

  xpos = 50;
  ypos += 400;

  textAlign(CENTER, TOP);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200);
  xpos += 250;

  textAlign(CENTER, CENTER);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200);
  xpos += 250;

  textAlign(CENTER, BOTTOM);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200);
  xpos += 250;

  textAlign(CENTER, BASELINE);
  rect(xpos, ypos, 200, 200);
  text(str, xpos, ypos, 200);

  textSize(18);
  textAlign(CENTER, TOP);
  text('TOP', 150, height / 2 - 40);
  text('CENTER', 400, height / 2 - 40);
  text('BOTTOM', 650, height / 2 - 40);
  text('BASELINE', 900, height / 2 - 40);
  text('TOP', 150, ypos + 270);
  text('CENTER', 400, ypos + 270);
  text('BOTTOM', 650, ypos + 270);
  text('BASELINE', 900, ypos + 270);

  fill(255);
  noStroke();
  textSize(24);

  rect(0, height / 2, width, 15);
  fill(0);
  textAlign(LEFT, TOP);
  text('text(s, x, y, w, h)', 20, 40);
  text('text(s, x, y, w) [no height]', 20, height / 2 + 40);
}
