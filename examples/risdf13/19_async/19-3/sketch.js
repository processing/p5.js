// You can load JSON from external sources that allow you
// free, public access to their data in JSON format.
//
// 1) Visit http://api.openweathermap.org/data/2.5/weather?q=boston in your browser.
// 2) Copy the resulting JSON data.
// 3) Visit http://jsonprettyprint.com
// 4) Paste the resulting data into the box and press 'Pretty Print JSON'.
// 5) This is some example, live JSON data of the weather in Boston.
//
// You can access this URL anytime to get live, updated weather data.
// Explanation of the API: http://bugs.openweathermap.org/projects/api/wiki/Weather_Data
//
// For example, to get the humidity %: main.humidity

var weather;
var bubbles = [];

var preload = function() {
  weather = loadJSON('http://api.openweathermap.org/data/2.5/weather?q=houston'); // try changing the city name! boston! miami!
}

var setup = function() {
  createCanvas(600, 400);
  noLoop();
  noStroke();

  // Get the loaded JSON data
  print(weather);                       // inspect the weather JSON
  var humidity = weather.main.humidity; // get the main.humidity out of the loaded JSON
  print(humidity);                      // inspect the humidity in the console

  background(40, 90, 200);
  fill(0, 255, 255, humidity);          // use the humidity value to set the alpha
  for(var i=0; i < 50; i++){
    ellipse(random(width), random(height), 30, 30);
  }
};