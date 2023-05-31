// Catch class

class Catcher {
  constructor(tempR) {
    this.r = tempR; // radius
    this.x = 0; // location
    this.y = 0;
  }
  setLocation(tempX, tempY) {
    this.x = tempX;
    this.y = tempY;
  }
  display() {
    stroke(0);
    fill(175);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
