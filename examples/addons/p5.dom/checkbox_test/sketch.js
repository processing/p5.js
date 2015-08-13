var checkbox;

function setup() {
  checkbox = createCheckbox('the label');
  checkbox.value('test');
  //checkbox.checked(true); // passing in an arg sets its state?

  // What should this be called??
  // it's wrapping 'onchange'
  // checkbox.changed(myCheckedEvent); // even for when the user does something
}

function draw() {
  background(0);
  // No argument return its state
  if (checkbox.checked()) {
    background(255, 0, 0);

  }
}

// function myCheckedEvent() {
//   if (this.checked) {
//     console.log("It's checked!");
//   } else {
//     console.log("It's not checked!");
//   }
// }

