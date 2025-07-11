import p5 from "p5";

new p5((p) => {
  p.setup = () => {
    p.createCanvas(200, 200);
  };

  p.draw = () => {
    p.background(220);
    p.circle(100, 100, 80);
  };
});
