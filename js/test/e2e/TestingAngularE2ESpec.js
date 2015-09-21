describe('TestingAngularApp', function() {

    describe('TestingAngular List view', function() {

        //NOTE: First define these variables in the test, with multiple tests define at the top
        var newCityField = element(by.model('newDestination.city'));
        var newCountryField = element(by.model('newDestination.country'));
        var addDestinationButton =  element(by.id('AddDestinationButton'));
        
        var destinationList = element.all(by.repeater('destination in destinations'));
        
        //NOTE: Helper Functions can be added and reused to write less code
        var addDestination = function (city, country) {
            newCityField.sendKeys(city);
            newCountryField.sendKeys(country);
            addDestinationButton.click();
        }
        
        beforeEach(function() {
            browser.get('http://0.0.0.0:8080/index.html');
        });

        it('should have a title', function() {
            expect(browser.getTitle()).toEqual('Testing AngularJS');
        });
        
        it('should filter the city list as a user types into the search box', function() {

            var destinationList = element.all(by.repeater('destination in destinations'));
            var query = element(by.model('search'));

            expect(destinationList.count()).toBe(5);

            query.sendKeys('London');
            expect(destinationList.count()).toBe(1);

            query.clear();
            query.sendKeys('ich');
            expect(destinationList.count()).toBe(2);
        }); 
        
        it('should add destination to destination list', function() {
            
            var destinationList = element.all(by.repeater('destination in destinations'));
            expect(destinationList.count()).toBe(5);
            
            element(by.model('newDestination.city')).sendKeys("Valletta");
            element(by.model('newDestination.country')).sendKeys("Malta");

            element(by.id('AddDestinationButton')).click();
            
            expect(destinationList.count()).toBe(6);
        
        });
        
        it('should remove destination from destination list', function() {
            expect(destinationList.count()).toBe(5);
            
            //Find last instance of remove destination button and click it
            element.all(by.name('removeDestinationButton')).last().click();
            
            expect(destinationList.count()).toBe(4);
        
        });
        
        it('should add weather details to destination', function() {
        
            
            
        });
    });
});