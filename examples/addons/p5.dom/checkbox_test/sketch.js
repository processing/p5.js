var checkbox;

function setup() {
  checkbox = createCheckbox('the label');
  checkbox.value('some value')

  // What should this be called??
  // it's wrapping 'onchange'
  checkbox.changed(myCheckedEvent); // even for when the user does something
}

function draw() {
  background(0);
  // No argument return its state
  if (checkbox.checked()) {
    background(255, 0, 0);
  }
}


function myCheckedEvent() {
  if (this.checked()) {
    console.log(checkbox.value() + " is checked!");
  } else {
    console.log(checkbox.value() + " is not checked!");
  }
}

