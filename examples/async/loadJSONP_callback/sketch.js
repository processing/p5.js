// This example gets weather for any city based on user input,
// using padded JSON (JSONP).
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
// For JSONP, we add a callback parameter to the loadJSON path:
// 
// loadJSON('http://api.com/data?q=myQuery&callback=myCallbackFunction')

var result;
var userInput;

function setup(){
  createCanvas(600,100);
  textSize(18);
  textAlign(CENTER);
  fill(0);

  // Using p5dom addon (linked via index.html) to get user input.
  p = createP('Enter City Name To Return Current Temperature');
  userInput = createInput('New York');
  button = createButton('submit');

  button.mousePressed(getWeather); //getWeather() is the callback.
}

function getWeather(){
  background(255);

  var cityName = userInput.value();
  var path = 'http://api.openweathermap.org/data/2.5/weather?q='+cityName+'&units=metric&callback=displayWeather'
  loadJSON(path, displayWeather); // displayWeather is the callback
}

function logResults(stuff) {
  console.log('got the stuff!!!');
  console.log(stuff);
}

// Callback: loadJSON calls this function when finished loading.
function displayWeather(result){
  print(result); // result is ready!

  var location = result.name;
  var currentTemp = result.main.temp;
  text('Current temperature in ' + location +' is ' + currentTemp +' celsius',width/2,height/2);
}