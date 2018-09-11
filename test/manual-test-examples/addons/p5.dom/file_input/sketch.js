// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// based on http://www.html5rocks.com/en/tutorials/file/dndfiles/

let fileSelect;

function setup() {
  noCanvas();
  fileSelect = createFileInput(gotFile, 'multiple');
}

function gotFile(file) {
  const fileDiv = createDiv(
    file.name +
      ' ' +
      file.type +
      ' ' +
      file.subtype +
      ' ' +
      file.size +
      ' bytes'
  );
  if (file.type === 'image') {
    const img = createImg(file.data);
    img.class('thumb');
  } else if (file.type === 'text') {
    createDiv(file.data);
  }
}
