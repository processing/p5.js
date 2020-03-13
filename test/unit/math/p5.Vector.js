suite('p5.Vector', function() {
  var RADIANS = 'radians';
  var DEGREES = 'degrees';

  var myp5;

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
  var v;

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

  suite('p5.prototype.createVector()', function() {
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

  suite('p5.prototype.rotate() RADIANS', function() {
    setup(function() {
      myp5.angleMode(RADIANS);
      v = myp5.createVector(0, 1);
    });

    test('should have x, y, z rotated to 0, -1, 0 (RADIANS)', function() {
      v.rotate(Math.PI);
      assert.closeTo(v.x, 0, 0.001);
      assert.closeTo(v.y, -1, 0.001);
      assert.closeTo(v.z, 0, 0.001);
    });
  });

  suite('p5.prototype.rotate() DEGREES', function() {
    setup(function() {
      myp5.angleMode(DEGREES);
      v = myp5.createVector(0, 1);
    });

    test('should have x, y, z rotated to 0, -1, 0 (DEGREES)', function() {
      v.rotate(180);
      assert.closeTo(v.x, 0, 0.001);
      assert.closeTo(v.y, -1, 0.001);
      assert.closeTo(v.z, 0, 0.001);
    });
  });

  suite('p5.prototype.angleBetween()', function() {
    setup(function() {
      myp5.angleMode(DEGREES);
    });

    test('should not trip on rounding issues in 2D space', function() {
      var v1 = myp5.createVector(-11, -20);
      var v2 = myp5.createVector(-5.5, -10);
      var res = v1.angleBetween(v2);
      //expect(Math.abs(v1.angleBetween(v2))).to.be.closeTo(0, 0.00001);
      expect(res).to.be.closeTo(0, 0.00001);

      var v3 = myp5.createVector(-11, -20);
      var v4 = myp5.createVector(5.5, 10);
      expect(Math.abs(v3.angleBetween(v4))).to.be.closeTo(180, 0.00001);
      expect(v3.angleBetween(v4)).to.be.closeTo(180, 0.00001);
    });

    test('should not trip on rounding issues in 3D space', function() {
      var v1 = myp5.createVector(1, 1.1, 1.2);
      var v2 = myp5.createVector(2, 2.2, 2.4);

      var angle = Math.abs(v1.angleBetween(v2));
      expect(angle).to.be.closeTo(0, 0.00001);
    });

    test('should return NaN for zero vector', function() {
      var v1 = myp5.createVector(0, 0, 0);
      var v2 = myp5.createVector(2, 3, 4);

      expect(Math.abs(v1.angleBetween(v2))).to.be.NaN; // jshint ignore:line
      expect(v2.angleBetween(v1)).to.be.NaN; // jshint ignore:line
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

  suite('copy()', function() {
    setup(function() {
      v = new p5.Vector(1, 2, 3);
    });

    test('should not return the same instance', function() {
      var newObject = v.copy();
      expect(newObject).to.not.equal(v);
    });

    test("should return the calling object's x, y, z", function() {
      v.x = 2;
      v.y = 3;
      v.z = 4;
      var newObject = v.copy();
      expect(newObject.x).to.eql(2);
      expect(newObject.y).to.eql(3);
      expect(newObject.z).to.eql(4);
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

      test('should not change x, y, z if v3 contains 0', function() {
        v2.div(v3);
        expect(v2.x).to.eql(1);
        expect(v2.y).to.eql(1);
        expect(v2.z).to.eql(1);
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
    setup(function() {
      v.x = 1;
      v.y = 1;
      v.z = 1;
    });

    test('should return the same object', function() {
      expect(v.normalize()).to.eql(v);
    });

    suite('with unit vector', function() {
      test('should not change the vector', function() {
        v.x = 1;
        v.y = 0;
        v.z = 0;
        v.normalize();
        expect(v.x).to.eql(1);
        expect(v.y).to.eql(0);
        expect(v.z).to.eql(0);
      });
    });

    suite('with 2,2,1', function() {
      test('should normalize to 0.66,0.66,0.33', function() {
        v.x = 2;
        v.y = 2;
        v.z = 1;
        v.normalize();
        expect(v.x).to.be.closeTo(0.6666, 0.01);
        expect(v.y).to.be.closeTo(0.6666, 0.01);
        expect(v.z).to.be.closeTo(0.3333, 0.01);
      });
    });
  });

  suite('limit', function() {
    setup(function() {
      v.x = 1;
      v.y = 1;
      v.z = 1;
    });

    test('should return the same object', function() {
      expect(v.limit()).to.eql(v);
    });

    suite('with a vector larger than the limit', function() {
      test('should limit the vector', function() {
        v.x = 5;
        v.y = 5;
        v.z = 5;
        v.limit(1);
        expect(v.x).to.be.closeTo(0.5773, 0.01);
        expect(v.y).to.be.closeTo(0.5773, 0.01);
        expect(v.z).to.be.closeTo(0.5773, 0.01);
      });
    });

    suite('with a vector smaller than the limit', function() {
      test('should not limit the vector', function() {
        v.x = 5;
        v.y = 5;
        v.z = 5;
        v.limit(8.67);
        expect(v.x).to.eql(5);
        expect(v.y).to.eql(5);
        expect(v.z).to.eql(5);
      });
    });
  });

  suite('setMag', function() {
    setup(function() {
      v.x = 1;
      v.y = 0;
      v.z = 0;
    });

    test('should return the same object', function() {
      expect(v.setMag(2)).to.eql(v);
    });

    test('should set the magnitude of the vector', function() {
      v.setMag(4);
      expect(v.mag()).to.eql(4);
    });

    test('should set the magnitude of the vector', function() {
      v.x = 2;
      v.y = 3;
      v.z = 0;
      v.setMag(2);
      expect(v.mag()).to.eql(2);
      expect(v.x).to.be.closeTo(1.1094, 0.01);
      expect(v.y).to.be.closeTo(1.6641006, 0.01);
    });
  });

  suite('heading', function() {
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
  });

  suite('rotate', function() {
    test('should return the same object', function() {
      expect(v.rotate()).to.eql(v);
    });

    test('should rotate the vector', function() {
      v.x = 1;
      v.y = 0;
      v.z = 0;
      v.rotate(Math.PI);
      expect(v.x).to.be.closeTo(-1, 0.01);
      expect(v.y).to.be.closeTo(0, 0.01);
    });

    test('should rotate the vector', function() {
      v.x = 1;
      v.y = 0;
      v.z = 0;
      v.rotate(Math.PI / 2);
      expect(v.x).to.be.closeTo(0, 0.01);
      expect(v.y).to.be.closeTo(1, 0.01);
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

  suite('v1.angleBetween(v2)', function() {
    var res, v1, v2;
    setup(function() {
      v1 = new p5.Vector(1, 0, 0);
      v2 = new p5.Vector(2, 2, 0);
      res = v1.angleBetween(v2);
    });

    test('should be a Number', function() {
      expect(typeof res).to.eql('number');
    });

    suite('with [1,0,0] and [2,2,0]', function() {
      test('should be 45 deg difference', function() {
        v1 = new p5.Vector(1, 0, 0);
        v2 = new p5.Vector(2, 2, 0);
        res = v1.angleBetween(v2);
        expect(res).to.be.closeTo(Math.PI / 4, 0.01);
        expect(v2.angleBetween(v1)).to.be.closeTo(-1 * Math.PI / 4, 0.01);
      });
    });

    suite('with [2,0,0] and [-2,0,0]', function() {
      test('should be 180 deg difference', function() {
        v1 = new p5.Vector(2, 0, 0);
        v2 = new p5.Vector(-2, 0, 0);
        res = Math.abs(v1.angleBetween(v2));
        expect(res).to.be.closeTo(Math.PI, 0.01);
      });
    });

    suite('with [2,0,0] and [-2,-2,0]', function() {
      test('should be 135 deg difference', function() {
        v1 = new p5.Vector(2, 0, 0);
        v2 = new p5.Vector(-2, -2, 0);
        expect(v1.angleBetween(v2)).to.be.closeTo(
          -1 * (Math.PI / 2 + Math.PI / 4),
          0.01
        );
        expect(v2.angleBetween(v1)).to.be.closeTo(
          Math.PI / 2 + Math.PI / 4,
          0.01
        );
      });

      test('should be commutative', function() {
        v1 = new p5.Vector(2, 0, 0);
        v2 = new p5.Vector(-2, -2, 0);
        expect(Math.abs(v1.angleBetween(v2))).to.be.closeTo(
          Math.abs(v2.angleBetween(v1)),
          0.01
        );
      });
    });
  });

  suite('array', function() {
    test('should return an array', function() {
      expect(v.array()).to.be.instanceof(Array);
    });

    test('should return an with the x y and z components', function() {
      v.x = 1;
      v.y = 23;
      v.z = 4;
      expect(v.array()).to.eql([1, 23, 4]);
    });
  });

  suite('reflect', function() {
    setup(function() {
      incoming_x = 1;
      incoming_y = 1;
      incoming_z = 1;
      original_incoming = myp5.createVector(incoming_x, incoming_y, incoming_z);

      x_normal = myp5.createVector(3, 0, 0);
      y_normal = myp5.createVector(0, 3, 0);
      z_normal = myp5.createVector(0, 0, 3);

      x_bounce_incoming = myp5.createVector(incoming_x, incoming_y, incoming_z);
      x_bounce_outgoing = x_bounce_incoming.reflect(x_normal);

      y_bounce_incoming = myp5.createVector(incoming_x, incoming_y, incoming_z);
      y_bounce_outgoing = y_bounce_incoming.reflect(y_normal);

      z_bounce_incoming = myp5.createVector(incoming_x, incoming_y, incoming_z);
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
      expect(Math.abs(x_normal.angleBetween(original_incoming))).to.be.closeTo(
        Math.abs(x_normal.angleBetween(x_bounce_outgoing.mult(-1))),
        0.01
      );
      expect(Math.abs(y_normal.angleBetween(original_incoming))).to.be.closeTo(
        Math.abs(y_normal.angleBetween(y_bounce_outgoing.mult(-1))),
        0.01
      );
      expect(Math.abs(z_normal.angleBetween(original_incoming))).to.be.closeTo(
        Math.abs(z_normal.angleBetween(z_bounce_outgoing.mult(-1))),
        0.01
      );
    });
  });
});
