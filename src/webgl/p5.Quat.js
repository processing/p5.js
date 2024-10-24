/**
 * @module Math
 * @submodule Quaternion
 */

import { Vector } from '../math/p5.Vector';

class Quat {
  constructor(w, x, y, z) {
    this.w = w;
    this.vec = new Vector(x, y, z);
  }

  /**
     * Returns a Quaternion for the
     * axis angle representation of the rotation
     *
     * @method fromAxisAngle
     * @param {Number} [angle] Angle with which the points needs to be rotated
     * @param {Number} [x] x component of the axis vector
     * @param {Number} [y] y component of the axis vector
     * @param {Number} [z] z component of the axis vector
     * @chainable
    */
  static fromAxisAngle(angle, x, y, z) {
    const w = Math.cos(angle/2);
    const vec = new Vector(x, y, z).normalize().mult(Math.sin(angle/2));
    return new Quat(w, vec.x, vec.y, vec.z);
  }

  conjugate() {
    return new Quat(this.w, -this.vec.x, -this.vec.y, -this.vec.z);
  }

  /**
     * Multiplies a quaternion with other quaternion.
     * @method mult
     * @param  {p5.Quat} [quat] quaternion to multiply with the quaternion calling the method.
     * @chainable
     */
  multiply(quat) {
    /* eslint-disable max-len */
    return new Quat(
      this.w * quat.w - this.vec.x * quat.vec.x - this.vec.y * quat.vec.y - this.vec.z - quat.vec.z,
      this.w * quat.vec.x + this.vec.x * quat.w + this.vec.y * quat.vec.z - this.vec.z * quat.vec.y,
      this.w * quat.vec.y - this.vec.x * quat.vec.z + this.vec.y * quat.w + this.vec.z * quat.vec.x,
      this.w * quat.vec.z + this.vec.x * quat.vec.y - this.vec.y * quat.vec.x + this.vec.z * quat.w
    );
    /* eslint-enable max-len */
  }

  /**
   * This is similar to quaternion multiplication
   * but when multipying vector with quaternion
   * the multiplication can be simplified to the below formula.
   * This was taken from the below stackexchange link
   * https://gamedev.stackexchange.com/questions/28395/rotating-vector3-by-a-quaternion/50545#50545
   * @param {p5.Vector} [p] vector to rotate on the axis quaternion
   */
  rotateVector(p) {
    return Vector.mult( p, this.w*this.w - this.vec.dot(this.vec) )
      .add( Vector.mult( this.vec, 2 * p.dot(this.vec) ) )
      .add( Vector.mult( this.vec, 2 * this.w ).cross( p ) )
      .clampToZero();
  }

  /**
     * Rotates the Quaternion by the quaternion passed
     * which contains the axis of roation and angle of rotation
     *
     * @method rotateBy
     * @param {p5.Quat} [axesQuat] axis quaternion which contains
     *  the axis of rotation and angle of rotation
     * @chainable
     */
  rotateBy(axesQuat) {
    return axesQuat.multiply(this).multiply(axesQuat.conjugate()).
      vec.clampToZero();
  }
}

function quat(p5, fn){
  /**
   * A class to describe a Quaternion
   * for vector rotations in the p5js webgl renderer.
   * Please refer the following link for details on the implementation
   * https://danceswithcode.net/engineeringnotes/quaternions/quaternions.html
   * @class p5.Quat
   * @constructor
   * @param {Number} [w] Scalar part of the quaternion
   * @param {Number} [x] x component of imaginary part of quaternion
   * @param {Number} [y] y component of imaginary part of quaternion
   * @param {Number} [z] z component of imaginary part of quaternion
   * @private
   */
  p5.Quat = Quat;
}

export default quat;
export { Quat };

if(typeof p5 !== 'undefined'){
  quat(p5, p5.prototype);
}
