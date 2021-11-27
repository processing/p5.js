function setup() {
  // Created a dropdown in DOM
  var dropdown = createSelect();
  dropdown.option('apple');
  dropdown.option('mango');
  dropdown.id('fruitlist');
  console.log(dropdown);

  // Selected a dropdown from DOM
  dropdown = select('#fruitlist');
  dropdown.option('applex');
  dropdown.option('mangox');
  console.log(dropdown);
}
