// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// based on http://www.html5rocks.com/en/tutorials/file/dndfiles/

var fileSelect;

function setup() {
  noCanvas();
  fileSelect = createFileInput(gotFile, 'multiple');
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