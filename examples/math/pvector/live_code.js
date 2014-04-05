/**
 * Super-ultra-simple live editor.
 * 
 * Note: this is totally unsafe: never use this for production.
 */
function liveCode() {
  var sketchDiv = document.getElementById('sketch');
  var editor = ace.edit("editor");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().on('change', function(e) {
    runSketch();
  });
  runSketch();

  function runSketch() {
    // Remove the old canvas
    var canvas = sketchDiv.getElementsByTagName('canvas');
    if (canvas.length) { 
      for (var i=0;i<canvas.length;i++) {
        canvas[i].parentNode.removeChild(canvas[i]);
      }
    }
    
    // Get code from the editor
    var code = editor.getValue();
    
    // Build the sketch function
    var sketch = function() {
      try {
        eval(code);
      } catch (err) {
        console.log("Error: " + err.message + "\n");
      }
    };
    try {
      p5(sketch, sketchDiv);
    } catch (err) {
      console.log("Error: " + err.message + "\n");
    }
  }

  // Update the editor on window resize
  window.onresize = function() {
    editor.resize();
  };
}


window.onload = function() {
  liveCode();
};


