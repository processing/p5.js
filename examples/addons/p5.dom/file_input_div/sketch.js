// based on http://www.html5rocks.com/en/tutorials/file/dndfiles/

// When we get text we'll just make a paragraph element with the text
function process(text) {
  createP(text);
}

function setup() {

  noCanvas();
  // // Check for the various File API support.
  // if (window.File && window.FileReader && window.FileList && window.Blob) {
  //   console.log('Great success! All the File APIs are supported');
  // } else {
  //   alert('The File APIs are not fully supported in this browser.');
  // }

  // // <div id="drop_zone">Drop files here</div>
  // // Make a div to drag a file on
  var dropZone = createDiv('Drop files here');
  dropZone.id('drop_zone');

  dropZone.dragOver(function() {
    this.style('background','#AAAAAA');
  });

  dropZone.dragLeave(function() {
     // do nothing?
     console.log("LEAVING");
  });

  dropZone.drop(dropped, gotFile);

}

function dropped() {
  this.style('background','');
}

function gotFile(file) {
  var fileDiv = createDiv(file.name + ' ' + file.type + ' ' + file.subtype + ' ' + file.size + ' bytes');
  if (file.type === 'image') {
    var img = createImg(file.data);
    img.class('thumb');
  } else if (file.type === 'text') {
    createDiv(file.data);
  }
}