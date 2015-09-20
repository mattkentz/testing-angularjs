describe('TestingAngularCtrl', function(){
    // Remember to declare variables outside of the beforeEach block scope
    var rootScope, scope, ctrl;
    
    beforeEach(module('testingAngularApp'));
    
    // Inject any required services and controllers and map them to the local variables
    beforeEach(inject(function($controller, $rootScope, $httpBackend){
        rootScope = $rootScope
        scope = rootScope.$new();
        httpBackend = $httpBackend;
        ctrl = $controller('TestingAngularCtrl', {$scope : scope});
        
        //Reset destinations before each test
        scope.destinations = [];
        
    }));
    
    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });


    it('should create a "destinations" model and add 2 cities', function () {
        scope.newDestination =
            {
                name : "London",
                duration : 5
            };
        
        scope.addDestination(true);    
        
        expect(scope.destinations.length).toBe(1);   
        
        scope.newDestination.city = "Frankfurt";
        scope.newDestination.country = "Germany";
        scope.addDestination(true);
        
        expect(scope.destinations.length).toBe(2);
        //Javascript arrays are 0 indexed
        expect(scope.destinations[1].city).toBe("Frankfurt");        
    });
    
    //Lets try taking the test driven approach
    it('should remove a city with a specific index', function () {
        scope.destinations = [
            {
                city : "Rome",
                country : "Italy"
            },
            {
                city : "Milan",
                country : "Italy"
            },
            {
                city : "Venice",
                country : "Italy"
            },
            
        ];
        
        expect(scope.destinations.length).toBe(3);
        expect(scope.destinations[1].city).toBe("Milan"); 
        
        scope.removeDestinationByIndex(1);
        
        expect(scope.destinations.length).toBe(2);
        expect(scope.destinations[1].city).toBe("Venice"); 
    });
    
    it('should set the default value of order model', function() {
      expect(scope.sort).toBe('city');
    });
    
    it('should calculate the correct temperature in degrees celsius', function() {
        var kelvin = 300;
        var celsius = scope.convertKelvinToCelsius(kelvin);
        
        expect(celsius).toBe(27);
        
        //Can be used to explain branch code coverage
        /*kelvin = 273;
        celsius = scope.convertKelvinToCelsius(kelvin);
        expect(celsius).toBe(0);
        
        kelvin = 250;
        celsius = scope.convertKelvinToCelsius(kelvin);
        expect(celsius).toBe(-23);*/
    });    
    
    it('should update the weather for the specified destination', function() {
        httpBackend.expectGET('http://api.openweathermap.org/data/2.5/weather?q=London').respond(
        {
            weather: [{main : 'Rain', detail : 'Light rain'}], 
            main : { temp : 288 }
        });
        //Alternatively
        //httpBackend.when('GET', 'http://api.openweathermap.org/data/2.5/weather?q=London').respond({weather: [{main : 'Rain', detail : 'Light rain'}]});
        
        scope.desintationObj = 
        {
                city : "London",
                country: "England"
        };
        
        scope.getWeatherForDestination(scope.desintationObj);
        
        httpBackend.flush();
        
        //Explain difference between toBe and toEqual
        expect(scope.desintationObj.weather.main).toEqual("Rain");
        expect(scope.desintationObj.weather.temp).toEqual(15);
    });
    
    
    
});