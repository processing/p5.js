import { detectOutsideVariableReferences } from '../../../src/strands/strands_transpiler.js';

suite('Strands Transpiler - Outside Variable Detection', function() {
  test('should allow outer scope variables in uniform callbacks', function() {
    // OK: mouseX in uniform callback is allowed
    const code = `
      const myUniform = uniformFloat(() => mouseX);
      getWorldPosition((inputs) => {
        inputs.position.x += myUniform;
        return inputs;
      });
    `;
    
    const errors = detectOutsideVariableReferences(code);
    assert.equal(errors.length, 0, 'Should not error - mouseX is OK in uniform callback');
  });

  test('should detect undeclared variable in strand code', function() {
    // ERROR: mouseX in strand code is not declared
    const code = `
      getWorldPosition((inputs) => {
        inputs.position.x += mouseX; // mouseX not declared in strand!
        return inputs;
      });
    `;
    
    const errors = detectOutsideVariableReferences(code);
    assert.ok(errors.length > 0, 'Should detect error');
    assert.ok(errors.some(e => e.variable === 'mouseX'), 'Should detect mouseX');
  });

  test('should not error when variable is declared', function() {
    const code = `
      let myVar = 5;
      getWorldPosition((inputs) => {
        inputs.position.x += myVar; // myVar is declared
        return inputs;
      });
    `;
    
    const errors = detectOutsideVariableReferences(code);
    assert.equal(errors.length, 0, 'Should not detect errors');
  });

  test('should handle empty code', function() {
    const errors = detectOutsideVariableReferences('');
    assert.equal(errors.length, 0, 'Empty code should have no errors');
  });
});
