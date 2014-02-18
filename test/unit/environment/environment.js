describe('Environment', function() {
  beforeEach(function() {
    this.sut = null;
  });

  afterEach(function() {
    delete this.sut;
  });

  describe('displayWidth', function() {
    beforeEach(function() {
      this.sut = Processing.prototype.displayWidth;
    });

    it('should return screen.width', function() {
      expect(this.sut).to.eql(screen.width);
    });
  });

  describe('displayHeight', function() {
    beforeEach(function() {
      this.sut = Processing.prototype.displayHeight;
    });

    it('should return screen.height', function() {
      expect(this.sut).to.eql(screen.height);
    });
  });


});


