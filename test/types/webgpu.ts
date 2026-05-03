import p5 from '../../types/global'

async function setup() {
  const renderer: p5.Renderer = await createCanvas(100, 100, WEBGPU);
  background(0);
  fill(255);
  noStroke();
  circle(0, 0, 50);
}
