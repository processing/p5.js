(function(exports) {
  exports.save = function() {
    window.open(PVariables.curElement.elt.toDataURL('image/png'));
  };
}(window));
