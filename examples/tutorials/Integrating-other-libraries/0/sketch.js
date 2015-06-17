// This shows an example of using the "Api example" code from
// http://buzz.jaysalvat.com/
//
// Steps to use the library:
// 1) Download the buzz.js file from http://buzz.jaysalvat.com/
// 2) Put sketch.js, buzz.js and index.html in the same folder
// 3) Link to buzz.js in the index.html up top
// 4) Use buzz.js code in your sketch.js file in setup function

// "Api example" from http://buzz.jaysalvat.com/
//
// var mySound = new buzz.sound( "/sounds/myfile", {
//     formats: [ "ogg", "mp3", "aac" ]
// });

// mySound.play()
//     .fadeIn()
//     .loop()
//     .bind( "timeupdate", function() {
//        var timer = buzz.toTimer( this.getTime() );
//        document.getElementById( "timer" ).innerHTML = timer;
//     });

var mySound = new buzz.sound("rhodes_loop.wav");

function setup() {
  mySound.play();
}

