describe('Random', function() {
  beforeEach(function() {
    this.sut = null;
  });

  afterEach(function() {
    delete this.sut;
  });

  describe("random()", function() {
    beforeEach(function() {
      this.sut = Processing.prototype.random();
    });

    it("should return a number", function() {
       expect(typeof(this.sut) ===  "number").to.eql(true);
    });
  });

  describe("random(10)", function() {
    beforeEach(function() {
      this.sut = Processing.prototype.random(10);
    });

    it("should return a number < 10", function() {
       expect(this.sut).to.be.below(10);
    });

    it("should return a number >= 0", function() {
       expect(this.sut).to.be.at.least(0);
    });
  });

  describe("random(1, 10)", function() {
    beforeEach(function() {
      this.sut = Processing.prototype.random(1, 10);
    });

    it("should return a number < 10", function() {
       expect(this.sut).to.be.below(10);
    });

    it("should return a number >= 1", function() {
       expect(this.sut).to.be.at.least(1);
    });
  });

  describe("noise()", function() {
    // beforeEach(function() {
    //   this.sut = Processing.prototype.random(1, 10);
    // });

    // it("should return a number < 10", function() {
    //    expect(this.sut).to.be.below(10);
    // });

    // it("should return a number >= 1", function() {
    //    expect(this.sut).to.be.at.least(1);
    // });
  });

});


