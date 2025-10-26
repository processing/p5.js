import { detectOutsideVariableReferences } from '../../../src/strands/strands_transpiler.js';
import { suite, test } from '../../../test/js/spec.js';

suite('Strands Transpiler - Outside Variable Detection', function() {
  test('should detect undeclared variable in uniform', function() {
    // Simulate code that references mouseX (not declared in strand context)
    const code = `
      const myUniform = uniform('color', () => {
        return mouseX; // mouseX is not declared
      });
    `;
    
    const errors = detectOutsideVariableReferences(code);
    assert.ok(errors.length > 0, 'Should detect at least one error');
    assert.ok(errors.some(e => e.variable === 'mouseX'), 'Should detect mouseX');
  });

  test('should not error when variable is declared', function() {
    // Variable is declared before use
    const code = `
      let myVar = 5;
      const myUniform = uniform('color', () => {
        return myVar; // myVar is declared
      });
    `;
    
    const errors = detectOutsideVariableReferences(code);
    assert.equal(errors.length, 0, 'Should not detect errors');
  });

  test('should detect multiple undeclared variables', function() {
    const code = `
      const myUniform = uniform('color', () => {
        return mouseX + windowWidth; // Both not declared
      });
    `;
    
    const errors = detectOutsideVariableReferences(code);
    assert.equal(errors.length, 2, 'Should detect both mouseX and windowWidth');
  });

  test('should handle empty code', function() {
    const errors = detectOutsideVariableReferences('');
    assert.equal(errors.length, 0, 'Empty code should have no errors');
  });
});
