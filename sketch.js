/**
 * The enable method enables an option that is initally disabled in the dropdown menu
 * Use first example from https://p5js.org/reference/#/p5/createSelect to demonstrate how enable method works
 */

let sel;

function setup() {
  textAlign(CENTER);
  background(200);
  sel = createSelect();
  sel.position(10, 10);
  sel.option('pear');
  sel.option('kiwi');
  sel.option('grape');
  sel.selected('kiwi');
  sel.changed(mySelectEvent);
}

function mySelectEvent() {
  let item = sel.value();
  background(200);
  text('It is a ' + item + '!', 50, 50);
}

function toggleSelect(){
  sel.disable('pear');
  debugger
}

function toggleSelectEnable(){
  sel.enable();
  debugger
}