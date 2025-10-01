import { visualTest } from '../visualTest';

visualTest('setViewport remaps the coordinate system', function(p5, screenshot) {
  p5.createCanvas(100, 100);
  p5.setViewport(-50, 50, -50, 50);
  p5.background(240);
  p5.stroke(0);
  p5.line(-50, 0, 50, 0);
  p5.line(0, -50, 0, 50);
  screenshot();
});