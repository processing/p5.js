// Example: saveStrings
function setup() {
  var words = 'apple bear cat dog';

  // split outputs an array
  var list = split(words, ' ');

  // Writes the strings to a file, each on a separate line
  save(list, 'nouns.txt');
}
