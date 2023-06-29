suite('p5.Vector', function() {
  var RADIANS = 'radians';
  var DEGREES = 'degrees';

  var myp5;
  var v;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.setHeading() RADIANS', function() {
    setup(function() {
      myp5.angleMode(RADIANS);
      v = myp5.createVector(1, 1);
      v.setHeading(1);
    });
    test('should have heading() value of 1 (RADIANS)', function() {
      assert.closeTo(v.heading(), 1, 0.001);
    });
  });

  suite('p5.prototype.setHeading() DEGREES', function() {
    setup(function() {
      myp5.angleMode(DEGREES);
      v = myp5.createVector(1, 1);
      v.setHeading(1);
    });
    test('should have heading() value of 1 (DEGREES)', function() {
      assert.closeTo(v.heading(), 1, 0.001);
    });
  });

  suite('p5.prototype.createVector()', function() {
    setup(function() {
      v = myp5.createVector();
    });
    test('should create instance of p5.Vector', function() {
      assert.instanceOf(v, p5.Vector);
    });

    test('should have x, y, z be initialized to 0', function() {
      assert.equal(v.x, 0);
      assert.equal(v.y, 0);
      assert.equal(v.z, 0);
    });
  });

  suite('p5.prototype.createVector(1, 2, 3)', function() {
    setup(function() {
      v = myp5.createVector(1, 2, 3);
    });

    test('should have x, y, z be initialized to 1,2,3', function() {
      assert.equal(v.x, 1);
      assert.equal(v.y, 2);
      assert.equal(v.z, 3);
    });
  });

  suite('new p5.Vector()', function() {
    setup(function() {
      v = new p5.Vector();
    });
    test('should set constant to DEGREES', function() {
      assert.instanceOf(v, p5.Vector);
    });

    test('should have x, y, z be initialized to 0', function() {
      assert.equal(v.x, 0);
      assert.equal(v.y, 0);
      assert.equal(v.z, 0);
    });
  });

  suite('new p5.Vector(1, 2, 3)', function() {
    setup(function() {
      v = new p5.Vector(1, 2, 3);
    });

    test('should have x, y, z be initialized to 1,2,3', function() {
      assert.equal(v.x, 1);
      assert.equal(v.y, 2);
      assert.equal(v.z, 3);
    });
  });

  suite('new p5.Vector(1,2,undefined)', function() {
    setup(function() {
      v = new p5.Vector(1, 2, undefined);
    });

    test('should have x, y, z be initialized to 1,2,0', function() {
      assert.equal(v.x, 1);
      assert.equal(v.y, 2);
      assert.equal(v.z, 0);
    });
  });

  suite('rotate', function() {
    suite('p5.Vector.prototype.rotate() [INSTANCE]', function() {
      test('should return the same object', function() {
        v = myp5.createVector(0, 1);
        expect(v.rotate(Math.PI)).to.eql(v);
      });

      suite('radians', function() {
        setup(function() {
          myp5.angleMode(RADIANS);
        });

        test('should rotate the vector [0, 1, 0] by pi radians to [0, -1, 0]', function() {
          v = myp5.createVector(0, 1, 0);
          v.rotate(Math.PI);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });

        test('should rotate the vector [1, 0, 0] by -pi/2 radians to [0, -1, 0]', function() {
          v = myp5.createVector(1, 0, 0);
          v.rotate(-Math.PI / 2);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });

        test('should rotate the vector [1, 0, 0] by pi radians to [-1, 0, 0]', function() {
          v = myp5.createVector(1, 0, 0);
          v.rotate(Math.PI);
          expect(v.x).to.be.closeTo(-1, 0.01);
          expect(v.y).to.be.closeTo(0, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });
      });

      suite('degrees', function() {
        setup(function() {
          myp5.angleMode(DEGREES);
        });

        test('should rotate the vector [0, 1, 0] by 180 degrees to [0, -1, 0]', function() {
          v = myp5.createVector(0, 1, 0);
          v.rotate(180);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });

        test('should rotate the vector [1, 0, 0] by -90 degrees to [0, -1, 0]', function() {
          v = myp5.createVector(1, 0, 0);
          v.rotate(-90);
          expect(v.x).to.be.closeTo(0, 0.01);
          expect(v.y).to.be.closeTo(-1, 0.01);
          expect(v.z).to.be.closeTo(0, 0.01);
        });
      });
    });

    suite('p5.Vector.rotate() [CLASS]', function() {
      setup(function() {
        myp5.angleMode(RADIANS);
      });

      test('should not change the original object', function() {
        v = myp5.createVector(1, 0, 0);
        p5.Vector.rotate(v, Math.PI / 2);
        expect(v.x).to.equal(1);
        expect(v.y).to.equal(0);
        expect(v.z).to.equal(0);
      });

      test('should rotate the vector [0, 1, 0] by pi radians to [0, -1, 0]', function() {
        v = myp5.createVector(0, 1, 0);
        const v1 = p5.Vector.rotate(v, Math.PI);
        expect(v1.x).to.be.closeTo(0, 0.01);
        expect(v1.y).to.be.closeTo(-1, 0.01);
        expect(v1.z).to.be.closeTo(0, 0.01);
      });

      test('should rotate the vector [1, 0, 0] by -pi/2 radians to [0, -1, 0]', function() {
        v = myp5.createVector(1, 0, 0);
        const v1 = p5.Vector.rotate(v, -Math.PI / 2);
        expect(v1.x).to.be.closeTo(0, 0.01);
        expect(v1.y).to.be.closeTo(-1, 0.01);
        expect(v1.z).to.be.closeTo(0, 0.01);
      });
    });
  });

  suite('angleBetween', function() {
    let v1, v2;
    setup(function() {
      v1 = new p5.Vector(1, 0, 0);
      v2 = new p5.Vector(2, 2, 0);
    });

    suite('p5.Vector.prototype.angleBetween() [INSTANCE]', function() {
      test('should return a Number', function() {
        const res = v1.angleBetween(v2);
        expect(typeof res).to.eql('number');
      });

      test('should not trip on rounding issues in 2D space', function() {
        v1 = new p5.Vector(-11, -20);
        v2 = new p5.Vector(-5.5, -10);
        const v3 = new p5.Vector(5.5, 10);

        expect(v1.angleBetween(v2)).to.be.closeTo(0, 0.00001);
        expect(v1.angleBetween(v3)).to.be.closeTo(Math.PI, 0.00001);
      });

      test('should not trip on rounding issues in 3D space', function() {
        v1 = new p5.Vector(1, 1.1, 1.2);
        v2 = new p5.Vector(2, 2.2, 2.4);
        expect(v1.angleBetween(v2)).to.be.closeTo(0, 0.00001);
      });

      test('should return NaN for zero vector', function() {
        v1 = new p5.Vector(0, 0, 0);
        v2 = new p5.Vector(2, 3, 4);
        expect(v1.angleBetween(v2)).to.be.NaN;
        expect(v2.angleBetween(v1)).to.be.NaN;
      });

      test('between [1,0,0] and [1,0,0] should be 0 degrees', function() {
        myp5.angleMode(DEGREES);
        v1 = myp5.createVector(1, 0, 0);
        v2 = myp5.createVector(1, 0, 0);
        expect(v1.angleBetween(v2)).to.equal(0);
      });

      test('between [0,3,0] and [0,-3,0] should be 180 degrees', function() {
        myp5.angleMode(DEGREES);
        v1 = myp5.createVector(0, 3, 0);
        v2 = myp5.createVector(0, -3, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(180, 0.01);
      });

      test('between [1,0,0] and [2,2,0] should be 1/4 PI radians', function() {
        v1 = new p5.Vector(1, 0, 0);
        v2 = new p5.Vector(2, 2, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(Math.PI / 4, 0.01);
        expect(v2.angleBetween(v1)).to.be.closeTo(-1 * Math.PI / 4, 0.01);
      });

      test('between [2,0,0] and [-2,0,0] should be PI radians', function() {
        v1 = new p5.Vector(2, 0, 0);
        v2 = new p5.Vector(-2, 0, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(Math.PI, 0.01);
      });

      test('between [2,0,0] and [-2,-2,0] should be -3/4 PI radians  ', function() {
        v1 = new p5.Vector(2, 0, 0);
        v2 = new p5.Vector(-2, -2, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(
          -1 * (Math.PI / 2 + Math.PI / 4),
          0.01
        );
      });

      test('between [-2,-2,0] and [2,0,0] should be 3/4 PI radians', function() {
        v1 = new p5.Vector(-2, -2, 0);
        v2 = new p5.Vector(2, 0, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(
          Math.PI / 2 + Math.PI / 4,
          0.01
        );
      });

      test('For the same vectors, the angle between them should always be 0.', function() {
        v1 = myp5.createVector(288, 814);
        v2 = myp5.createVector(288, 814);
        expect(v1.angleBetween(v2)).to.equal(0);
      });

      test('The angle between vectors pointing in opposite is always PI.', function() {
        v1 = myp5.createVector(219, 560);
        v2 = myp5.createVector(-219, -560);
        expect(v1.angleBetween(v2)).to.be.closeTo(Math.PI, 0.0000001);
      });
    });

    suite('p5.Vector.angleBetween() [CLASS]', function() {
      test('should return NaN for zero vector', function() {
        v1 = new p5.Vector(0, 0, 0);
        v2 = new p5.Vector(2, 3, 4);
        expect(p5.Vector.angleBetween(v1, v2)).to.be.NaN;
        expect(p5.Vector.angleBetween(v2, v1)).to.be.NaN;
      });

      test('between [1,0,0] and [0,-1,0] should be -90 degrees', function() {
        myp5.angleMode(DEGREES);
        v1 = myp5.createVector(1, 0, 0);
        v2 = myp5.createVector(0, -1, 0);
        expect(p5.Vector.angleBetween(v1, v2)).to.be.closeTo(-90, 0.01);
      });

      test('between [0,3,0] and [0,-3,0] should be PI radians', function() {
        v1 = new p5.Vector(0, 3, 0);
        v2 = new p5.Vector(0, -3, 0);
        expect(p5.Vector.angleBetween(v1, v2)).to.be.closeTo(Math.PI, 0.01);
      });
    });
  });

  suite('set()', function() {
    suite('with p5.Vector', function() {
      test("should have x, y, z be initialized to the vector's x, y, z", function() {
        v.set(new p5.Vector(2, 5, 6));
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('with Array', function() {
      test('[2,4] should set x === 2, y === 4, z === 0', function() {
        v.set([2, 4]);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(0);
      });

      test("should have x, y, z be initialized to the array's 0,1,2 index", function() {
        v.set([2, 5, 6]);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('set(1,2,3)', function() {
      test('should have x, y, z be initialized to the 1, 2, 3', function() {
        v.set(1, 2, 3);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(2);
        expect(v.z).to.eql(3);
      });
    });
  });

  suite('copy', function() {
    setup(function() {
      v = new p5.Vector(2, 3, 4);
    });

    suite('p5.Vector.prototype.copy() [INSTANCE]', function() {
      test('should not return the same instance', function() {
        var newObject = v.copy();
        expect(newObject).to.not.equal(v);
      });

      test("should return the calling object's x, y, z", function() {
        var newObject = v.copy();
        expect(newObject.x).to.eql(2);
        expect(newObject.y).to.eql(3);
        expect(newObject.z).to.eql(4);
      });
    });

    suite('p5.Vector.copy() [CLASS]', function() {
      test('should not return the same instance', function() {
        var newObject = p5.Vector.copy(v);
        expect(newObject).to.not.equal(v);
      });

      test("should return the passed object's x, y, z", function() {
        var newObject = p5.Vector.copy(v);
        expect(newObject.x).to.eql(2);
        expect(newObject.y).to.eql(3);
        expect(newObject.z).to.eql(4);
      });
    });
  });

  suite('add()', function() {
    setup(function() {
      v = new p5.Vector();
    });

    suite('with p5.Vector', function() {
      test('should add x, y, z  from the vector argument', function() {
        v.add(new p5.Vector(1, 5, 6));
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('with Array', function() {
      suite('add([2, 4])', function() {
        test('should add the x and y components', function() {
          v.add([2, 4]);
          expect(v.x).to.eql(2);
          expect(v.y).to.eql(4);
          expect(v.z).to.eql(0);
        });
      });

      test("should add the array's 0,1,2 index", function() {
        v.add([2, 5, 6]);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(6);
      });
    });

    suite('add(3,5)', function() {
      test('should add the x and y components', function() {
        v.add(3, 5);
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(0);
      });
    });

    suite('add(2,3,4)', function() {
      test('should add the x, y, z components', function() {
        v.add(5, 5, 5);
        expect(v.x).to.eql(5);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(5);
      });
    });

    suite('p5.Vector.add(v1, v2)', function() {
      var v1, v2, res;
      setup(function() {
        v1 = new p5.Vector(2, 0, 3);
        v2 = new p5.Vector(0, 1, 3);
        res = p5.Vector.add(v1, v2);
      });

      test('should return neither v1 nor v2', function() {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should be sum of the two p5.Vectors', function() {
        expect(res.x).to.eql(v1.x + v2.x);
        expect(res.y).to.eql(v1.y + v2.y);
        expect(res.z).to.eql(v1.z + v2.z);
      });
    });
  });

  suite('rem()', function() {
    setup(function() {
      v = myp5.createVector(3, 4, 5);
    });

    test('should give same vector if nothing passed as parameter', function() {
      v.rem();
      expect(v.x).to.eql(3);
      expect(v.y).to.eql(4);
      expect(v.z).to.eql(5);
    });

    test('should give correct output if passed only one numeric value', function() {
      v.rem(2);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(0);
      expect(v.z).to.eql(1);
    });

    test('should give correct output if passed two numeric value', function() {
      v.rem(2, 3);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(5);
    });

    test('should give correct output if passed three numeric value', function() {
      v.rem(2, 3, 4);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    suite('with p5.Vector', function() {
      test('should return correct output if only one component is non-zero', function() {
        v.rem(new p5.Vector(0, 0, 4));
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(1);
      });

      test('should return correct output if x component is zero', () => {
        v.rem(new p5.Vector(0, 3, 4));
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(1);
      });

      test('should return correct output if all components are non-zero', () => {
        v.rem(new p5.Vector(2, 3, 4));
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(1);
      });

      test('should return same vector if all components are zero', () => {
        v.rem(new p5.Vector(0, 0, 0));
        expect(v.x).to.eql(3);
        expect(v.y).to.eql(4);
        expect(v.z).to.eql(5);
      });
    });

    suite('with negative vectors', function() {
      let v;
      setup(function() {
        v = new p5.Vector(-15, -5, -2);
      });
      test('should return correct output', () => {
        v.rem(new p5.Vector(2, 3, 3));
        expect(v.x).to.eql(-1);
        expect(v.y).to.eql(-2);
        expect(v.z).to.eql(-2);
      });
    });

    suite('with Arrays', function() {
      test('should return remainder of vector components for 3D vector', function() {
        v.rem([2, 3, 0]);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(5);
      });
      test('should return remainder of vector components for 2D vector', function() {
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

    suite('p5.Vector.rem(v1,v2)', function() {
      let v1, v2, res;
      setup(function() {
        v1 = new p5.Vector(2, 3, 4);
        v2 = new p5.Vector(1, 2, 3);
        res = p5.Vector.rem(v1, v2);
      });

      test('should return neither v1 nor v2', function() {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should be v1 % v2', function() {
        expect(res.x).to.eql(v1.x % v2.x);
        expect(res.y).to.eql(v1.y % v2.y);
        expect(res.z).to.eql(v1.z % v2.z);
      });
    });
  });

  suite('sub()', function() {
    setup(function() {
      v.x = 0;
      v.y = 0;
      v.z = 0;
    });
    suite('with p5.Vector', function() {
      test('should sub x, y, z  from the vector argument', function() {
        v.sub(new p5.Vector(2, 5, 6));
        expect(v.x).to.eql(-2);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(-6);
      });
    });

    suite('with Array', function() {
      suite('sub([2, 4])', function() {
        test('should sub the x and y components', function() {
          v.sub([2, 4]);
          expect(v.x).to.eql(-2);
          expect(v.y).to.eql(-4);
          expect(v.z).to.eql(0);
        });
      });

      test("should subtract from the array's 0,1,2 index", function() {
        v.sub([2, 5, 6]);
        expect(v.x).to.eql(-2);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(-6);
      });
    });

    suite('sub(3,5)', function() {
      test('should subtract the x and y components', function() {
        v.sub(3, 5);
        expect(v.x).to.eql(-3);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(0);
      });
    });

    suite('sub(2,3,4)', function() {
      test('should subtract the x, y, z components', function() {
        v.sub(5, 5, 5);
        expect(v.x).to.eql(-5);
        expect(v.y).to.eql(-5);
        expect(v.z).to.eql(-5);
      });
    });

    suite('p5.Vector.sub(v1, v2)', function() {
      var v1, v2, res;
      setup(function() {
        v1 = new p5.Vector(2, 0, 3);
        v2 = new p5.Vector(0, 1, 3);
        res = p5.Vector.sub(v1, v2);
      });

      test('should return neither v1 nor v2', function() {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should be v1 - v2', function() {
        expect(res.x).to.eql(v1.x - v2.x);
        expect(res.y).to.eql(v1.y - v2.y);
        expect(res.z).to.eql(v1.z - v2.z);
      });
    });
  });

  suite('mult()', function() {
    setup(function() {
      v = new p5.Vector(1, 1, 1);
    });

    test('should return the same object', function() {
      expect(v.mult(1)).to.eql(v);
    });

    test('should not change x, y, z if no argument is given', function() {
      v.mult();
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    test('should not change x, y, z if n is not a finite number', function() {
      v.mult(NaN);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    suite('with scalar', function() {
      test('multiply the x, y, z with the scalar', function() {
        v.mult(2);
        expect(v.x).to.eql(2);
        expect(v.y).to.eql(2);
        expect(v.z).to.eql(2);
      });
    });

    suite('v0.mult(v1)', function() {
      var v0, v1;
      setup(function() {
        v0 = new p5.Vector(1, 2, 3);
        v1 = new p5.Vector(2, 3, 4);
        v0.mult(v1);
      });

      test('should do component wise multiplication', function() {
        expect(v0.x).to.eql(2);
        expect(v0.y).to.eql(6);
        expect(v0.z).to.eql(12);
      });
    });

    suite('v0.mult(arr)', function() {
      var v0, arr;
      setup(function() {
        v0 = new p5.Vector(1, 2, 3);
        arr = [2, 3, 4];
        v0.mult(arr);
      });

      test('should do component wise multiplication from an array', function() {
        expect(v0.x).to.eql(2);
        expect(v0.y).to.eql(6);
        expect(v0.z).to.eql(12);
      });
    });

    suite('p5.Vector.mult(v, n)', function() {
      var v, res;
      setup(function() {
        v = new p5.Vector(1, 2, 3);
        res = p5.Vector.mult(v, 4);
      });

      test('should return a new p5.Vector', function() {
        expect(res).to.not.eql(v);
      });

      test('should multiply the scalar', function() {
        expect(res.x).to.eql(4);
        expect(res.y).to.eql(8);
        expect(res.z).to.eql(12);
      });
    });

    suite('p5.Vector.mult(v, v', function() {
      var v0, v1, res;
      setup(function() {
        v0 = new p5.Vector(1, 2, 3);
        v1 = new p5.Vector(2, 3, 4);
        res = p5.Vector.mult(v0, v1);
      });

      test('should return new vector from component wise multiplication', function() {
        expect(res.x).to.eql(2);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(12);
      });
    });

    suite('p5.Vector.mult(v, arr', function() {
      var v0, arr, res;
      setup(function() {
        v0 = new p5.Vector(1, 2, 3);
        arr = [2, 3, 4];
        res = p5.Vector.mult(v0, arr);
      });

      test('should return new vector from component wise multiplication with an array', function() {
        expect(res.x).to.eql(2);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(12);
      });
    });
  });

  suite('div()', function() {
    setup(function() {
      v = new p5.Vector(1, 1, 1);
    });

    test('should return the same object', function() {
      expect(v.div(1)).to.eql(v);
    });

    test('should not change x, y, z if no argument is given', function() {
      v.div();
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    test('should not change x, y, z if n is not a finite number', function() {
      v.div(NaN);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(1);
      expect(v.z).to.eql(1);
    });

    suite('with scalar', function() {
      test('divide the x, y, z with the scalar', function() {
        v.div(2);
        expect(v.x).to.be.closeTo(0.5, 0.01);
        expect(v.y).to.be.closeTo(0.5, 0.01);
        expect(v.z).to.be.closeTo(0.5, 0.01);
      });

      test('should not change x, y, z if n is 0', function() {
        v.div(0);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(1);
      });
    });

    suite('p5.Vector.div(v, n)', function() {
      var v, res;
      setup(function() {
        v = new p5.Vector(1, 1, 1);
        res = p5.Vector.div(v, 4);
      });

      test('should not be undefined', function() {
        expect(res).to.not.eql(undefined);
      });

      test('should return a new p5.Vector', function() {
        expect(res).to.not.eql(v);
      });

      test('should divide the scalar', function() {
        expect(res.x).to.eql(0.25);
        expect(res.y).to.eql(0.25);
        expect(res.z).to.eql(0.25);
      });
    });

    suite('v0.div(v1)', function() {
      var v0, v1, v2, v3;
      setup(function() {
        v0 = new p5.Vector(2, 6, 9);
        v1 = new p5.Vector(2, 2, 3);
        v2 = new p5.Vector(1, 1, 1);
        v3 = new p5.Vector(0, 0, 0);

        v0.div(v1);
      });

      test('should do component wise division', function() {
        expect(v0.x).to.eql(1);
        expect(v0.y).to.eql(3);
        expect(v0.z).to.eql(3);
      });

      test('should not change x, y, z if v3 is all 0', function() {
        v2.div(v3);
        expect(v2.x).to.eql(1);
        expect(v2.y).to.eql(1);
        expect(v2.z).to.eql(1);
      });

      test('should work on 2D vectors', function() {
        const v = new p5.Vector(1, 1);
        const divisor = new p5.Vector(2, 2);
        v.div(divisor);
        expect(v.x).to.eql(0.5);
        expect(v.y).to.eql(0.5);
        expect(v.z).to.eql(0);
      });

      test('should work when the dividend has 0', function() {
        const v = new p5.Vector(1, 0);
        const divisor = new p5.Vector(2, 2);
        v.div(divisor);
        expect(v.x).to.eql(0.5);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });

      test('should do nothing when the divisor has 0', function() {
        const v = new p5.Vector(1, 1);
        const divisor = new p5.Vector(0, 2);
        v.div(divisor);
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(1);
        expect(v.z).to.eql(0);
      });
    });

    suite('v0.div(arr)', function() {
      var v0, v1, arr;
      setup(function() {
        v0 = new p5.Vector(2, 6, 9);
        v1 = new p5.Vector(1, 1, 1);
        arr = [2, 2, 3];
        v0.div(arr);
      });

      test('should do component wise division with an array', function() {
        expect(v0.x).to.eql(1);
        expect(v0.y).to.eql(3);
        expect(v0.z).to.eql(3);
      });

      test('should not change x, y, z if array contains 0', function() {
        v1.div([0, 0, 0]);
        expect(v1.x).to.eql(1);
        expect(v1.y).to.eql(1);
        expect(v1.z).to.eql(1);
      });
    });

    suite('p5.Vector.div(v, v', function() {
      var v0, v1, res;
      setup(function() {
        v0 = new p5.Vector(2, 6, 9);
        v1 = new p5.Vector(2, 2, 3);
        res = p5.Vector.div(v0, v1);
      });

      test('should return new vector from component wise division', function() {
        expect(res.x).to.eql(1);
        expect(res.y).to.eql(3);
        expect(res.z).to.eql(3);
      });
    });

    suite('p5.Vector.div(v, arr', function() {
      var v0, arr, res;
      setup(function() {
        v0 = new p5.Vector(2, 6, 9);
        arr = [2, 2, 3];
        res = p5.Vector.div(v0, arr);
      });

      test('should return new vector from component wise division with an array', function() {
        expect(res.x).to.eql(1);
        expect(res.y).to.eql(3);
        expect(res.z).to.eql(3);
      });
    });
  });

  suite('dot', function() {
    setup(function() {
      v.x = 1;
      v.y = 1;
      v.z = 1;
    });

    test('should return a number', function() {
      expect(typeof v.dot(new p5.Vector()) === 'number').to.eql(true);
    });

    suite('with p5.Vector', function() {
      test('should be the dot product of the vector', function() {
        expect(v.dot(new p5.Vector(2, 2))).to.eql(4);
      });
    });

    suite('with x, y, z', function() {
      test('should be the dot product with x, y', function() {
        expect(v.dot(2, 2)).to.eql(4);
      });

      test('should be the dot product with x, y, z', function() {
        expect(v.dot(2, 2, 2)).to.eql(6);
      });
    });

    suite('p5.Vector.dot(v, n)', function() {
      var v1, v2, res;
      setup(function() {
        v1 = new p5.Vector(1, 1, 1);
        v2 = new p5.Vector(2, 3, 4);
        res = p5.Vector.dot(v1, v2);
      });

      test('should return a number', function() {
        expect(typeof res === 'number').to.eql(true);
      });

      test('should be the dot product of the two vectors', function() {
        expect(res).to.eql(9);
      });
    });
  });

  suite('cross', function() {
    var res;
    setup(function() {
      v.x = 1;
      v.y = 1;
      v.z = 1;
    });

    test('should return a new product', function() {
      expect(v.cross(new p5.Vector())).to.not.eql(v);
    });

    suite('with p5.Vector', function() {
      test('should cross x, y, z  from the vector argument', function() {
        res = v.cross(new p5.Vector(2, 5, 6));
        expect(res.x).to.eql(1); //this.y * v.z - this.z * v.y
        expect(res.y).to.eql(-4); //this.z * v.x - this.x * v.z
        expect(res.z).to.eql(3); //this.x * v.y - this.y * v.x
      });
    });

    suite('p5.Vector.cross(v1, v2)', function() {
      var v1, v2, res;
      setup(function() {
        v1 = new p5.Vector(3, 6, 9);
        v2 = new p5.Vector(1, 1, 1);
        res = p5.Vector.cross(v1, v2);
      });

      test('should not be undefined', function() {
        expect(res).to.not.eql(undefined);
      });

      test('should return neither v1 nor v2', function() {
        expect(res).to.not.eql(v1);
        expect(res).to.not.eql(v2);
      });

      test('should the cross product of v1 and v2', function() {
        expect(res.x).to.eql(-3);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(-3);
      });
    });
  });

  suite('dist', function() {
    var b, c;
    setup(function() {
      v.x = 0;
      v.y = 0;
      v.z = 1;
      b = new p5.Vector(0, 0, 5);
      c = new p5.Vector(3, 4, 1);
    });

    test('should return a number', function() {
      expect(typeof v.dist(b) === 'number').to.eql(true);
    });

    test('should return distance between two vectors', function() {
      expect(v.dist(b)).to.eql(4);
    });

    test('should return distance between two vectors', function() {
      expect(v.dist(c)).to.eql(5);
    });

    test('should be commutative', function() {
      expect(b.dist(c)).to.eql(c.dist(b));
    });
  });

  suite('p5.Vector.dist(v1, v2)', function() {
    var v1, v2;
    setup(function() {
      v1 = new p5.Vector(0, 0, 0);
      v2 = new p5.Vector(0, 3, 4);
    });

    test('should return a number', function() {
      expect(typeof p5.Vector.dist(v1, v2) === 'number').to.eql(true);
    });

    test('should be commutative', function() {
      expect(p5.Vector.dist(v1, v2)).to.eql(p5.Vector.dist(v2, v1));
    });
  });

  suite('normalize', function() {
    suite('p5.Vector.prototype.normalize() [INSTANCE]', function() {
      setup(function() {
        v = myp5.createVector(1, 1, 1);
      });

      test('should return the same object', function() {
        expect(v.normalize()).to.eql(v);
      });

      test('unit vector should not change values', function() {
        v.x = 1;
        v.y = 0;
        v.z = 0;
        v.normalize();
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });

      test('2,2,1 should normalize to ~0.66,0.66,0.33', function() {
        v.x = 2;
        v.y = 2;
        v.z = 1;
        v.normalize();
        expect(v.x).to.be.closeTo(0.6666, 0.01);
        expect(v.y).to.be.closeTo(0.6666, 0.01);
        expect(v.z).to.be.closeTo(0.3333, 0.01);
      });
    });

    suite('p5.Vector.normalize(v) [CLASS]', function() {
      var res;
      setup(function() {
        v = myp5.createVector(1, 0, 0);
        res = p5.Vector.normalize(v);
      });

      test('should not be undefined', function() {
        expect(res).to.not.eql(undefined);
      });

      test('should not return same object v', function() {
        expect(res).to.not.equal(v);
      });

      test('unit vector 1,0,0 should normalize to 1,0,0', function() {
        expect(res.x).to.eql(1);
        expect(res.y).to.eql(0);
        expect(res.z).to.eql(0);
      });

      test('2,2,1 should normalize to ~0.66,0.66,0.33', function() {
        v.x = 2;
        v.y = 2;
        v.z = 1;
        res = p5.Vector.normalize(v);
        expect(res.x).to.be.closeTo(0.6666, 0.01);
        expect(res.y).to.be.closeTo(0.6666, 0.01);
        expect(res.z).to.be.closeTo(0.3333, 0.01);
      });
    });
  });

  suite('limit', function() {
    let v;

    setup(function() {
      v = new p5.Vector(5, 5, 5);
    });

    suite('p5.Vector.prototype.limit() [INSTANCE]', function() {
      test('should return the same object', function() {
        expect(v.limit()).to.equal(v);
      });

      suite('with a vector larger than the limit', function() {
        test('should limit the vector', function() {
          v.limit(1);
          expect(v.x).to.be.closeTo(0.5773, 0.01);
          expect(v.y).to.be.closeTo(0.5773, 0.01);
          expect(v.z).to.be.closeTo(0.5773, 0.01);
        });
      });

      suite('with a vector smaller than the limit', function() {
        test('should not limit the vector', function() {
          v.limit(8.67);
          expect(v.x).to.eql(5);
          expect(v.y).to.eql(5);
          expect(v.z).to.eql(5);
        });
      });
    });

    suite('p5.Vector.limit() [CLASS]', function() {
      test('should not return the same object', function() {
        expect(p5.Vector.limit(v)).to.not.equal(v);
      });

      suite('with a vector larger than the limit', function() {
        test('should limit the vector', function() {
          const res = p5.Vector.limit(v, 1);
          expect(res.x).to.be.closeTo(0.5773, 0.01);
          expect(res.y).to.be.closeTo(0.5773, 0.01);
          expect(res.z).to.be.closeTo(0.5773, 0.01);
        });
      });

      suite('with a vector smaller than the limit', function() {
        test('should not limit the vector', function() {
          const res = p5.Vector.limit(v, 8.67);
          expect(res.x).to.eql(5);
          expect(res.y).to.eql(5);
          expect(res.z).to.eql(5);
        });
      });

      suite('when given a target vector', function() {
        test('should store limited vector in the target', function() {
          const target = new p5.Vector(0, 0, 0);
          p5.Vector.limit(v, 1, target);
          expect(target.x).to.be.closeTo(0.5773, 0.01);
          expect(target.y).to.be.closeTo(0.5773, 0.01);
          expect(target.z).to.be.closeTo(0.5773, 0.01);
        });
      });
    });
  });

  suite('setMag', function() {
    let v;

    setup(function() {
      v = new p5.Vector(1, 0, 0);
    });

    suite('p5.Vector.setMag() [INSTANCE]', function() {
      test('should return the same object', function() {
        expect(v.setMag(2)).to.equal(v);
      });

      test('should set the magnitude of the vector', function() {
        v.setMag(4);
        expect(v.x).to.eql(4);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });

      test('should set the magnitude of the vector', function() {
        v.x = 2;
        v.y = 3;
        v.z = -6;
        v.setMag(14);
        expect(v.x).to.eql(4);
        expect(v.y).to.eql(6);
        expect(v.z).to.eql(-12);
      });
    });

    suite('p5.Vector.prototype.setMag() [CLASS]', function() {
      test('should not return the same object', function() {
        expect(p5.Vector.setMag(v, 2)).to.not.equal(v);
      });

      test('should set the magnitude of the vector', function() {
        const res = p5.Vector.setMag(v, 4);
        expect(res.x).to.eql(4);
        expect(res.y).to.eql(0);
        expect(res.z).to.eql(0);
      });

      test('should set the magnitude of the vector', function() {
        v.x = 2;
        v.y = 3;
        v.z = -6;
        const res = p5.Vector.setMag(v, 14);
        expect(res.x).to.eql(4);
        expect(res.y).to.eql(6);
        expect(res.z).to.eql(-12);
      });

      suite('when given a target vector', function() {
        test('should set the magnitude on the target', function() {
          const target = new p5.Vector(0, 1, 0);
          const res = p5.Vector.setMag(v, 4, target);
          expect(target).to.equal(res);
          expect(target.x).to.eql(4);
          expect(target.y).to.eql(0);
          expect(target.z).to.eql(0);
        });
      });
    });
  });

  suite('heading', function() {
    setup(function() {
      v = myp5.createVector();
    });

    suite('p5.Vector.prototype.heading() [INSTANCE]', function() {
      test('should return a number', function() {
        expect(typeof v.heading() === 'number').to.eql(true);
      });

      test('heading for vector pointing right is 0', function() {
        v.x = 1;
        v.y = 0;
        v.z = 0;
        expect(v.heading()).to.be.closeTo(0, 0.01);
      });

      test('heading for vector pointing down is PI/2', function() {
        v.x = 0;
        v.y = 1;
        v.z = 0;
        expect(v.heading()).to.be.closeTo(Math.PI / 2, 0.01);
      });

      test('heading for vector pointing left is PI', function() {
        v.x = -1;
        v.y = 0;
        v.z = 0;
        expect(v.heading()).to.be.closeTo(Math.PI, 0.01);
      });

      suite('with `angleMode(DEGREES)`', function() {
        setup(function() {
          myp5.angleMode(DEGREES);
        });

        test('heading for vector pointing right is 0', function() {
          v.x = 1;
          v.y = 0;
          v.z = 0;
          expect(v.heading()).to.equal(0);
        });

        test('heading for vector pointing down is 90', function() {
          v.x = 0;
          v.y = 1;
          v.z = 0;
          expect(v.heading()).to.equal(90);
        });

        test('heading for vector pointing left is 180', function() {
          v.x = -1;
          v.y = 0;
          v.z = 0;
          expect(v.heading()).to.equal(180);
        });
      });
    });

    suite('p5.Vector.heading() [CLASS]', function() {
      test('should return a number', function() {
        expect(typeof p5.Vector.heading(v) === 'number').to.eql(true);
      });

      test('heading for vector pointing right is 0', function() {
        v.x = 1;
        v.y = 0;
        v.z = 0;
        expect(p5.Vector.heading(v)).to.be.closeTo(0, 0.01);
      });

      test('heading for vector pointing down is PI/2', function() {
        v.x = 0;
        v.y = 1;
        v.z = 0;
        expect(p5.Vector.heading(v)).to.be.closeTo(Math.PI / 2, 0.01);
      });

      test('heading for vector pointing left is PI', function() {
        v.x = -1;
        v.y = 0;
        v.z = 0;
        expect(p5.Vector.heading(v)).to.be.closeTo(Math.PI, 0.01);
      });
    });
  });

  suite('lerp', function() {
    test('should return the same object', function() {
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

    suite('with x, y, z, amt', function() {
      setup(function() {
        v.x = 0;
        v.y = 0;
        v.z = 0;
        v.lerp(2, 2, 2, 0.5);
      });

      test('should lerp x by amt', function() {
        expect(v.x).to.eql(1);
      });

      test('should lerp y by amt', function() {
        expect(v.y).to.eql(1);
      });

      test('should lerp z by amt', function() {
        expect(v.z).to.eql(1);
      });
    });

    suite('with no amt', function() {
      test('should assume 0 amt', function() {
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

  suite('p5.Vector.lerp(v1, v2, amt)', function() {
    var res, v1, v2;
    setup(function() {
      v1 = new p5.Vector(0, 0, 0);
      v2 = new p5.Vector(2, 2, 2);
      res = p5.Vector.lerp(v1, v2, 0.5);
    });

    test('should not be undefined', function() {
      expect(res).to.not.eql(undefined);
    });

    test('should be a p5.Vector', function() {
      expect(res).to.be.an.instanceof(p5.Vector);
    });

    test('should return neither v1 nor v2', function() {
      expect(res).to.not.eql(v1);
      expect(res).to.not.eql(v2);
    });

    test('should res to be [1, 1, 1]', function() {
      expect(res.x).to.eql(1);
      expect(res.y).to.eql(1);
      expect(res.z).to.eql(1);
    });
  });

  suite('v.slerp(w, amt)', function() {
    var w;
    setup(function() {
      v.set(1, 2, 3);
      w = new p5.Vector(4, 6, 8);
    });

    test('if amt is 0, returns original vector', function() {
      v.slerp(w, 0);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(2);
      expect(v.z).to.eql(3);
    });

    test('if amt is 1, returns argument vector', function() {
      v.slerp(w, 1);
      expect(v.x).to.eql(4);
      expect(v.y).to.eql(6);
      expect(v.z).to.eql(8);
    });

    test('if both v and w are 2D, then result will also be 2D.', function() {
      v.set(2, 3, 0);
      w.set(3, -2, 0);
      v.slerp(w, 0.3);
      expect(v.z).to.eql(0);

      v.set(1, 4, 0);
      w.set(-1, -4, 0);
      v.slerp(w, 0.8);
      expect(v.z).to.eql(0);
    });

    test('if one side is a zero vector, linearly interpolate.', function() {
      v.set(0, 0, 0);
      w.set(2, 4, 6);
      v.slerp(w, 0.5);
      expect(v.x).to.eql(1);
      expect(v.y).to.eql(2);
      expect(v.z).to.eql(3);
    });

    test('If they are pointing in the same direction, linearly interpolate.', function() {
      v.set(5, 11, 16);
      w.set(15, 33, 48);
      v.slerp(w, 0.5);
      expect(v.x).to.eql(10);
      expect(v.y).to.eql(22);
      expect(v.z).to.eql(32);
    });
  });

  suite('p5.Vector.slerp(v1, v2, amt)', function() {
    var res, v1, v2;
    setup(function() {
      v1 = new p5.Vector(1, 0, 0);
      v2 = new p5.Vector(0, 0, 1);
      res = p5.Vector.slerp(v1, v2, 1/3);
    });

    test('should not be undefined', function() {
      expect(res).to.not.eql(undefined);
    });

    test('should be a p5.Vector', function() {
      expect(res).to.be.an.instanceof(p5.Vector);
    });

    test('should return neither v1 nor v2', function() {
      expect(res).to.not.eql(v1);
      expect(res).to.not.eql(v2);
    });

    test('Make sure the interpolation in 1/3 is correct', function() {
      expect(res.x).to.be.closeTo(Math.cos(Math.PI/6), 0.00001);
      expect(res.y).to.be.closeTo(0, 0.00001);
      expect(res.z).to.be.closeTo(Math.sin(Math.PI/6), 0.00001);
    });

    test('Make sure the interpolation in -1/3 is correct', function() {
      p5.Vector.slerp(v1, v2, -1/3, res);
      expect(res.x).to.be.closeTo(Math.cos(-Math.PI/6), 0.00001);
      expect(res.y).to.be.closeTo(0, 0.00001);
      expect(res.z).to.be.closeTo(Math.sin(-Math.PI/6), 0.00001);
    });

    test('Make sure the interpolation in 5/3 is correct', function() {
      p5.Vector.slerp(v1, v2, 5/3, res);
      expect(res.x).to.be.closeTo(Math.cos(5*Math.PI/6), 0.00001);
      expect(res.y).to.be.closeTo(0, 0.00001);
      expect(res.z).to.be.closeTo(Math.sin(5*Math.PI/6), 0.00001);
    });
  });

  suite('p5.Vector.fromAngle(angle)', function() {
    var res, angle;
    setup(function() {
      angle = Math.PI / 2;
      res = p5.Vector.fromAngle(angle);
    });

    test('should be a p5.Vector with values (0,1)', function() {
      expect(res.x).to.be.closeTo(0, 0.01);
      expect(res.y).to.be.closeTo(1, 0.01);
    });
  });

  suite('p5.Vector.random2D()', function() {
    var res;
    setup(function() {
      res = p5.Vector.random2D();
    });

    test('should be a unit p5.Vector', function() {
      expect(res.mag()).to.be.closeTo(1, 0.01);
    });
  });

  suite('p5.Vector.random3D()', function() {
    var res;
    setup(function() {
      res = p5.Vector.random3D();
    });
    test('should be a unit p5.Vector', function() {
      expect(res.mag()).to.be.closeTo(1, 0.01);
    });
  });

  suite('array', function() {
    setup(function() {
      v = new p5.Vector(1, 23, 4);
    });

    suite('p5.Vector.prototype.array() [INSTANCE]', function() {
      test('should return an array', function() {
        expect(v.array()).to.be.instanceof(Array);
      });

      test('should return an with the x y and z components', function() {
        expect(v.array()).to.eql([1, 23, 4]);
      });
    });

    suite('p5.Vector.array() [CLASS]', function() {
      test('should return an array', function() {
        expect(p5.Vector.array(v)).to.be.instanceof(Array);
      });

      test('should return an with the x y and z components', function() {
        expect(p5.Vector.array(v)).to.eql([1, 23, 4]);
      });
    });
  });

  suite('reflect', function() {
    suite('p5.Vector.prototype.reflect() [INSTANCE]', function() {
      setup(function() {
        incoming_x = 1;
        incoming_y = 1;
        incoming_z = 1;
        original_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);

        x_normal = new p5.Vector(3, 0, 0);
        y_normal = new p5.Vector(0, 3, 0);
        z_normal = new p5.Vector(0, 0, 3);

        x_bounce_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);
        x_bounce_outgoing = x_bounce_incoming.reflect(x_normal);

        y_bounce_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);
        y_bounce_outgoing = y_bounce_incoming.reflect(y_normal);

        z_bounce_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);
        z_bounce_outgoing = z_bounce_incoming.reflect(z_normal);
      });

      test('should return a p5.Vector', function() {
        expect(x_bounce_incoming).to.be.an.instanceof(p5.Vector);
        expect(y_bounce_incoming).to.be.an.instanceof(p5.Vector);
        expect(z_bounce_incoming).to.be.an.instanceof(p5.Vector);
      });

      test('should update this', function() {
        assert.equal(x_bounce_incoming, x_bounce_outgoing);
        assert.equal(y_bounce_incoming, y_bounce_outgoing);
        assert.equal(z_bounce_incoming, z_bounce_outgoing);
      });

      test('x-normal should flip incoming x component and maintain y,z components', function() {
        expect(x_bounce_outgoing.x).to.be.closeTo(-1, 0.01);
        expect(x_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(x_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('y-normal should flip incoming y component and maintain x,z components', function() {
        expect(y_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(y_bounce_outgoing.y).to.be.closeTo(-1, 0.01);
        expect(y_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('z-normal should flip incoming z component and maintain x,y components', function() {
        expect(z_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.z).to.be.closeTo(-1, 0.01);
      });

      test('angle of incidence should match angle of reflection', function() {
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

    suite('p5.Vector.reflect() [CLASS]', function() {
      setup(function() {
        incoming_x = 1;
        incoming_y = 1;
        incoming_z = 1;
        original_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);
        x_target = new p5.Vector();
        y_target = new p5.Vector();
        z_target = new p5.Vector();

        x_normal = new p5.Vector(3, 0, 0);
        y_normal = new p5.Vector(0, 3, 0);
        z_normal = new p5.Vector(0, 0, 3);

        x_bounce_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);
        x_bounce_outgoing = p5.Vector.reflect(
          x_bounce_incoming,
          x_normal,
          x_target
        );

        y_bounce_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);
        y_bounce_outgoing = p5.Vector.reflect(
          y_bounce_incoming,
          y_normal,
          y_target
        );

        z_bounce_incoming = new p5.Vector(incoming_x, incoming_y, incoming_z);
        z_bounce_outgoing = p5.Vector.reflect(
          z_bounce_incoming,
          z_normal,
          z_target
        );
      });

      test('should return a p5.Vector', function() {
        expect(x_bounce_incoming).to.be.an.instanceof(p5.Vector);
        expect(y_bounce_incoming).to.be.an.instanceof(p5.Vector);
        expect(z_bounce_incoming).to.be.an.instanceof(p5.Vector);
      });

      test('should not update this', function() {
        expect(x_bounce_incoming).to.not.equal(x_bounce_outgoing);
        expect(y_bounce_incoming).to.not.equal(y_bounce_outgoing);
        expect(z_bounce_incoming).to.not.equal(z_bounce_outgoing);
      });

      test('should update target', function() {
        assert.equal(x_target, x_bounce_outgoing);
        assert.equal(y_target, y_bounce_outgoing);
        assert.equal(z_target, z_bounce_outgoing);
      });

      test('x-normal should flip incoming x component and maintain y,z components', function() {
        expect(x_bounce_outgoing.x).to.be.closeTo(-1, 0.01);
        expect(x_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(x_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('y-normal should flip incoming y component and maintain x,z components', function() {
        expect(y_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(y_bounce_outgoing.y).to.be.closeTo(-1, 0.01);
        expect(y_bounce_outgoing.z).to.be.closeTo(1, 0.01);
      });
      test('z-normal should flip incoming z component and maintain x,y components', function() {
        expect(z_bounce_outgoing.x).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.y).to.be.closeTo(1, 0.01);
        expect(z_bounce_outgoing.z).to.be.closeTo(-1, 0.01);
      });

      test('angle of incidence should match angle of reflection', function() {
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

  suite('mag', function() {
    const MAG = 3.7416573867739413; // sqrt(1*1 + 2*2 + 3*3)

    let v0;
    let v1;

    setup(function() {
      v0 = new p5.Vector(0, 0, 0);
      v1 = new p5.Vector(1, 2, 3);
    });

    suite('p5.Vector.prototype.mag() [INSTANCE]', function() {
      test('should return the magnitude of the vector', function() {
        expect(v0.mag()).to.eql(0);
        expect(v1.mag()).to.eql(MAG);
      });
    });

    suite('p5.Vector.mag() [CLASS]', function() {
      test('should return the magnitude of the vector', function() {
        expect(p5.Vector.mag(v0)).to.eql(0);
        expect(p5.Vector.mag(v1)).to.eql(MAG);
      });
    });
  });

  suite('magSq', function() {
    const MAG = 14; // 1*1 + 2*2 + 3*3

    let v0;
    let v1;

    setup(function() {
      v0 = new p5.Vector(0, 0, 0);
      v1 = new p5.Vector(1, 2, 3);
    });

    suite('p5.Vector.prototype.magSq() [INSTANCE]', function() {
      test('should return the magnitude of the vector', function() {
        expect(v0.magSq()).to.eql(0);
        expect(v1.magSq()).to.eql(MAG);
      });
    });

    suite('p5.Vector.magSq() [CLASS]', function() {
      test('should return the magnitude of the vector', function() {
        expect(p5.Vector.magSq(v0)).to.eql(0);
        expect(p5.Vector.magSq(v1)).to.eql(MAG);
      });
    });
  });

  suite('equals', function() {
    suite('p5.Vector.prototype.equals() [INSTANCE]', function() {
      test('should return false for parameters inequal to the vector', function() {
        const v1 = new p5.Vector(0, -1, 1);
        const v2 = new p5.Vector(1, 2, 3);
        const a2 = [1, 2, 3];
        expect(v1.equals(v2)).to.be.false;
        expect(v1.equals(a2)).to.be.false;
        expect(v1.equals(1, 2, 3)).to.be.false;
      });

      test('should return true for equal vectors', function() {
        const v1 = new p5.Vector(0, -1, 1);
        const v2 = new p5.Vector(0, -1, 1);
        expect(v1.equals(v2)).to.be.true;
      });

      test('should return true for arrays equal to the vector', function() {
        const v1 = new p5.Vector(0, -1, 1);
        const a1 = [0, -1, 1];
        expect(v1.equals(a1)).to.be.true;
      });

      test('should return true for arguments equal to the vector', function() {
        const v1 = new p5.Vector(0, -1, 1);
        expect(v1.equals(0, -1, 1)).to.be.true;
      });
    });

    suite('p5.Vector.equals() [CLASS]', function() {
      test('should return false for inequal parameters', function() {
        const v1 = new p5.Vector(0, -1, 1);
        const v2 = new p5.Vector(1, 2, 3);
        const a2 = [1, 2, 3];
        expect(p5.Vector.equals(v1, v2)).to.be.false;
        expect(p5.Vector.equals(v1, a2)).to.be.false;
        expect(p5.Vector.equals(a2, v1)).to.be.false;
      });

      test('should return true for equal vectors', function() {
        const v1 = new p5.Vector(0, -1, 1);
        const v2 = new p5.Vector(0, -1, 1);
        expect(p5.Vector.equals(v1, v2)).to.be.true;
      });

      test('should return true for equal vectors and arrays', function() {
        const v1 = new p5.Vector(0, -1, 1);
        const a1 = [0, -1, 1];
        expect(p5.Vector.equals(v1, a1)).to.be.true;
        expect(p5.Vector.equals(a1, v1)).to.be.true;
      });

      test('should return true for equal arrays', function() {
        const a1 = [0, -1, 1];
        const a2 = [0, -1, 1];
        expect(p5.Vector.equals(a1, a2)).to.be.true;
      });
    });
  });
});
