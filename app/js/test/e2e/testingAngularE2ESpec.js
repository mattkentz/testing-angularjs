describe('TestingAngularApp', function() {

    describe('TestingAngular List view', function() {
        
        beforeEach(function() {
            browser.get('http://0.0.0.0:8080/index.html');
        });

        it('should have a title', function() {
            expect(browser.getTitle()).toEqual('Testing Angular');
        });
    
    });
});
