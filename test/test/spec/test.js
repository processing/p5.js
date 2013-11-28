
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})


describe('Apple', function() {
    beforeEach(function() {
        this.apple = new Apple();
    });

    afterEach(function() {
        delete this.apple;
    });

    it('should go crunch', function() {
        expect(this.apple).property('sound', 'crunch');
    });
});