// Setup chai
var expect = chai.expect;
var assert = chai.assert;

assert.arrayApproximately = function(arr1, arr2, delta) {
  assert.equal(arr1.length, arr2.length);
  for(var i = 0; i < arr1.length; i++) {
    assert.approximately(arr1[i], arr2[i], delta);
  }
}
