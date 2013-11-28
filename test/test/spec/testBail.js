describe('Tests should bail', function() {
    beforeEach(function() {
        this.wombat = new Wombat();
    });

    afterEach(function() {
        delete this.wombat;
    });

    it('should create a wombat with defaults', function() {
        expect(this.wombat).property('name', 'Wally');
    });

    it('this test should cause grunt to abort', function() {
        expect(false).to.be.true;
    });

    describe('#eat', function() {
        it('should throw if no food passed', function() {
            this.wombat = new Wombat({ name: 'Matt' });
            expect(this.wombat).property('name', 'Matt');
        });
    });

});
