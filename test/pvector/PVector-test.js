
describe("PVector", function () {
  var sut;

  beforeEach(function() {
    sut = new PVector();
  });
  afterEach(function() {
    sut = null;
  });

  describe("new PVector()", function() {
    beforeEach(function() {
      sut = new PVector();
    });

    it("should return a PVector instance", function() {
      expect(sut instanceof PVector).toBe(true);
    });

    it("should have x, y, z be initialized to 0", function() {
      expect(sut.x).toEqual(0);
      expect(sut.y).toEqual(0);
      expect(sut.z).toEqual(0);
    });
  });

  describe("new PVector(1,2,3)", function() {
    beforeEach(function() {
      sut = new PVector(1,2,3);
    });

    it("should have x, y, z be initialized to 1,2,3", function() {
      expect(sut.x).toEqual(1);
      expect(sut.y).toEqual(2);
      expect(sut.z).toEqual(3);
    });
  });

  describe("new PVector(1,2,undefined)", function() {
    beforeEach(function() {
      sut = new PVector(1,2,undefined);
    });

    it("should have x, y, z be initialized to 1,2,0", function() {
      expect(sut.x).toEqual(1);
      expect(sut.y).toEqual(2);
      expect(sut.z).toEqual(0);
    });
  });

  describe("set()", function() {
    describe("with PVector", function() {
      it("should have x, y, z be initialized to the vector's x, y, z", function() {
        sut.set(new PVector(2,5,6));
        expect(sut.x).toEqual(2);
        expect(sut.y).toEqual(5);
        expect(sut.z).toEqual(6);
      });
    });

    describe("with Array", function() {
      it("[2,4] should set x == 2, y == 4, z == 0", function() {
        sut.set([2,4]);
        expect(sut.x).toEqual(2);
        expect(sut.y).toEqual(4);
        expect(sut.z).toEqual(0);
      });
      it("should have x, y, z be initialized to the array's 0,1,2 index", function() {
        sut.set([2,5,6]);
        expect(sut.x).toEqual(2);
        expect(sut.y).toEqual(5);
        expect(sut.z).toEqual(6);
      });
    });

    describe("set(1,2,3)", function() {
      it("should have x, y, z be initialized to the 1, 2, 3", function() {
        sut.set(1, 2, 3);
        expect(sut.x).toEqual(1);
        expect(sut.y).toEqual(2);
        expect(sut.z).toEqual(3);
      });
    });
  });


  describe("get()", function() {
    it("should not return the same instance", function() {
      var newObject = sut.get();
      expect(newObject).not.toBe(sut);
    });

    it("should return the calling object's x, y, z", function() {
      sut.x = 2, sut.y = 3, sut.z = 4;
      var newObject = sut.get();
      expect(newObject.x).toEqual(2);
      expect(newObject.y).toEqual(3);
      expect(newObject.z).toEqual(4);
    });
  });

  describe("add()", function() {
    beforeEach(function() {
      sut.x = 0, sut.y = 0, sut.z = 0;
    });
    describe("with PVector", function() {
      it("should add x, y, z  from the vector argument", function() {
        sut.add(new PVector(2,5,6));
        expect(sut.x).toEqual(2);
        expect(sut.y).toEqual(5);
        expect(sut.z).toEqual(6);
      });
    });

    describe("with Array", function() {
      describe("add([2, 4])", function() {
        it("should add the x and y components", function() {
        sut.add([2,4]);
        expect(sut.x).toEqual(2);
        expect(sut.y).toEqual(4);
        expect(sut.z).toEqual(0);
        });
      });

      it("should add the array's 0,1,2 index", function() {
        sut.add([2,5,6]);
        expect(sut.x).toEqual(2);
        expect(sut.y).toEqual(5);
        expect(sut.z).toEqual(6);
      });
    });

    describe("add(3,5)", function() {
      it("should add the x and y components", function() {
        sut.add(3,5);
        expect(sut.x).toEqual(3);
        expect(sut.y).toEqual(5);
        expect(sut.z).toEqual(0);
      });
    });

    describe("add(2,3,4)", function() {
      it("should add the x, y, z components", function() {
        sut.add(5,5,5);
        expect(sut.x).toEqual(5);
        expect(sut.y).toEqual(5);
        expect(sut.z).toEqual(5);
      });
    });

    describe("PVector.add(v1, v2)", function() {
      var v1, v2, res;
      beforeEach(function() {
        v1 = new PVector(2,0,3);
        v2 = new PVector(0,1,3);
        res = PVector.add(v1, v2);
      });

      it("should return neither v1 nor v2", function() {
        expect(res).not.toBe(v1);
        expect(res).not.toBe(v2);
      });

      it("should be sum of the two PVectors", function() {
        expect(res.x).toEqual(v1.x + v2.x);
        expect(res.y).toEqual(v1.y + v2.y);
        expect(res.z).toEqual(v1.z + v2.z);
      });
    });

  });

  describe("sub()", function() {
    beforeEach(function() {
      sut.x = 0, sut.y = 0, sut.z = 0;
    });
    describe("with PVector", function() {
      it("should sub x, y, z  from the vector argument", function() {
        sut.sub(new PVector(2,5,6));
        expect(sut.x).toEqual(-2);
        expect(sut.y).toEqual(-5);
        expect(sut.z).toEqual(-6);
      });
    });

    describe("with Array", function() {
      describe("sub([2, 4])", function() {
        it("should sub the x and y components", function() {
        sut.sub([2,4]);
        expect(sut.x).toEqual(-2);
        expect(sut.y).toEqual(-4);
        expect(sut.z).toEqual(0);
        });
      });

      it("should substract from the array's 0,1,2 index", function() {
        sut.sub([2,5,6]);
        expect(sut.x).toEqual(-2);
        expect(sut.y).toEqual(-5);
        expect(sut.z).toEqual(-6);
      });
    });

    describe("sub(3,5)", function() {
      it("should substract the x and y components", function() {
        sut.sub(3,5);
        expect(sut.x).toEqual(-3);
        expect(sut.y).toEqual(-5);
        expect(sut.z).toEqual(0);
      });
    });

    describe("sub(2,3,4)", function() {
      it("should substract the x, y, z components", function() {
        sut.sub(5,5,5);
        expect(sut.x).toEqual(-5);
        expect(sut.y).toEqual(-5);
        expect(sut.z).toEqual(-5);
      });
    });

    describe("PVector.sub(v1, v2)", function() {
      var v1, v2, res;
      beforeEach(function() {
        v1 = new PVector(2,0,3);
        v2 = new PVector(0,1,3);
        res = PVector.sub(v1, v2);
      });

      it("should return neither v1 nor v2", function() {
        expect(res).not.toBe(v1);
        expect(res).not.toBe(v2);
      });

      it("should be v1 - v2", function() {
        expect(res.x).toEqual(v1.x - v2.x);
        expect(res.y).toEqual(v1.y - v2.y);
        expect(res.z).toEqual(v1.z - v2.z);
      });
    });
  });

  describe("mult()", function() {
    beforeEach(function() {
      sut.x = 1, sut.y = 1, sut.z = 1;
    });

    it("should return the same object", function() {
      expect(sut.mult(0)).toBe(sut);
    });

    describe("with scalar", function() {
      it("multiply the x, y, z with the scalar", function() {
        sut.mult(2);
        expect(sut.x).toBe(2);
        expect(sut.y).toBe(2);
        expect(sut.z).toBe(2);
      });
    });

    describe("PVector.mult(v, n)", function() {
      var v;
      beforeEach(function() {
        v = new PVector(1,2,3);
        res = PVector.mult(v, 4);
      });

      it("should return a new PVector", function() {
        expect(res).not.toBe(v);
      });

      it("should multiply the scalar", function() {
        expect(res.x).toBe(4);
        expect(res.y).toBe(8);
        expect(res.z).toBe(12);
      });
    });


  });

  describe("div()", function() {
    beforeEach(function() {
      sut.x = 1, sut.y = 1, sut.z = 1;
    });

    it("should return the same object", function() {
      expect(sut.div(0)).toBe(sut);
    });

    describe("with scalar", function() {
      it("divide the x, y, z with the scalar", function() {
        sut.div(2);
        expect(sut.x).toBeCloseTo(0.5);
        expect(sut.y).toBeCloseTo(0.5);
        expect(sut.z).toBeCloseTo(0.5);
      });
    });

    describe("PVector.div(v, n)", function() {
      var v, res;
      beforeEach(function() {
        v = new PVector(1,1,1);
        res = PVector.div(v, 4);
      });

      it("should not be undefined", function() {
        expect(res).not.toBe(undefined);
      });

      it("should return a new PVector", function() {
        expect(res).not.toBe(v);
      });

      it("should divide the scalar", function() {
        expect(res.x).toBe(0.25);
        expect(res.y).toBe(0.25);
        expect(res.z).toBe(0.25);
      });
    });
  });


  describe("dot", function() {
    beforeEach(function() {
      sut.x = 1, sut.y = 1, sut.z = 1;
    });
 
    it("should return a number", function() {
       expect(typeof(sut.dot(new PVector())) ===  "number").toBe(true);
    });


    describe("with PVector", function() {
      it("should be the dot product of the vector", function() {
        expect(sut.dot(new PVector(2,2))).toEqual(4);
      });
    });

    describe("with x, y, z", function() {
      it("should be the dot product with x, y", function() {
        expect(sut.dot(2,2)).toEqual(4);
      });

      it("should be the dot product with x, y, z", function() {
        expect(sut.dot(2,2,2)).toEqual(6);
      });
    });

    describe("PVector.dot(v, n)", function() {
      var v1, v2, res;
      beforeEach(function() {
        v1 = new PVector(1,1,1);
        v2 = new PVector(2,3,4);
        res = PVector.dot(v1, v2);
      });

      it("should return a number", function() {
        expect(typeof(res) ===  "number").toBe(true);
      });

      it("should be the dot product of the two vectors", function() {
        expect(res).toEqual(9);
      });
    });
  });

  describe("cross", function() {
    var res;
    beforeEach(function() {
      sut.x = 1, sut.y = 1, sut.z = 1;
    });
      it("should return a new product", function() {
        expect(sut.cross(new PVector())).not.toBe(sut);
      });

    describe("with PVector", function() {
      it("should cross x, y, z  from the vector argument", function() {
        res = sut.cross(new PVector(2,5,6));
        expect(res.x).toEqual(1);   //this.y * v.z - this.z * v.y
        expect(res.y).toEqual(-4);  //this.z * v.x - this.x * v.z
        expect(res.z).toEqual(3);   //this.x * v.y - this.y * v.x
      });
    });

    describe("PVector.cross(v1, v2)", function() {
      var v1, v2, res;
      beforeEach(function() {
        v1 = new PVector(3,6,9);
        v2 = new PVector(1,1,1);
        res = PVector.cross(v1, v2);
      });

      it("should not be undefined", function() {
        expect(res).not.toBe(undefined);
      });

 
      it("should return neither v1 nor v2", function() {
        expect(res).not.toBe(v1);
        expect(res).not.toBe(v2);
      });

      it("should the cross product of v1 and v2", function() {
        expect(res.x).toEqual(-3);
        expect(res.y).toEqual(6);
        expect(res.z).toEqual(-3);
      });
    });
  });

  describe("dist", function() {
    var b, c;
    beforeEach(function() {
      sut.x = 0, sut.y = 0, sut.z = 1;
      b = new PVector(0,0,5);
      c = new PVector(3,4,1);
    });

    it("should return a number", function() {
      expect(typeof(sut.dist(b)) ===  "number").toBe(true);
    });

    it("should return distance between two vectors", function() {
      expect(sut.dist(b)).toEqual(4);
    });

    it("should return distance between two vectors", function() {
      expect(sut.dist(c)).toEqual(5);
    });

    it("should be commutative", function() {
      expect(b.dist(c)).toEqual(c.dist(b));
    });

  });

  describe("PVector.dist(v1, v2)", function() {
    var v1, v2, res;
    beforeEach(function() {
      v1 = new PVector(0,0,0);
      v2 = new PVector(0,3,4);
    });

    it("should return a number", function() {
      expect(typeof(PVector.dist(v1, v2)) ===  "number").toBe(true);
    });

    it("should be commutative", function() {
      expect(PVector.dist(v1, v2)).toEqual(PVector.dist(v2, v1));
    });
  });

  describe("normalize", function() {
    beforeEach(function() {
      sut.x = 1, sut.y = 1, sut.z = 1;
    });

    it("should return the same object", function() {
      expect(sut.normalize()).toBe(sut);
    });

    describe("with unit vector", function() {
      it("should not change the vector", function() {
        sut.x = 1, sut.y = 0, sut.z = 0;
        sut.normalize();
        expect(sut.x).toEqual(1);
        expect(sut.y).toEqual(0);
        expect(sut.z).toEqual(0);
      });
    });

    describe("with 2,2,1", function() {
      it("should normalize to 0.66,0.66,0.33", function() {
        sut.x = 2, sut.y = 2, sut.z = 1;
        sut.normalize();
        expect(sut.x).toBeCloseTo(0.6666);
        expect(sut.y).toBeCloseTo(0.6666);
        expect(sut.z).toBeCloseTo(0.3333);
      });
    });
  });

  describe("limit", function() {
    beforeEach(function() {
      sut.x = 1, sut.y = 1, sut.z = 1;
    });

    it("should return the same object", function() {
      expect(sut.limit()).toBe(sut);
    });

    describe("with a vector larger than the limit", function() {
      it("should limit the vector", function() {
        sut.x = 5, sut.y = 5, sut.z = 5;
        sut.limit(1);
        expect(sut.x).toBeCloseTo(0.5773);
        expect(sut.y).toBeCloseTo(0.5773);
        expect(sut.z).toBeCloseTo(0.5773);
      });
    });

    describe("with a vector smaller than the limit", function() {
      it("should not limit the vector", function() {
        sut.x = 5, sut.y = 5, sut.z = 5;
        sut.limit(8.67);
        expect(sut.x).toEqual(5);
        expect(sut.y).toEqual(5);
        expect(sut.z).toEqual(5);
      });
    });
  });

  describe("setMag", function() {
    beforeEach(function() {
      sut.x = 1, sut.y = 0, sut.z = 0;
    });

    it("should return the same object", function() {
      expect(sut.setMag(2)).toBe(sut);
    });

    it("should set the magnitude of the vector", function() {
      sut.setMag(4);
      expect(sut.mag()).toEqual(4);
    });

    it("should set the magnitude of the vector", function() {
      sut.x = 2, sut.y = 3, sut.z = 0;
      sut.setMag(2);
      expect(sut.mag()).toEqual(2);
      expect(sut.x).toBeCloseTo(1.1094);
      expect(sut.y).toBeCloseTo(1.6641006);
    });
  });

  describe("heading", function() {
    it("should return a number", function() {
      expect(typeof(sut.heading()) ===  "number").toBe(true);
    });

    it("heading for vector pointing right is 0", function() {
      sut.x = 1, sut.y = 0, sut.z = 0;
      expect(sut.heading()).toBeCloseTo(0);
    });

    it("heading for vector pointing down is PI/2", function() {
      sut.x = 0, sut.y = 1, sut.z = 0;
      expect(sut.heading()).toBeCloseTo(Math.PI/2);
    });

    it("heading for vector pointing left is PI", function() {
      sut.x = -1, sut.y = 0, sut.z = 0;
      expect(sut.heading()).toBeCloseTo(Math.PI);
    });
  });

  describe("rotate2D", function() {
    it("should return the same object", function() {
      expect(sut.rotate2D()).toBe(sut);
    });

    it("should rotate the vector", function() {
      sut.x = 1, sut.y = 0, sut.z = 0;
      sut.rotate2D(Math.PI);
      expect(sut.x).toBeCloseTo(-1);
      expect(sut.y).toBeCloseTo(0);
    });

    it("should rotate the vector", function() {
      sut.x = 1, sut.y = 0, sut.z = 0;
      sut.rotate2D(Math.PI/2);
      expect(sut.x).toBeCloseTo(0);
      expect(sut.y).toBeCloseTo(1);
    });
  });

  describe("lerp", function() {
    // it("should return the same object", function() {
    //   expect(sut.lerp()).toBe(sut);
    // });

    describe("with PVector", function() {
      it("should call lerp with 4 arguments", function() {
        spyOn(sut, "lerp").andCallThrough();
        sut.lerp(new PVector(1,2,3), 1);
        expect(sut.lerp).toHaveBeenCalledWith(1, 2, 3, 1);
      });
    });

    describe("with x, y, z, amt", function() {
      beforeEach(function() {
        sut.x = 0, sut.y = 0, sut.z = 0;
        sut.lerp(2,2,2,0.5);
      });
      it("should lerp x by amt", function() {
        expect(sut.x).toEqual(1);
      });

      it("should lerp y by amt", function() {
        expect(sut.y).toEqual(1);
      });

      it("should lerp z by amt", function() {
        expect(sut.z).toEqual(1);
      });
    });

    describe("with no amt", function() {
      it("should assume 0 amt", function() {
        sut.x = 0, sut.y = 0, sut.z = 0;
        sut.lerp(2,2,2);
        expect(sut.x).toEqual(0);
        expect(sut.y).toEqual(0);
        expect(sut.z).toEqual(0);
      });
    });
  });
  describe("PVector.lerp(v1, v2, amt)", function() {
    var res, v1, v2;
    beforeEach(function() {
      v1 = new PVector(0, 0, 0);
      v2 = new PVector(2, 2, 2);

      res = PVector.lerp(v1, v2, 0.5);

    });
    it("should not be undefined", function() {
      expect(res).not.toBe(undefined);
    });

    it("should be a PVector", function() {
      expect(res).toEqual(jasmine.any(PVector));
    });

    it("should return neither v1 nor v2", function() {
      expect(res).not.toBe(v1);
      expect(res).not.toBe(v2);
    });

    it("should res to be [1, 1, 1]", function() {
      expect(res.x).toBe(1);
      expect(res.y).toBe(1);
      expect(res.z).toBe(1);
    });
  });

  describe("PVector.angleBetween(v1, v2)", function() {
    var res, v1, v2;
    beforeEach(function() {
      v1 = new PVector(0, 0, 0);
      v2 = new PVector(2, 2, 0);

      res = PVector.angleBetween(v1, v2, 0.5);

    });
    it("should be a Number", function() {
      expect(res).toEqual(jasmine.any(Number));
    });
    describe("with [1,0,0] and [2,2,0]", function() {
      it("should be 45 deg differnce", function() {
        v1 = new PVector(1, 0, 0);
        v2 = new PVector(2, 2, 0);
        res = PVector.angleBetween(v1, v2);
        expect(res).toBeCloseTo(Math.PI/4);
      });
    });

    describe("with [2,0,0] and [-2,0,0]", function() {
      it("should be 180 deg differnce", function() {
        v1 = new PVector(2, 0, 0);
        v2 = new PVector(-2, 0, 0);
        res = PVector.angleBetween(v1, v2);
        expect(res).toBeCloseTo(Math.PI);
      });
    });

    describe("with [2,0,0] and [-2,-2,0]", function() {
      it("should be 135 deg differnce", function() {
        v1 = new PVector(2, 0, 0);
        v2 = new PVector(-2, -2, 0);
        res = PVector.angleBetween(v1, v2);
        expect(res).toBeCloseTo(Math.PI/2 + Math.PI/4);
      });

      it("should be commutative", function() {
        v1 = new PVector(2, 0, 0);
        v2 = new PVector(-2, -2, 0);
        res = PVector.angleBetween(v1, v2);
        expect(PVector.angleBetween(v1,v2)).toBeCloseTo(PVector.angleBetween(v2,v1));
      });
    });
  });

  describe("array", function() {
    it("should return an array", function() {
      expect(sut.array()).toEqual(jasmine.any(Array));
    });

    it("should return an with the x y and z components", function() {
      sut.x = 1, sut.y = 23, sut.z = 4;
      expect(sut.array()).toEqual([1, 23, 4]);
    });
  })

  /*
  describe("random2D", function() {
    it("should return a PVector", function() {
      expect(PVector.random2D()).toEqual(jasmine.any(PVector));
    });

    it("should return x and y between -1 and 1", function() {
      sut = PVector.random2D();
      expect(sut.x <= 1 && sut.x >= -1).toEqual(true);
      expect(sut.y <= 1 && sut.y >= -1).toEqual(true);
    });
  })

  describe("random3D", function() {
    it("should return a PVector", function() {
      expect(PVector.random3D()).toEqual(jasmine.any(PVector));
    });

    it("should return x, y,z between -1 and 1", function() {
      sut = PVector.random3D();
      expect(sut.x <= 1 && sut.x >= -1).toEqual(true);
      expect(sut.y <= 1 && sut.y >= -1).toEqual(true);
      expect(sut.z <= 1 && sut.z >= -1).toEqual(true);
    });
  })
  */
});
