var radio;

function setup() {
  radio = createRadio();
  radio.id('test');
  //radio = createSelect(); // for comparison

  // The first is the value; the second is the optional label
  radio.option('apple', '1');
  radio.option('orange', '2');
  radio.option('pear');

  // Set what it starts as
  radio.selected('orange');

  radio.changed(mySelectEvent);
}

function draw() {
  background(0);
  if (radio.selected() === '1') {
    background(255, 0, 0);
  }
}

function mySelectEvent() {
  var selected = this.selected().value;
  console.log(this.value());
  if (selected === 'pear') {
    console.log("it's a pear!");
  }
}
