var dropdown;

function setup() {
  dropdown = createDropdown(); // or create dropdown?
  dropdown.option('apple','1');
  dropdown.option('orange','2');
  dropdown.option('pear', '3');
  //dropdown.value(3);

  //dropdown.changed(mySelectEvent);
}

function mousePressed() {
  dropdown.value()
}

function draw() {
  background(0);
  if (dropdown.value() === '3') {
    background(0,255,0);
  }
}

function mySelectEvent() {
  var selected = this.selected();
  if (selected === 'pear') {
    console.log("it's a pear!");
  }
}

