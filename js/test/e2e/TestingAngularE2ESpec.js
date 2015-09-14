describe('TestingAngularApp', function() {

    describe('TestingAngular List view', function() {

        beforeEach(function() {
            browser.get('http://0.0.0.0:8080/index.html');
        });


        it('should filter the city list as a user types into the search box', function() {

            var destinationList = element.all(by.repeater('city in cities'));
            var query = element(by.model('search'));

            expect(destinationList.count()).toBe(4);

            query.sendKeys('London');
            expect(destinationList.count()).toBe(1);

            query.clear();
            query.sendKeys('ich');
            expect(destinationList.count()).toBe(2);
        });
    });
});