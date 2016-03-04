var checkbox;
var testcheck;

function setup() {
  checkbox = createCheckbox('the label');
  checkbox.value('some value')

  // What should this be called??
  // it's wrapping 'onchange'
  checkbox.changed(myCheckedEvent); // even for when the user does something

  testcheck = select('#checktest');
  testcheck.changed(myCheckedEvent);
}

function draw() {
  background(0);
  // No argument return its state
  if (checkbox.checked()) {
    background(255, 0, 0);
  }
  if (testcheck.checked()) {
    background(255, 0, 255);
  }

}


function myCheckedEvent() {
  if (this.checked()) {
    console.log(this.value() + " is checked!");
  } else {
    console.log(this.value() + " is not checked!");
  }
}

