// Example: saveStrings
function setup() {
  const words = 'apple bear cat dog';

  // split outputs an array
  const list = split(words, ' ');

  // Writes the strings to a file, each on a separate line
  save(list, 'nouns.txt');
}
