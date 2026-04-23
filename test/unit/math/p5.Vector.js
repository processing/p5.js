import vector from '../../../src/math/p5.Vector.js';
import { vi } from 'vitest';

suite('p5.Vector', function () {
  var v;

  const mockP5 = {
    _validateParameters: vi.fn(),
    _friendlyError: vi.fn()
  };
  const mockP5Prototype = {};

  beforeEach(async function () {
    vector(mockP5, mockP5Prototype);
  });

  afterEach(function () {});

  suite.todo('p5.prototype.setHeading() RADIANS', function () {
    beforeEach(function () {
      mockP5Prototype.angleMode(mockP5.RADIANS);
      v = mockP5Prototype.createVector(1, 1);
      v.setHeading(1);
    });
    test('should have heading() value of 1 (RADIANS)', function () {
      assert.closeTo(v.heading(), 1, 0.001);
    });
  });

  suite.todo('p5.prototype.setHeading() DEGREES', function () {
    beforeEach(function () {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      v = mockP5Prototype.createVector(1, 1);
      v.setHeading(1);
    });
    test('should have heading() value of 1 (DEGREES)', function () {
      assert.closeTo(v.heading(), 1, 0.001);
    });
  });

  // NOTE: test this in a separate file or move `createVector` to p5.Vector file
  // Prefer latter
  suite.todo('p5.prototype.createVector()', function () {
    beforeEach(function () {
      v = mockP5Prototype.createVector();
    });
    test('should create instance of p5.Vector', function () {
      assert.instanceOf(v, mockP5.Vector);
    });

    test('should have x, y, z be initialized to 0', function () {
      assert.equal(v.x, 0);
      assert.equal(v.y, 0);
      assert.equal(v.z, 0);
    });

    test('should have dimensions initialized to 2', function () {
      assert.equal(v.dimensions, 2);
    });
  });

  suite.todo('p5.prototype.createVector(1, 2, 3)', function () {
    beforeEach(function () {
      v = mockP5Prototype.createVector(1, 2, 3);
    });

    test('should have x, y, z be initialized to 1,2,3', function () {
      assert.equal(v.x, 1);
      assert.equal(v.y, 2);
      assert.equal(v.z, 3);
    });

    test('should have dimensions initialized to 3', function () {
      assert.equal(v.dimensions, 3);
    });
  });

  suite('new p5.Vector()', function () {
    beforeEach(function () {
      v = new mockP5.Vector();
    });
    test('should set constant to DEGREES', function () {
      assert.instanceOf(v, mockP5.Vector);
    });

    test('should have x, y, z be initialized to 0', function () {
      assert.equal(v.x, 0);
      assert.equal(v.y, 0);
      assert.equal(v.z, 0);
    });
  });

  suite('new p5.Vector(1, 2, 3)', function () {
    beforeEach(function () {
      v = new mockP5.Vector(1, 2, 3);
    });

    test('should have x, y, z be initialized to 1,2,3', function () {
      assert.equal(v.x, 1);
      assert.equal(v.y, 2);
      assert.equal(v.z, 3);
    });
  });

  suite('new p5.Vector(1,2,undefined)', function () {
    beforeEach(function () {
      v = new mockP5.Vector(1, 2, undefined);
    });

    test('should have x, y, z be initialized to 1,2,0', function () {
      assert.equal(v.x, 1);
      assert.equal(v.y, 2);
      assert.equal(v.z, 0);
    });
  });

  suite('rotate', function () {
    suite('p5.Vector.prototype.rotate() [INSTANCE]', function () {
      test('should return the same object', function () {
        v = new mockP5.Vector(0, 1);
        expect(v.rotate(Math.PI)).to.eql(v);
      });

      suite.todo('radians', function () {
        beforeEach(function () {
          mockP5Prototype.angleMode(mockP5.RADIANS);
        });

        test('should rotate the vector [0, 1, 0] by pi radians to [0, -1, 0]', function () {
          v = mockP5Prototype.createVector(0, 1, 0);
          v.rotate(Math.PI);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });

        test('should rotate the vector [1, 0, 0] by -pi/2 radians to [0, -1, 0]', function () {
          v = mockP5Prototype.createVector(1, 0, 0);
          v.rotate(-Math.PI / 2);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });

        test('should rotate the vector [1, 0, 0] by pi radians to [-1, 0, 0]', function () {
          v = mockP5Prototype.createVector(1, 0, 0);
          v.rotate(Math.PI);
          expect(v.x).to.be.closeTo(-1, 0.01);
          expect(v.y).to.be.closeTo(0, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });
      });

      suite.todo('degrees', function () {
        beforeEach(function () {
          mockP5Prototype.angleMode(mockP5.DEGREES);
        });

        test('should rotate the vector [0, 1, 0] by 180 degrees to [0, -1, 0]', function () {
          v = mockP5Prototype.createVector(0, 1, 0);
          v.rotate(180);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });

        test('should rotate the vector [1, 0, 0] by -90 degrees to [0, -1, 0]', function () {
          v = mockP5Prototype.createVector(1, 0, 0);
          v.rotate(-90);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });
      });
    });

    suite.todo('p5.Vector.rotate() [CLASS]', function () {
      beforeEach(function () {
        mockP5Prototype.angleMode(mockP5.RADIANS);
      });

      test('should not change the original object', function () {
        v = mockP5Prototype.createVector(1, 0, 0);
        mockP5.Vector.rotate(v, Math.PI / 2);
        expect(v.x).to.equal(1);
        expect(v.y).to.equal(0);
        expect(v.z).to.equal(0);
      });

      test('should rotate the vector [0, 1, 0] by pi radians to [0, -1, 0]', function () {
        v = mockP5Prototype.createVector(0, 1, 0);
        const v1 = mockP5.Vector.rotate(v, Math.PI);
        expect(v1.x).to.be.closeTo(0, 0.01);
        expect(v1.y).to.be.closeTo(-1, 0.01);
        expect(v1.z).to.be.closeTo(0, 0.01);
      });

      test('should rotate the vector [1, 0, 0] by -pi/2 radians to [0, -1, 0]', function () {
        v = mockP5Prototype.createVector(1, 0, 0);
        const v1 = mockP5.Vector.rotate(v, -Math.PI / 2);
        expect(v1.x).to.be.closeTo(0, 0.01);
        expect(v1.y).to.be.closeTo(-1, 0.01);
        expect(v1.z).to.be.closeTo(0, 0.01);
      });
    });
  });

  suite('angleBetween', function () {
    let v1, v2;
    beforeEach(function () {
      v1 = new mockP5.Vector(1, 0, 0);
      v2 = new mockP5.Vector(2, 2, 0);
    });

    suite('p5.Vector.prototype.angleBetween() [INSTANCE]', function () {
      test('should return a Number', function () {
        const res = v1.angleBetween(v2);
        expect(typeof res).to.eql('number');
      });

      test('should not trip on rounding issues in 2D space', function () {
        v1 = new mockP5.Vector(-11, -20);
        v2 = new mockP5.Vector(-5.5, -10);
        const v3 = new mockP5.Vector(5.5, 10);

        expect(v1.angleBetween(v2)).to.be.closeTo(0, 0.00001);
        expect(v1.angleBetween(v3)).to.be.closeTo(Math.PI, 0.00001);
      });

      test('should not trip on rounding issues in 3D space', function () {
        v1 = new mockP5.Vector(1, 1.1, 1.2);
        v2 = new mockP5.Vector(2, 2.2, 2.4);
        expect(v1.angleBetween(v2)).to.be.closeTo(0, 0.00001);
      });

      test('should return NaN for zero vector', function () {
        v1 = new mockP5.Vector(0, 0, 0);
        v2 = new mockP5.Vector(2, 3, 4);
        expect(v1.angleBetween(v2)).to.be.NaN;
        expect(v2.angleBetween(v1)).to.be.NaN;
      });

      test.todo('between [1,0,0] and [1,0,0] should be 0 degrees', function () {
        mockP5Prototype.angleMode(mockP5.DEGREES);
        v1 = new mockP5.Vector(1, 0, 0);
        v2 = new mockP5.Vector(1, 0, 0);
        expect(v1.angleBetween(v2)).to.equal(0);
      });

      test.todo(
        'between [0,3,0] and [0,-3,0] should be 180 degrees',
        function () {
          mockP5Prototype.angleMode(mockP5.DEGREES);
          v1 = new mockP5.Vector(0, 3, 0);
          v2 = new mockP5.Vector(0, -3, 0);
          expect(v1.angleBetween(v2)).to.be.closeTo(180, 0.01);
        }
      );

      test('between [1,0,0] and [2,2,0] should be 1/4 PI radians', function () {
        v1 = new mockP5.Vector(1, 0, 0);
        v2 = new mockP5.Vector(2, 2, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(Math.PI / 4, 0.01);
        expect(v2.angleBetween(v1)).to.be.closeTo((-1 * Math.PI) / 4, 0.01);
      });

      test('between [2,0,0] and [-2,0,0] should be PI radians', function () {
        v1 = new mockP5.Vector(2, 0, 0);
        v2 = new mockP5.Vector(-2, 0, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(Math.PI, 0.01);
      });

      test('between [2,0,0] and [-2,-2,0] should be -3/4 PI radians  ', function () {
        v1 = new mockP5.Vector(2, 0, 0);
        v2 = new mockP5.Vector(-2, -2, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(
          -1 * (Math.PI / 2 + Math.PI / 4),
          0.01
        );
      });

      test('between [-2,-2,0] and [2,0,0] should be 3/4 PI radians', function () {
        v1 = new mockP5.Vector(-2, -2, 0);
        v2 = new mockP5.Vector(2, 0, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(
          Math.PI / 2 + Math.PI / 4,
          0.01
        );
      });

      test('For the same vectors, the angle between them should always be 0.', function () {
        v1 = new mockP5.Vector(288, 814);
        v2 = new mockP5.Vector(288, 814);
        expect(v1.angleBetween(v2)).to.equal(0);
      });

      test('The angle between vectors pointing in opposite is always PI.', function () {
        v1 = new mockP5.Vector(219, 560);
        v2 = new mockP5.Vector(-219, -560);
        expect(v1.angleBetween(v2)).to.be.closeTo(Math.PI, 0.0000001);
      });
    });

    suite('p5.Vector.angleBetween() [CLASS]', function () {
      test('should return NaN for zero vector', function () {
        v1 = new mockP5.Vector(0, 0, 0);
        v2 = new mockP5.Vector(2, 3, 4);
        expect(mockP5.Vector.angleBetween(v1, v2)).to.be.NaN;
        expect(mockP5.Vector.angleBetween(v2, v1)).to.be.NaN;
      });

      test.todo(
        'between [1,0,0] and [0,-1,0] should be -90 degrees',
        function () {
          mockP5Prototype.angleMode(mockP5.DEGREES);
          v1 = new mockP5.Vector(1, 0, 0);
          v2 = new mockP5.Vector(0, -1, 0);
          expect(mockP5.Vector.angleBetween(v1, v2)).to.be.closeTo(-90, 0.01);
        }
      );

      test('between [0,3,0] and [0,-3,0] should be PI radians', function () {
        v1 = new mockP5.Vector(0, 3, 0);
        v2 = new mockP5.Vector(0, -3, 0);
        expect(mockP5.Vector.angleBetween(v1, v2)).to.be.closeTo(Math.PI, 0.01);
      });
    });
  });

  suite('set()', function () {
    suite('with p5.Vector', function () {
      test("should have x, y, z be initialized to the vector's x, y, z", function () {
        v.set(new mockP5.Vector(2, 5, 6));
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('with Array', function () {
      test('[2,4] should set x === 2, y === 4, z === 0', function () {
        v.set([2, 4]);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(0);
      });

      test("should have x, y, z be initialized to the array's 0,1,2 index", function () {
        v.set([2, 5, 6]);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('set(1,2,3)', function () {
      test('should have x, y, z be initialized to the 1, 2, 3', function () {
        v.set(1, 2, 3);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(2);
        expect(v.z).to.eql(3);
      });
    });
  });

  suite('copy', function () {
    beforeEach(function () {
      v = new mockP5.Vector(2, 3, 4);
    });

    suite('p5.Vector.prototype.copy() [INSTANCE]', function () {
      test('should not return the same instance', function () {
        var newObject = v.copy();
        expect(newObject).to.not.equal(v);
      });

      test("should return the calling object's x, y, z", function () {
        var newObject = v.copy();
        expect(newObject.x).to.eql(2);
        expect(newObject.y).to.eql(3);
        expect(newObject.z).to.eql(4);
      });
    });

    suite('p5.Vector.copy() [CLASS]', function () {
      test('should not return the same instance', function () {
        var newObject = mockP5.Vector.copy(v);
        expect(newObject).to.not.equal(v);
      });

      test("should return the passed object's x, y, z", function () {
        var newObject = mockP5.Vector.copy(v);
        expect(newObject.x).to.eql(2);
        expect(newObject.y).to.eql(3);
        expect(newObject.z).to.eql(4);
      });
    });
  });

  suite('add()', function () {
    beforeEach(function () {
      v = new mockP5.Vector();
    });

    suite('with p5.Vector', function () {
      test('should add x, y, z  from the vector argument', function () {
        v.add(new mockP5.Vector(1, 5, 6));
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('with Array', function () {
      suite('add([2, 4])', function () {
        test('should add the x and y components', function () {
          v.add([2, 4]);
          expect(v.x).to.eql(2);
          expect(v.y).to.eql(4);
          expect(v.z).to.eql(0);
        });
      });

      test("should add the array's 0,1,2 index", function () {
        v.add([2, 5, 6]);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('add(3,5)', function () {
      test('should add the x and y components', function () {
        v.add(3, 5);
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(0);
      });
    });

    suite('add(2,3,4)', function () {
      test('should add the x, y, z components', function () {
        v.add(5, 5, 5);
        expect(v.x).to.eql(5);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(5);
      });
    });

    suite('add(2,3,4)', function () {
      test('should add the x, y, z components', function () {
        v.add([1, 2, 3]);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(2);
      });
    });

    suite('p5.Vector.add(v1, v2)', function () {
      var v1, v2, res;
      beforeEach(function () {
        v1 = new mockP5.Vector(2, 0, 3);
        v2 = new mockP5.Vector(0, 1, 3);
        res = mockP5.Vector.add(v1, v2);
      });

      test('should return neither v1 nor v2', function () {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should be sum of the two p5.Vectors', function () {
        expect(res.x).to.eql(v1.x + v2.x);
        expect(res.y).to.eql(v1.y + v2.y);
        expect(res.z).to.eql(v1.z + v2.z);
      });
    });
  });

  suite('rem()', function () {
    beforeEach(function () {
      v = new mockP5.Vector(3, 4, 5);
    });

    test('should give same vector if nothing passed as parameter', function () {
      v.rem();
      expect(v.x).to.eql(3);
      expect(v.y).to.eql(4);
      expect(v.z).to.eql(5);
    });

    test('should give correct output if passed only one numeric value', function () {
      v.rem(2);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(0);
      expect(v.z).to.eql(1);
    });

    test('should give correct output if passed two numeric value', function () {
      v.rem(2, 3);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(5);
    });

    test('should give correct output if passed three numeric value', function () {
      v.rem(2, 3, 4);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    suite('with p5.Vector', function () {
      test('should return correct output if only one component is non-zero', function () {
        v.rem(new mockP5.Vector(0, 0, 4));
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(1);
      });

      test('should return correct output if x component is zero', () => {
        v.rem(new mockP5.Vector(0, 3, 4));
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(1);
      });

      test('should return correct output if all components are non-zero', () => {
        v.rem(new mockP5.Vector(2, 3, 4));
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(1);
      });

      test('should return same vector if all components are zero', () => {
        v.rem(new mockP5.Vector(0, 0, 0));
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(5);
      });
    });

    suite('with negative vectors', function () {
      let v;
      beforeEach(function () {
        v = new mockP5.Vector(-15, -5, -2);
      });
      test('should return correct output', () => {
        v.rem(new mockP5.Vector(2, 3, 3));
        expect(v.x).to.eql(-1);
        expect(v.y).to.eql(-2);
        expect(v.z).to.eql(-2);
      });
    });

    suite('with Arrays', function () {
      test('should return remainder of vector components for 3D vector', function () {
        v.rem([2, 3, 0]);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(5);
      });
      test('should return remainder of vector components for 2D vector', function () {
        v.rem([2, 3]);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(5);
      });

      test('should return correct output if x,y components are zero for 2D vector', () => {
        v.rem([0, 0]);
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(5);
      });

      test('should return same vector if any vector component is non-finite number', () => {
        v.rem([2, 3, Infinity]);
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(5);
      });
    });

    suite('p5.Vector.rem(v1,v2)', function () {
      let v1, v2, res;
      beforeEach(function () {
        v1 = new mockP5.Vector(2, 3, 4);
        v2 = new mockP5.Vector(1, 2, 3);
        res = mockP5.Vector.rem(v1, v2);
      });

      test('should return neither v1 nor v2', function () {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should be v1 % v2', function () {
        expect(res.x).to.eql(v1.x % v2.x);
        expect(res.y).to.eql(v1.y % v2.y);
        expect(res.z).to.eql(v1.z % v2.z);
      });
    });
  });

  suite('sub()', function () {
    beforeEach(function () {
      v.x = 0;
      v.y = 0;
      v.z = 0;
    });
    suite('with p5.Vector', function () {
      test('should sub x, y, z  from the vector argument', function () {
        v.sub(new mockP5.Vector(2, 5, 6));
        expect(v.x).to.eql(-2);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(-6);
      });
    });

    suite('with Array', function () {
      suite('sub([2, 4])', function () {
        test('should sub the x and y components', function () {
          v.sub([2, 4]);
          expect(v.x).to.eql(-2);
          expect(v.y).to.eql(-4);
          expect(v.z).to.eql(0);
        });
      });

      test("should subtract from the array's 0,1,2 index", function () {
        v.sub([2, 5, 6]);
        expect(v.x).to.eql(-2);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(-6);
      });
    });

    suite('sub(3,5)', function () {
      test('should subtract the x and y components', function () {
        v.sub(3, 5);
        expect(v.x).to.eql(-3);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(0);
      });
    });

    suite('sub(2,3,4)', function () {
      test('should subtract the x, y, z components', function () {
        v.sub(5, 5, 5);
        expect(v.x).to.eql(-5);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(-5);
      });
    });

    suite('p5.Vector.sub(v1, v2)', function () {
      var v1, v2, res;
      beforeEach(function () {
        v1 = new mockP5.Vector(2, 0, 3);
        v2 = new mockP5.Vector(0, 1, 3);
        res = mockP5.Vector.sub(v1, v2);
      });

      test('should return neither v1 nor v2', function () {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should be v1 - v2', function () {
        expect(res.x).to.eql(v1.x - v2.x);
        expect(res.y).to.eql(v1.y - v2.y);
        expect(res.z).to.eql(v1.z - v2.z);
      });
    });
  });

  suite('mult()', function () {
    beforeEach(function () {
      v = new mockP5.Vector(1, 1, 1);
    });

    test('should return the same object', function () {
      expect(v.mult(1)).to.eql(v);
    });

    test('should not change x, y, z if no argument is given', function () {
      v.mult();
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    test('should not change x, y, z if n is not a finite number', function () {
      v.mult(NaN);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    suite('with scalar', function () {
      test('multiply the x, y, z with the scalar', function () {
        v.mult(2);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(2);
        expect(v.z).to.eql(2);
      });
    });

    suite('v0.mult(v1)', function () {
      var v0, v1;
      beforeEach(function () {
        v0 = new mockP5.Vector(1, 2, 3);
        v1 = new mockP5.Vector(2, 3, 4);
        v0.mult(v1);
      });

      test('should do component wise multiplication', function () {
        expect(v0.x).to.eql(2);
        expect(v0.y).to.eql(6);
        expect(v0.z).to.eql(12);
      });
    });

    suite('v0.mult(arr)', function () {
      var v0, arr;
      beforeEach(function () {
        v0 = new mockP5.Vector(1, 2, 3);
        arr = [2, 3, 4];
        v0.mult(arr);
      });

      test('should do component wise multiplication from an array', function () {
        expect(v0.x).to.eql(2);
        expect(v0.y).to.eql(6);
        expect(v0.z).to.eql(12);
      });
    });

    suite('p5.Vector.mult(v, n)', function () {
      var v, res;
      beforeEach(function () {
        v = new mockP5.Vector(1, 2, 3);
        res = mockP5.Vector.mult(v, 4);
      });

      test('should return a new p5.Vector', function () {
        expect(res).to.not.eql(v);
      });

      test('should multiply the scalar', function () {
        expect(res.x).to.eql(4);
        expect(res.y).to.eql(8);
        expect(res.z).to.eql(12);
      });
    });

    suite('p5.Vector.mult(v, v', function () {
      var v0, v1, res;
      beforeEach(function () {
        v0 = new mockP5.Vector(1, 2, 3);
        v1 = new mockP5.Vector(2, 3, 4);
        res = mockP5.Vector.mult(v0, v1);
      });

      test('should return new vector from component wise multiplication', function () {
        expect(res.x).to.eql(2);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(12);
      });
    });

    suite('p5.Vector.mult(v, arr', function () {
      var v0, arr, res;
      beforeEach(function () {
        v0 = new mockP5.Vector(1, 2, 3);
        arr = [2, 3, 4];
        res = mockP5.Vector.mult(v0, arr);
      });

      test('should return new vector from component wise multiplication with an array', function () {
        expect(res.x).to.eql(2);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(12);
      });
    });
  });

  suite('div()', function () {
    beforeEach(function () {
      v = new mockP5.Vector(1, 1, 1);
    });

    test('should return the same object', function () {
      expect(v.div(1)).to.eql(v);
    });

    test('should not change x, y, z if no argument is given', function () {
      v.div();
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    test('should not change x, y, z if n is not a finite number', function () {
      v.div(NaN);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    suite('with scalar', function () {
      test('divide the x, y, z with the scalar', function () {
        v.div(2);
        expect(v.x).to.be.closeTo(0.5, 0.01);
        expect(v.y).to.be.closeTo(0.5, 0.01);
        expect(v.z).to.be.closeTo(0.5, 0.01);
      });

      test('should not change x, y, z if n is 0', function () {
        v.div(0);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(1);
      });
    });

    suite('p5.Vector.div(v, n)', function () {
      var v, res;
      beforeEach(function () {
        v = new mockP5.Vector(1, 1, 1);
        res = mockP5.Vector.div(v, 4);
      });

      test('should not be undefined', function () {
        expect(res).to.not.eql(undefined);
      });

      test('should return a new p5.Vector', function () {
        expect(res).to.not.eql(v);
      });

      test('should divide the scalar', function () {
        expect(res.x).to.eql(0.25);
        expect(res.y).to.eql(0.25);
        expect(res.z).to.eql(0.25);
      });
    });

    suite('v0.div(v1)', function () {
      var v0, v1, v2, v3;
      beforeEach(function () {
        v0 = new mockP5.Vector(2, 6, 9);
        v1 = new mockP5.Vector(2, 2, 3);
        v2 = new mockP5.Vector(1, 1, 1);
        v3 = new mockP5.Vector(0, 0, 0);

        v0.div(v1);
      });

      test('should do component wise division', function () {
        expect(v0.x).to.eql(1);
        expect(v0.y).to.eql(3);
        expect(v0.z).to.eql(3);
      });

      test('should not change x, y, z if v3 is all 0', function () {
        v2.div(v3);
        expect(v2.x).to.eql(1);
        expect(v2.y).to.eql(1);
        expect(v2.z).to.eql(1);
      });

      test('should work on 2D vectors', function () {
        const v = new mockP5.Vector(1, 1);
        const divisor = new mockP5.Vector(2, 2);
        v.div(divisor);
        expect(v.x).to.eql(0.5);
        expect(v.y).to.eql(0.5);
        expect(v.z).to.eql(0);
      });

      test('should work when the dividend has 0', function () {
        const v = new mockP5.Vector(1, 0);
        const divisor = new mockP5.Vector(2, 2);
        v.div(divisor);
        expect(v.x).to.eql(0.5);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });

      test('should do nothing when the divisor has 0', function () {
        const v = new mockP5.Vector(1, 1);
        const divisor = new mockP5.Vector(0, 2);
        v.div(divisor);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(0);
      });
    });

    suite('v0.div(arr)', function () {
      var v0, v1, arr;
      beforeEach(function () {
        v0 = new mockP5.Vector(2, 6, 9);
        v1 = new mockP5.Vector(1, 1, 1);
        arr = [2, 2, 3];
        v0.div(arr);
      });

      test('should do component wise division with an array', function () {
        expect(v0.x).to.eql(1);
        expect(v0.y).to.eql(3);
        expect(v0.z).to.eql(3);
      });

      test('should not change x, y, z if array contains 0', function () {
        v1.div([0, 0, 0]);
        expect(v1.x).to.eql(1);
        expect(v1.y).to.eql(1);
        expect(v1.z).to.eql(1);
      });
    });

    suite('p5.Vector.div(v, v', function () {
      var v0, v1, res;
      beforeEach(function () {
        v0 = new mockP5.Vector(2, 6, 9);
        v1 = new mockP5.Vector(2, 2, 3);
        res = mockP5.Vector.div(v0, v1);
      });

      test('should return new vector from component wise division', function () {
        expect(res.x).to.eql(1);
        expect(res.y).to.eql(3);
        expect(res.z).to.eql(3);
      });
    });

    suite('p5.Vector.div(v, arr', function () {
      var v0, arr, res;
      beforeEach(function () {
        v0 = new mockP5.Vector(2, 6, 9);
        arr = [2, 2, 3];
        res = mockP5.Vector.div(v0, arr);
      });

      test('should return new vector from component wise division with an array', function () {
        expect(res.x).to.eql(1);
        expect(res.y).to.eql(3);
        expect(res.z).to.eql(3);
      });
    });
  });

  suite('dot', function () {
    beforeEach(function () {
      v.x = 1;
      v.y = 1;
      v.z = 1;
    });

    test('should return a number', function () {
      expect(typeof v.dot(new mockP5.Vector()) === 'number').to.eql(true);
    });

    suite('with p5.Vector', function () {
      test('should be the dot product of the vector', function () {
        expect(v.dot(new mockP5.Vector(2, 2))).to.eql(4);
      });
    });

    suite('with x, y, z', function () {
      test('should be the dot product with x, y', function () {
        expect(v.dot(2, 2)).to.eql(4);
      });

      test('should be the dot product with x, y, z', function () {
        expect(v.dot(2, 2, 2)).to.eql(6);
      });
    });

    suite('p5.Vector.dot(v, n)', function () {
      var v1, v2, res;
      beforeEach(function () {
        v1 = new mockP5.Vector(1, 1, 1);
        v2 = new mockP5.Vector(2, 3, 4);
        res = mockP5.Vector.dot(v1, v2);
      });

      test('should return a number', function () {
        expect(typeof res === 'number').to.eql(true);
      });

      test('should be the dot product of the two vectors', function () {
        expect(res).to.eql(9);
      });
    });
  });

  suite('cross', function () {
    var res;
    beforeEach(function () {
      v.x = 1;
      v.y = 1;
      v.z = 1;
    });

    test('should return a new product', function () {
      expect(v.cross(new mockP5.Vector())).to.not.eql(v);
    });

    suite('with p5.Vector', function () {
      test('should cross x, y, z  from the vector argument', function () {
        res = v.cross(new mockP5.Vector(2, 5, 6));
        expect(res.x).to.eql(1); //this.y * v.z - this.z * v.y
        expect(res.y).to.eql(-4); //this.z * v.x - this.x * v.z
        expect(res.z).to.eql(3); //this.x * v.y - this.y * v.x
      });
    });

    suite('p5.Vector.cross(v1, v2)', function () {
      var v1, v2, res;
      beforeEach(function () {
        v1 = new mockP5.Vector(3, 6, 9);
        v2 = new mockP5.Vector(1, 1, 1);
        res = mockP5.Vector.cross(v1, v2);
      });

      test('should not be undefined', function () {
        expect(res).to.not.eql(undefined);
      });

      test('should return neither v1 nor v2', function () {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should the cross product of v1 and v2', function () {
        expect(res.x).to.eql(-3);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(-3);
      });
    });
  });

  suite('dist', function () {
    var b, c;
    beforeEach(function () {
      v = new mockP5.Vector(0, 0, 1);
      b = new mockP5.Vector(0, 0, 5);
      c = new mockP5.Vector(3, 4, 1);
    });

    test('should return a number', function () {
      expect(typeof v.dist(b) === 'number').to.eql(true);
    });

    test('should return distance between two vectors', function () {
      expect(v.dist(b)).to.eql(4);
    });

    test('should return distance between two vectors', function () {
      expect(v.dist(c)).to.eql(5);
    });

    test('should be commutative', function () {
      expect(b.dist(c)).to.eql(c.dist(b));
    });
  });

  suite('p5.Vector.dist(v1, v2)', function () {
    var v1, v2;
    beforeEach(function () {
      v1 = new mockP5.Vector(0, 0, 0);
      v2 = new mockP5.Vector(0, 3, 4);
    });

    test('should return a number', function () {
      expect(typeof mockP5.Vector.dist(v1, v2) === 'number').to.eql(true);
    });

    test('should be commutative', function () {
      expect(mockP5.Vector.dist(v1, v2)).to.eql(mockP5.Vector.dist(v2, v1));
    });
  });

  suite('normalize', function () {
    suite('p5.Vector.prototype.normalize() [INSTANCE]', function () {
      beforeEach(function () {
        v = new mockP5.Vector(1, 1, 1);
      });

      test('should return the same object', function () {
        expect(v.normalize()).to.eql(v);
      });

      test('unit vector should not change values', function () {
        v.x = 1;
        v.y = 0;
        v.z = 0;
        v.normalize();
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });

      test('2,2,1 should normalize to ~0.66,0.66,0.33', function () {
        v.x = 2;
        v.y = 2;
        v.z = 1;
        v.normalize();
        expect(v.x).to.be.closeTo(0.6666, 0.01);
        expect(v.y).to.be.closeTo(0.6666, 0.01);
        expect(v.z).to.be.closeTo(0.3333, 0.01);
      });
    });

    suite('p5.Vector.normalize(v) [CLASS]', function () {
      var res;
      beforeEach(function () {
        v = new mockP5.Vector(1, 0, 0);
        res = mockP5.Vector.normalize(v);
      });

      test('should not be undefined', function () {
        expect(res).to.not.eql(undefined);
      });

      test('should not return same object v', function () {
        expect(res).to.not.equal(v);
      });

      test('unit vector 1,0,0 should normalize to 1,0,0', function () {
        expect(res.x).to.eql(1);
        expect(res.y).to.eql(0);
        expect(res.z).to.eql(0);
      });

      test('2,2,1 should normalize to ~0.66,0.66,0.33', function () {
        v.x = 2;
        v.y = 2;
        v.z = 1;
        res = mockP5.Vector.normalize(v);
        expect(res.x).to.be.closeTo(0.6666, 0.01);
        expect(res.y).to.be.closeTo(0.6666, 0.01);
        expect(res.z).to.be.closeTo(0.3333, 0.01);
      });
    });
  });

  suite('limit', function () {
    let v;

    beforeEach(function () {
      v = new mockP5.Vector(5, 5, 5);
    });

    suite('p5.Vector.prototype.limit() [INSTANCE]', function () {
      test('should return the same object', function () {
        expect(v.limit()).to.equal(v);
      });

      suite('with a vector larger than the limit', function () {
        test('should limit the vector', function () {
          v.limit(1);
          expect(v.x).to.be.closeTo(0.5773, 0.01);
          expect(v.y).to.be.closeTo(0.5773, 0.01);
          expect(v.z).to.be.closeTo(0.5773, 0.01);
        });
      });

      suite('with a vector smaller than the limit', function () {
        test('should not limit the vector', function () {
          v.limit(8.67);
          expect(v.x).to.eql(5);
          expect(v.y).to.eql(5);
          expect(v.z).to.eql(5);
        });
      });
    });

    suite('p5.Vector.limit() [CLASS]', function () {
      test('should not return the same object', function () {
        expect(mockP5.Vector.limit(v)).to.not.equal(v);
      });

      suite('with a vector larger than the limit', function () {
        test('should limit the vector', function () {
          const res = mockP5.Vector.limit(v, 1);
          expect(res.x).to.be.closeTo(0.5773, 0.01);
          expect(res.y).to.be.closeTo(0.5773, 0.01);
          expect(res.z).to.be.closeTo(0.5773, 0.01);
        });
      });

      suite('with a vector smaller than the limit', function () {
        test('should not limit the vector', function () {
          const res = mockP5.Vector.limit(v, 8.67);
          expect(res.x).to.eql(5);
          expect(res.y).to.eql(5);
          expect(res.z).to.eql(5);
        });
      });

      suite('when given a target vector', function () {
        test('should store limited vector in the target', function () {
          const target = new mockP5.Vector(0, 0, 0);
          mockP5.Vector.limit(v, 1, target);
          expect(target.x).to.be.closeTo(0.5773, 0.01);
          expect(target.y).to.be.closeTo(0.5773, 0.01);
          expect(target.z).to.be.closeTo(0.5773, 0.01);
        });
      });
    });
  });

  suite('setMag', function () {
    let v;

    beforeEach(function () {
      v = new mockP5.Vector(1, 0, 0);
    });

    suite('p5.Vector.setMag() [INSTANCE]', function () {
      test('should return the same object', function () {
        expect(v.setMag(2)).to.equal(v);
      });

      test('should set the magnitude of the vector', function () {
        v.setMag(4);
        expect(v.x).to.eql(4);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });

      test('should set the magnitude of the vector', function () {
        v.x = 2;
        v.y = 3;
        v.z = -6;
        v.setMag(14);
        expect(v.x).to.eql(4);
        expect(v.y).to.eql(6);
        expect(v.z).to.eql(-12);
      });
    });

    suite('p5.Vector.prototype.setMag() [CLASS]', function () {
      test('should not return the same object', function () {
        expect(mockP5.Vector.setMag(v, 2)).to.not.equal(v);
      });

      test('should set the magnitude of the vector', function () {
        const res = mockP5.Vector.setMag(v, 4);
        expect(res.x).to.eql(4);
        expect(res.y).to.eql(0);
        expect(res.z).to.eql(0);
      });

      test('should set the magnitude of the vector', function () {
        v.x = 2;
        v.y = 3;
        v.z = -6;
        const res = mockP5.Vector.setMag(v, 14);
        expect(res.x).to.eql(4);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(-12);
      });

      suite('when given a target vector', function () {
        test('should set the magnitude on the target', function () {
          const target = new mockP5.Vector(0, 1, 0);
          const res = mockP5.Vector.setMag(v, 4, target);
          expect(target).to.equal(res);
          expect(target.x).to.eql(4);
          expect(target.y).to.eql(0);
          expect(target.z).to.eql(0);
        });
      });
    });
  });

  suite('heading', function () {
    beforeEach(function () {
      v = new mockP5.Vector();
    });

    suite('p5.Vector.prototype.heading() [INSTANCE]', function () {
      test('should return a number', function () {
        expect(typeof v.heading() === 'number').to.eql(true);
      });

      test('heading for vector pointing right is 0', function () {
        v.x = 1;
        v.y = 0;
        v.z = 0;
        expect(v.heading()).to.be.closeTo(0, 0.01);
      });

      test('heading for vector pointing down is PI/2', function () {
        v.x = 0;
        v.y = 1;
        v.z = 0;
        expect(v.heading()).to.be.closeTo(Math.PI / 2, 0.01);
      });

      test('heading for vector pointing left is PI', function () {
        v.x = -1;
        v.y = 0;
        v.z = 0;
        expect(v.heading()).to.be.closeTo(Math.PI, 0.01);
      });

      suite.todo('with `angleMode(DEGREES)`', function () {
        beforeEach(function () {
          mockP5Prototype.angleMode(mockP5.DEGREES);
        });

        test('heading for vector pointing right is 0', function () {
          v.x = 1;
          v.y = 0;
          v.z = 0;
          expect(v.heading()).to.equal(0);
        });

        test('heading for vector pointing down is 90', function () {
          v.x = 0;
          v.y = 1;
          v.z = 0;
          expect(v.heading()).to.equal(90);
        });

        test('heading for vector pointing left is 180', function () {
          v.x = -1;
          v.y = 0;
          v.z = 0;
          expect(v.heading()).to.equal(180);
        });
      });
    });

    suite('p5.Vector.heading() [CLASS]', function () {
      test('should return a number', function () {
        expect(typeof mockP5.Vector.heading(v) === 'number').to.eql(true);
      });

      test('heading for vector pointing right is 0', function () {
        v.x = 1;
        v.y = 0;
        v.z = 0;
        expect(mockP5.Vector.heading(v)).to.be.closeTo(0, 0.01);
      });

      test('heading for vector pointing down is PI/2', function () {
        v.x = 0;
        v.y = 1;
        v.z = 0;
        expect(mockP5.Vector.heading(v)).to.be.closeTo(Math.PI / 2, 0.01);
      });

      test('heading for vector pointing left is PI', function () {
        v.x = -1;
        v.y = 0;
        v.z = 0;
        expect(mockP5.Vector.heading(v)).to.be.closeTo(Math.PI, 0.01);
      });
    });
  });

  suite('lerp', function () {
    test('should return the same object', function () {
      expect(v.lerp()).to.eql(v);
    });

    // PEND: ADD BACK IN
    // suite('with p5.Vector', function() {
    //   test('should call lerp with 4 arguments', function() {
    //     spyOn(v, 'lerp').andCallThrough();
    //     v.lerp(new p5.Vector(1,2,3), 1);
    //     expect(v.lerp).toHaveBeenCalledWith(1, 2, 3, 1);
    //   });
    // });

    suite('with x, y, z, amt', function () {
      beforeEach(function () {
        v.x = 0;
        v.y = 0;
        v.z = 0;
        v.lerp(2, 2, 2, 0.5);
      });

      test('should lerp x by amt', function () {
        expect(v.x).to.eql(1);
      });

      test('should lerp y by amt', function () {
        expect(v.y).to.eql(1);
      });

      test('should lerp z by amt', function () {
        expect(v.z).to.eql(1);
      });
    });

    suite('with no amt', function () {
      test('should assume 0 amt', function () {
        v.x = 0;
        v.y = 0;
        v.z = 0;
        v.lerp(2, 2, 2);
        expect(v.x).to.eql(0);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });
    });
  });

  suite('p5.Vector.lerp(v1, v2, amt)', function () {
    var res, v1, v2;
    beforeEach(function () {
      v1 = new mockP5.Vector(0, 0, 0);
      v2 = new mockP5.Vector(2, 2, 2);
      res = mockP5.Vector.lerp(v1, v2, 0.5);
    });

    test('should not be undefined', function () {
      expect(res).to.not.eql(undefined);
    });

    test('should be a p5.Vector', function () {
      expect(res).to.be.an.instanceof(mockP5.Vector);
    });

    test('should return neither v1 nor v2', function () {
      expect(res).to.not.eql(v1);
      expect(res).to.not.eql(v2);
    });

    test('should res to be [1, 1, 1]', function () {
      expect(res.x).to.eql(1);
      expect(res.y).to.eql(1);
      expect(res.z).to.eql(1);
    });
  });

  suite('v.slerp(w, amt)', function () {
    var w;
    beforeEach(function () {
      v.set(1, 2, 3);
      w = new mockP5.Vector(4, 6, 8);
    });

    test('if amt is 0, returns original vector', function () {
      v.slerp(w, 0);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(2);
      expect(v.z).to.eql(3);
    });

    test('if amt is 1, returns argument vector', function () {
      v.slerp(w, 1);
      expect(v.x).to.eql(4);
      expect(v.y).to.eql(6);
      expect(v.z).to.eql(8);
    });

    test('if both v and w are 2D, then result will also be 2D.', function () {
      v.set(2, 3, 0);
      w.set(3, -2, 0);
      v.slerp(w, 0.3);
      expect(v.z).to.eql(0);

      v.set(1, 4, 0);
      w.set(-1, -4, 0);
      v.slerp(w, 0.8);
      expect(v.z).to.eql(0);
    });

    test('if one side is a zero vector, linearly interpolate.', function () {
      v.set(0, 0, 0);
      w.set(2, 4, 6);
      v.slerp(w, 0.5);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(2);
      expect(v.z).to.eql(3);
    });

    test('If they are pointing in the same direction, linearly interpolate.', function () {
      v.set(5, 11, 16);
      w.set(15, 33, 48);
      v.slerp(w, 0.5);
      expect(v.x).to.eql(10);
      expect(v.y).to.eql(22);
      expect(v.z).to.eql(32);
    });
  });

  suite('p5.Vector.slerp(v1, v2, amt)', function () {
    var res, v1, v2;
    beforeEach(function () {
      v1 = new mockP5.Vector(1, 0, 0);
      v2 = new mockP5.Vector(0, 0, 1);
      res = mockP5.Vector.slerp(v1, v2, 1 / 3);
    });

    test('should not be undefined', function () {
      expect(res).to.not.eql(undefined);
    });

    test('should be a p5.Vector', function () {
      expect(res).to.be.an.instanceof(mockP5.Vector);
    });

    test('should return neither v1 nor v2', function () {
      expect(res).to.not.eql(v1);
      expect(res).to.not.eql(v2);
    });

    test('Make sure the interpolation in 1/3 is correct', function () {
      expect(res.x).to.be.closeTo(Math.cos(Math.PI / 6), 0.00001);
      expect(res.y).to.be.closeTo(0, 0.00001);
      expect(res.z).to.be.closeTo(Math.sin(Math.PI / 6), 0.00001);
    });

    test('Make sure the interpolation in -1/3 is correct', function () {
      mockP5.Vector.slerp(v1, v2, -1 / 3, res);
      expect(res.x).to.be.closeTo(Math.cos(-Math.PI / 6), 0.00001);
      expect(res.y).to.be.closeTo(0, 0.00001);
      expect(res.z).to.be.closeTo(Math.sin(-Math.PI / 6), 0.00001);
    });

    test('Make sure the interpolation in 5/3 is correct', function () {
      mockP5.Vector.slerp(v1, v2, 5 / 3, res);
      expect(res.x).to.be.closeTo(Math.cos((5 * Math.PI) / 6), 0.00001);
      expect(res.y).to.be.closeTo(0, 0.00001);
      expect(res.z).to.be.closeTo(Math.sin((5 * Math.PI) / 6), 0.00001);
    });
  });

  suite('p5.Vector.fromAngle(angle)', function () {
    var res, angle;
    beforeEach(function () {
      angle = Math.PI / 2;
      res = mockP5.Vector.fromAngle(angle);
    });

    test('should be a p5.Vector with values (0,1)', function () {
      expect(res.x).to.be.closeTo(0, 0.01);
      expect(res.y).to.be.closeTo(1, 0.01);
    });
  });

  suite('p5.Vector.random2D()', function () {
    var res;
    beforeEach(function () {
      res = mockP5.Vector.random2D();
    });

    test('should be a unit p5.Vector', function () {
      expect(res.mag()).to.be.closeTo(1, 0.01);
    });
  });

  suite('p5.Vector.random3D()', function () {
    var res;
    beforeEach(function () {
      res = mockP5.Vector.random3D();
    });
    test('should be a unit p5.Vector', function () {
      expect(res.mag()).to.be.closeTo(1, 0.01);
    });
  });

  suite('array', function () {
    beforeEach(function () {
      v = new mockP5.Vector(1, 23, 4);
    });

    suite('p5.Vector.prototype.array() [INSTANCE]', function () {
      test('should return an array', function () {
        expect(v.array()).to.be.instanceof(Array);
      });

      test('should return an with the x y and z components', function () {
        expect(v.array()).to.eql([1, 23, 4]);
      });
    });

    suite('p5.Vector.array() [CLASS]', function () {
      test('should return an array', function () {
        expect(mockP5.Vector.array(v)).to.be.instanceof(Array);
      });

      test('should return an with the x y and z components', function () {
        expect(mockP5.Vector.array(v)).to.eql([1, 23, 4]);
      });
    });
  });

  suite('reflect', function () {
    suite('p5.Vector.prototype.reflect() [INSTANCE]', function () {
      let incoming_x, incoming_y, incoming_z, original_incoming;
      let x_normal, y_normal, z_normal;
      let x_bounce_incoming,
        x_bounce_outgoing,
        y_bounce_incoming,
        y_bounce_outgoing,
        z_bounce_incoming,
        z_bounce_outgoing;
      beforeEach(function () {
        incoming_x = 1;
        incoming_y = 1;
        incoming_z = 1;
        original_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );

        x_normal = new mockP5.Vector(3, 0, 0);
        y_normal = new mockP5.Vector(0, 3, 0);
        z_normal = new mockP5.Vector(0, 0, 3);

        x_bounce_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );
        x_bounce_outgoing = x_bounce_incoming.reflect(x_normal);

        y_bounce_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );
        y_bounce_outgoing = y_bounce_incoming.reflect(y_normal);

        z_bounce_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );
        z_bounce_outgoing = z_bounce_incoming.reflect(z_normal);
      });

      test('should return a p5.Vector', function () {
        expect(x_bounce_incoming).to.be.an.instanceof(mockP5.Vector);
        expect(y_bounce_incoming).to.be.an.instanceof(mockP5.Vector);
        expect(z_bounce_incoming).to.be.an.instanceof(mockP5.Vector);
      });

      test('should update this', function () {
        assert.equal(x_bounce_incoming, x_bounce_outgoing);
        assert.equal(y_bounce_incoming, y_bounce_outgoing);
        assert.equal(z_bounce_incoming, z_bounce_outgoing);
      });

      test('x-normal should flip incoming x component and maintain y,z components', function () {
        expect(x_bounce_outgoing.x).to.be.closeTo(-1, 0.01);
        expect(x_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(x_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('y-normal should flip incoming y component and maintain x,z components', function () {
        expect(y_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(y_bounce_outgoing.y).to.be.closeTo(-1, 0.01);
        expect(y_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('z-normal should flip incoming z component and maintain x,y components', function () {
        expect(z_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.z).to.be.closeTo(-1, 0.01);
      });

      test('angle of incidence should match angle of reflection', function () {
        expect(
          Math.abs(x_normal.angleBetween(original_incoming))
        ).to.be.closeTo(
          Math.abs(x_normal.angleBetween(x_bounce_outgoing.mult(-1))),
          0.01
        );
        expect(
          Math.abs(y_normal.angleBetween(original_incoming))
        ).to.be.closeTo(
          Math.abs(y_normal.angleBetween(y_bounce_outgoing.mult(-1))),
          0.01
        );
        expect(
          Math.abs(z_normal.angleBetween(original_incoming))
        ).to.be.closeTo(
          Math.abs(z_normal.angleBetween(z_bounce_outgoing.mult(-1))),
          0.01
        );
      });
      test('should not update surface normal', function () {
        const tolerance = 0.001;
        assert.closeTo(x_normal.x, 3, tolerance);
        assert.closeTo(x_normal.y, 0, tolerance);
        assert.closeTo(x_normal.z, 0, tolerance);

        assert.closeTo(y_normal.x, 0, tolerance);
        assert.closeTo(y_normal.y, 3, tolerance);
        assert.closeTo(y_normal.z, 0, tolerance);

        assert.closeTo(z_normal.x, 0, tolerance);
        assert.closeTo(z_normal.y, 0, tolerance);
        assert.closeTo(z_normal.z, 3, tolerance);
      });
    });

    suite('p5.Vector.reflect() [CLASS]', function () {
      let incoming_x, incoming_y, incoming_z, original_incoming;
      let x_target, y_target, z_target;
      let x_normal, y_normal, z_normal;
      let x_bounce_incoming,
        x_bounce_outgoing,
        y_bounce_incoming,
        y_bounce_outgoing,
        z_bounce_incoming,
        z_bounce_outgoing;

      beforeEach(function () {
        incoming_x = 1;
        incoming_y = 1;
        incoming_z = 1;
        original_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );
        x_target = new mockP5.Vector();
        y_target = new mockP5.Vector();
        z_target = new mockP5.Vector();

        x_normal = new mockP5.Vector(3, 0, 0);
        y_normal = new mockP5.Vector(0, 3, 0);
        z_normal = new mockP5.Vector(0, 0, 3);

        x_bounce_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );
        x_bounce_outgoing = mockP5.Vector.reflect(
          x_bounce_incoming,
          x_normal,
          x_target
        );

        y_bounce_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );
        y_bounce_outgoing = mockP5.Vector.reflect(
          y_bounce_incoming,
          y_normal,
          y_target
        );

        z_bounce_incoming = new mockP5.Vector(
          incoming_x,
          incoming_y,
          incoming_z
        );
        z_bounce_outgoing = mockP5.Vector.reflect(
          z_bounce_incoming,
          z_normal,
          z_target
        );
      });

      test('should return a p5.Vector', function () {
        expect(x_bounce_incoming).to.be.an.instanceof(mockP5.Vector);
        expect(y_bounce_incoming).to.be.an.instanceof(mockP5.Vector);
        expect(z_bounce_incoming).to.be.an.instanceof(mockP5.Vector);
      });

      test('should not update this', function () {
        expect(x_bounce_incoming).to.not.equal(x_bounce_outgoing);
        expect(y_bounce_incoming).to.not.equal(y_bounce_outgoing);
        expect(z_bounce_incoming).to.not.equal(z_bounce_outgoing);
      });

      test('should not update surface normal', function () {
        const tolerance = 0.001;
        assert.closeTo(x_normal.x, 3, tolerance);
        assert.closeTo(x_normal.y, 0, tolerance);
        assert.closeTo(x_normal.z, 0, tolerance);

        assert.closeTo(y_normal.x, 0, tolerance);
        assert.closeTo(y_normal.y, 3, tolerance);
        assert.closeTo(y_normal.z, 0, tolerance);

        assert.closeTo(z_normal.x, 0, tolerance);
        assert.closeTo(z_normal.y, 0, tolerance);
        assert.closeTo(z_normal.z, 3, tolerance);
      });

      test('should update target', function () {
        assert.equal(x_target, x_bounce_outgoing);
        assert.equal(y_target, y_bounce_outgoing);
        assert.equal(z_target, z_bounce_outgoing);
      });

      test('x-normal should flip incoming x component and maintain y,z components', function () {
        expect(x_bounce_outgoing.x).to.be.closeTo(-1, 0.01);
        expect(x_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(x_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('y-normal should flip incoming y component and maintain x,z components', function () {
        expect(y_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(y_bounce_outgoing.y).to.be.closeTo(-1, 0.01);
        expect(y_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('z-normal should flip incoming z component and maintain x,y components', function () {
        expect(z_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.z).to.be.closeTo(-1, 0.01);
      });

      test('angle of incidence should match angle of reflection', function () {
        expect(
          Math.abs(x_normal.angleBetween(original_incoming))
        ).to.be.closeTo(
          Math.abs(x_normal.angleBetween(x_bounce_outgoing.mult(-1))),
          0.01
        );
        expect(
          Math.abs(y_normal.angleBetween(original_incoming))
        ).to.be.closeTo(
          Math.abs(y_normal.angleBetween(y_bounce_outgoing.mult(-1))),
          0.01
        );
        expect(
          Math.abs(z_normal.angleBetween(original_incoming))
        ).to.be.closeTo(
          Math.abs(z_normal.angleBetween(z_bounce_outgoing.mult(-1))),
          0.01
        );
      });
    });
  });

  suite('mag', function () {
    const MAG = 3.7416573867739413; // sqrt(1*1 + 2*2 + 3*3)

    let v0;
    let v1;

    beforeEach(function () {
      v0 = new mockP5.Vector(0, 0, 0);
      v1 = new mockP5.Vector(1, 2, 3);
    });

    suite('p5.Vector.prototype.mag() [INSTANCE]', function () {
      test('should return the magnitude of the vector', function () {
        expect(v0.mag()).to.eql(0);
        expect(v1.mag()).to.eql(MAG);
      });
    });

    suite('p5.Vector.mag() [CLASS]', function () {
      test('should return the magnitude of the vector', function () {
        expect(mockP5.Vector.mag(v0)).to.eql(0);
        expect(mockP5.Vector.mag(v1)).to.eql(MAG);
      });
    });
  });

  suite('magSq', function () {
    const MAG = 14; // 1*1 + 2*2 + 3*3

    let v0;
    let v1;

    beforeEach(function () {
      v0 = new mockP5.Vector(0, 0, 0);
      v1 = new mockP5.Vector(1, 2, 3);
    });

    suite('p5.Vector.prototype.magSq() [INSTANCE]', function () {
      test('should return the magnitude of the vector', function () {
        expect(v0.magSq()).to.eql(0);
        expect(v1.magSq()).to.eql(MAG);
      });
    });

    suite('p5.Vector.magSq() [CLASS]', function () {
      test('should return the magnitude of the vector', function () {
        expect(mockP5.Vector.magSq(v0)).to.eql(0);
        expect(mockP5.Vector.magSq(v1)).to.eql(MAG);
      });
    });
  });

  suite('equals', function () {
    suite('p5.Vector.prototype.equals() [INSTANCE]', function () {
      test('should return false for parameters inequal to the vector', function () {
        const v1 = new mockP5.Vector(0, -1, 1);
        const v2 = new mockP5.Vector(1, 2, 3);
        const a2 = [1, 2, 3];
        expect(v1.equals(v2)).to.be.false;
        expect(v1.equals(a2)).to.be.false;
        expect(v1.equals(1, 2, 3)).to.be.false;
      });

      test('should return true for equal vectors', function () {
        const v1 = new mockP5.Vector(0, -1, 1);
        const v2 = new mockP5.Vector(0, -1, 1);
        expect(v1.equals(v2)).to.be.true;
      });

      test('should return true for arrays equal to the vector', function () {
        const v1 = new mockP5.Vector(0, -1, 1);
        const a1 = [0, -1, 1];
        expect(v1.equals(a1)).to.be.true;
      });

      test('should return true for arguments equal to the vector', function () {
        const v1 = new mockP5.Vector(0, -1, 1);
        expect(v1.equals(0, -1, 1)).to.be.true;
      });
    });

    suite('p5.Vector.equals() [CLASS]', function () {
      test('should return false for inequal parameters', function () {
        const v1 = new mockP5.Vector(0, -1, 1);
        const v2 = new mockP5.Vector(1, 2, 3);
        const a2 = [1, 2, 3];
        expect(mockP5.Vector.equals(v1, v2)).to.be.false;
        expect(mockP5.Vector.equals(v1, a2)).to.be.false;
        expect(mockP5.Vector.equals(a2, v1)).to.be.false;
      });

      test('should return true for equal vectors', function () {
        const v1 = new mockP5.Vector(0, -1, 1);
        const v2 = new mockP5.Vector(0, -1, 1);
        expect(mockP5.Vector.equals(v1, v2)).to.be.true;
      });

      test('should return true for equal vectors and arrays', function () {
        const v1 = new mockP5.Vector(0, -1, 1);
        const a1 = [0, -1, 1];
        expect(mockP5.Vector.equals(v1, a1)).to.be.true;
        expect(mockP5.Vector.equals(a1, v1)).to.be.true;
      });

      test('should return true for equal arrays', function () {
        const a1 = [0, -1, 1];
        const a2 = [0, -1, 1];
        expect(mockP5.Vector.equals(a1, a2)).to.be.true;
      });
    });
  });

  suite('set values', function () {
    beforeEach(function () {
      v = new mockP5.Vector();
    });

    test('should set values to [0,0,0] if values array is empty', function () {
      v.values = [];
      assert.equal(v.x, 0);
      assert.equal(v.y, 0);
      assert.equal(v.z, 0);
      assert.equal(v.dimensions, 2);
    });
  });
  suite('get value', function () {
    test('should return element in range of a non empty vector', function () {
      let vect = new mockP5.Vector(1, 2, 3, 4);
      assert.equal(vect.getValue(0), 1);
      assert.equal(vect.getValue(1), 2);
      assert.equal(vect.getValue(2), 3);
      assert.equal(vect.getValue(3), 4);
    });

    test.fails(
      'should throw friendly error if attempting to get element outside lenght',
      function () {
        let vect = new mockP5.Vector(1, 2, 3, 4);
        assert.equal(vect.getValue(5), 1);
      }
    );
  });

  suite('set value', function () {
    test('should set value of element in range', function () {
      let vect = new mockP5.Vector(1, 2, 3, 4);
      vect.setValue(0, 7);
      assert.equal(vect.getValue(0), 7);
      assert.equal(vect.getValue(1), 2);
      assert.equal(vect.getValue(2), 3);
      assert.equal(vect.getValue(3), 4);
    });

    test.fails(
      'should throw friendly error if attempting to set element outside lenght',
      function () {
        let vect = new mockP5.Vector(1, 2, 3, 4);
        vect.setValue(100, 7);
      }
    );
  });

  describe('get w', () => {
    it('should return the w component of the vector', () => {
      v = new mockP5.Vector(1, 2, 3, 4);
      expect(v.w).toBe(4);
    });

    it('should return 0 if w component is not set', () => {
      v = new mockP5.Vector(1, 2, 3);
      expect(v.w).toBe(0);
    });
  });

  describe('set w', () => {
    it('should set 4th dimension of vector to w value if it exists', () => {
      v = new mockP5.Vector(1, 2, 3, 4);
      v.w = 7;
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
      expect(v.w).toBe(7);
    });

    it('should throw error if trying to set w if vector dimensions is less than 4', () => {
      v = new mockP5.Vector(1, 2);
      v.w = 5;
      console.log(v);
      console.log(v.w);
      expect(v.w).toBe(0); //TODO: Check this, maybe this should fail
    });
  });

  describe('vector to string', () => {
    it('should return the string version of a vector', () => {
      v = new mockP5.Vector(1, 2, 3, 4);
      expect(v.toString()).toBe('vector[1, 2, 3, 4]');
    });
  });

  describe('set heading', () => {
    it('should rotate a 2D vector by specified angle without changing magnitude', () => {
      v = new mockP5.Vector(0, 2);
      const mag = v.mag();
      expect(v.setHeading(2 * Math.PI).mag()).toBe(mag);
      expect(v.x).toBe(2);
      expect(v.y).toBe(-4.898587196589413e-16);
    });
  });

  describe('clamp to zero', () => {
    it('should clamp values cloze to zero to zero, with Number.epsilon value', () => {
      v = new mockP5.Vector(0, 1, 0.5, 0.1, 0.0000000000000001);
      expect(v.clampToZero().values).toEqual([0, 1, 0.5, 0.1, 0]);
    });
  });

  suite('p5.Vector.fromAngles()', function () {
    it('should create a v3ctor froma pair of ISO spherical angles', () => {
      let vect = mockP5.Vector.fromAngles(0, 0);
      expect(vect.values).toEqual([0, -1, 0]);
    });
  });

  suite('p5.Vector.rotate()', function () {
    it('should rotate the vector (only 2D vectors) by the given angle; magnitude remains the same.', () => {
      v = new mockP5.Vector(0, 1, 2);
      let target = new mockP5.Vector();
      mockP5.Vector.rotate(v, 1 * Math.PI, target);
      expect(target.values).toEqual([
        -4.10759023698152e-16, -2.23606797749979, 2
      ]);
    });
    suite('deprecation warnings', function () {
      test('array() should trigger deprecation warning', function () {
        v = new mockP5.Vector(1, 2, 3);
        v.array();
        expect(mockP5._friendlyError).toHaveBeenCalledWith(
          'array() is deprecated and will be removed in a future version of p5.js; use the more flexible v.values instead of v.array()',
          'p5.Vector.array'
        );
      });

      test('static array() should delegate to instance array()', function () {
        v = new mockP5.Vector(1, 2, 3);
        const spy = vi.spyOn(v, 'array');
        mockP5.Vector.array(v);
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
