var sel;

function setup() {
  var dropdown = createSelect();
    dropdown.option('apple');
    dropdown.option('mango');
    dropdown.id("fruitlist");
  console.log( dropdown ); 

  var dropdown = select('#fruitlist');
    dropdown.option('applex');
    dropdown.option('mangox');
  console.log( dropdown );

}

function draw() {
  
}

