// This example gets weather for any city based on user input.
//
// We'll use loadJSON() to get weather data from the API at
// openweather.org.
//
// The results will not be available immediately. Just like when
// you point your browser to a URL, it takes a moment to load. So
// at the moment loadJSON is called, our 'result' will be empty.
//
// A callback is the name of a function that handles our data
// when it is ready.
//
// We'll add a callback as the 2nd parameter to loadJSON, like this:
//
// loadJSON(url, callback)

let result;
let userInput;

function setup() {
  createCanvas(600, 100);
  textSize(18);
  textAlign(CENTER);
  fill(0);

  // Using p5dom addon (linked via index.html) to get user input.
  p = createP('Enter City Name To Return Current Temperature');
  userInput = createInput('New York');
  button = createButton('submit');

  button.mousePressed(getWeather); //getWeather() is the callback.
}

function getWeather() {
  background(255);

  const cityName = userInput.value();
  const URL =
    'http://api.openweathermap.org/data/2.5/weather?q=' +
    cityName +
    '&units=metric';
  result = loadJSON(URL, displayWeather); // displayWeather is the callback
}

// Callback: loadJSON calls this function when finished loading.
function displayWeather() {
  print(result); // result is ready!

  const location = result.name;
  const currentTemp = result.main.temp;
  text(
    'Current temperature in ' + location + ' is ' + currentTemp + ' celsius',
    width / 2,
    height / 2
  );
}
