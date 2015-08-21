var checkbox;

function setup() {
  checkbox = createCheckbox('the label');
  checkbox.value('some value')

  // What should this be called??
  // it's wrapping 'onchange'
  checkbox.changed(myCheckedEvent); // even for when the user does something
}

function mousePressed() {
  console.log(checkbox.value());
}

function draw() {
  background(0);
  // No argument return its state
  if (checkbox.checked()) {
    background(255, 0, 0);
  }
}

function mousePressed() {
  println(checkbox.value());
}

function myCheckedEvent() {
  console.log('changed');

  if (this.checked) {
    console.log("It's checked!");
  } else {
    console.log("It's not checked!");
  }
}

