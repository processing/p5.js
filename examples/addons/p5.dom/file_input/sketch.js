// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// based on http://www.html5rocks.com/en/tutorials/file/dndfiles/

var fileSelect;

function setup() {
  noCanvas();
  fileSelect = createFileInput('multiple', gotFiles);
}

function gotFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var file = createDiv(f.name + ' ' + f.type + ' ' + f.size + ' bytes');
    if (f.isImage()) {
      var img = createImg(f.data);
      img.class('thumb');
    } else if (f.isText()) {
      createDiv(f.data);
    }
  }
}