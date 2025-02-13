/**
 * @module 3D
 * @submodule ShaderGenerator
 * @for p5
 * @requires core
 */

function shadergen(p5, fn) {
    const oldModify = p5.Shader.prototype.modify
    p5.Shader.prototype.modify = function(arg) {
      if (arg instanceof Function) {
        // const program = new ShaderProgram(arg)
        // const newArg = program.run()
        return oldModify.call(this, arg)
      } else {
        return oldModify.call(this, arg)
      }
    }
  }
  
  if (typeof p5 !== 'undefined') {
    p5.registerAddon(shadergen)
}

export default shadergen;