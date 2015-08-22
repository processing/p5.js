var dropdown;

function setup() {
  dropdown = createSelect(); // or create dropdown?

  // just mucking around
  dropdown.option('apple','1');
  dropdown.option('orange','2');
  dropdown.option('pear');

  // Set what it starts as
  dropdown.value('2');

  dropdown.changed(mySelectEvent);
}

function draw() {
  background(0);
  if (dropdown.selected() === '1') {
    background(255, 0, 0);
  }
}

function mySelectEvent() {
  var selected = this.selected();
  if (selected === 'pear') {
    console.log("it's a pear!");
  }
}

