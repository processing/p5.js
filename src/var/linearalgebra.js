define(function(require) {

  return {

    // TODO: Replace with an optimized matrix-multiplication algorithm
    pMultiplyMatrix: function(m1, m2) {

      var result = [];
      var m1Length = m1.length;
      var m2Length = m2.length;
      var m10Length = m1[0].length;

      for(var j = 0; j < m2Length; j++) {
        result[j] = [];
        for(var k = 0; k < m10Length; k++) {
          var sum = 0;
          for(var i = 0; i < m1Length; i++) {
            sum += m1[i][k] * m2[j][i];
          }
          result[j].push(sum);
        }
      }
      return result;
    }

  };

});