var dropdown;

function setup() {
  dropdown = createSelect(); // or create dropdown?
  dropdown.option('apple','1');
  dropdown.option('orange','2');
  //dropdown.option('pear', 'pear');
  dropdown.option('pear');

  dropdown.value('2');

  dropdown.changed(mySelectEvent);
}

function mousePressed() {
  println(dropdown.value());
}

function draw() {
  background(0);
  if (dropdown.value() === 'pear') {
    background(0, 255, 0);
  }
}

function mySelectEvent() {
  var selected = this.selected();
  if (selected === 'pear') {
    console.log("it's a pear!");
  }
}

