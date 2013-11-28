describe('Wombat', function() {
    beforeEach(function() {
        this.wombat = new Wombat();
    });

    afterEach(function() {
        delete this.wombat;
    });

    it('should create a wombat with defaults', function() {
        expect(this.wombat).property('name', 'Wally');
    });

    it('should name itself if name passed in options', function() {
        this.wombat = new Wombat({ name: 'Matt' });
        expect(this.wombat).property('name', 'Matt');
    });

    describe('#eat', function() {
        it('should throw if no food passed', function() {
            expect(this.wombat.eat).to.throw('D:');
        });

        it('should return noms if food passed', function() {
            expect(this.wombat.eat('apple')).to.eql('nom nom');
        });
    });

});
