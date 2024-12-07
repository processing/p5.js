/**
 * Loads and returns a mapping of p5 constructor names to their corresponding
 * functions. This function iterates through all properties of the p5 object
 * identifying constructor functions (those starting with a capital letter) and
 * storing them in an object.
 * @returns {Object} An object mapping p5 constructor names to their functions.
 */
function loadP5Constructors(p5) {
  // Mapping names of p5 types to their constructor functions.
  // p5Constructors:
  //   - Color: f()
  //   - Graphics: f()
  //   - Vector: f()
  // and so on.
  const p5Constructors = {};

  // Make a list of all p5 classes to be used for argument validation
  // This must be done only when everything has loaded otherwise we get
  // an empty array
  for (let key of Object.keys(p5)) {
    // Get a list of all constructors in p5. They are functions whose names
    // start with a capital letter
    if (typeof p5[key] === 'function' && key[0] !== key[0].toLowerCase()) {
      p5Constructors[key] = p5[key];
    }
  }

  return p5Constructors;
}

export { loadP5Constructors };