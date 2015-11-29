describe('Testing AngularJS Test Suite', function(){
  
  beforeEach(module('testingAngularApp'));
  
  describe('Testing AngularJS Controller', function(){

    var ctrl, httpBackend, rootScope, scope, timeout; 

    beforeEach(inject(function ($controller, $httpBackend, $rootScope, $timeout) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      ctrl = $controller('testingAngularCtrl', {$scope:scope});
      httpBackend = $httpBackend;
      timeout = $timeout;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should initialize the scope correctly', function () {
      expect(scope.title).toBeDefined();
      expect(scope.title).toBe("Testing AngularJS Applications");
    });

    it('should add 2 destinations', function () {
      expect(scope.destinations).toBeDefined();
      expect(scope.destinations.length).toBe(0);

      scope.newDestination =
        {
          city : "London",
          country : "England"
        };

      scope.addDestination();    

      expect(scope.destinations.length).toBe(1);  
      expect(scope.destinations[0].city).toBe("London");
      expect(scope.destinations[0].country).toBe("England"); 

      scope.newDestination.city = "Frankfurt";
      scope.newDestination.country = "Germany";
      scope.addDestination();

      expect(scope.destinations.length).toBe(2);
      expect(scope.destinations[1].city).toBe("Frankfurt");
      expect(scope.destinations[1].country).toBe("Germany"); 
    });

    it('should remove a destination', function () {
      scope.destinations = 
        [
          {
            city: "Milan",
            country: "Italy"
          },
          {
            city: "New York",
            country: "USA"
          }
        ];

      expect(scope.destinations.length).toBe(2);  
      expect(scope.destinations[0].city).toBe("Milan");
      expect(scope.destinations[0].country).toBe("Italy"); 
      expect(scope.destinations[1]).toBeDefined();

      scope.removeDestination(0);

      expect(scope.destinations.length).toBe(1);
      expect(scope.destinations[0].city).toBe("New York");
      expect(scope.destinations[0].country).toBe("USA"); 
      expect(scope.destinations[1]).toBeUndefined();
    });

    it('should calculate the correct temperature in degrees celsius', function() {
      var kelvin = 300;
      var celsius = scope.convertKelvinToCelsius(kelvin);

      expect(celsius).toBe(27);
    });    

    it('should update the weather for the specified destination', function() {
      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=London&appid=" + scope.apiKey).respond(
        {
          weather: [{main : 'Rain', detail : 'Light rain'}], 
          main : { temp : 288 }
        }
      );

      scope.destination = 
      {
              city : "London",
              country: "England"
      };

      scope.getWeather(scope.destination);

      httpBackend.flush();

      expect(scope.destination.weather.main).toBe("Rain");
      expect(scope.destination.weather.temp).toBe(15);
    });

    it('should remove error message after a few seconds', function () {
      scope.message = "Error";
      expect(scope.message).toBe("Error");
      scope.$apply();
      timeout.flush();
      expect(scope.message).toBeNull();
    });
  });
  
  describe('Testing AngularJS Filter', function(){
    it('should return only the warm countries', inject(function($filter) {
      var filter = $filter;
      var destinations = 
        [
          {
            city: "Beijing",
            country: "China",
            weather: 
            {
              temp: 21
            }
          },
          {
            city: "Melbourne",
            country: "Australia",
            weather: 
            {
              temp: 30
            }
          },
          {
            city: "Toronto",
            country: "Canada",
            weather: 
            {
              temp: 10
            }
          },
        ];
      expect(destinations.length).toBe(3);
      
      var warmest = filter("warmestDestinations")(destinations, 15);
      expect(warmest.length).toBe(2);
      expect(warmest[0].city).toBe("Beijing");
      expect(warmest[1].city).toBe("Melbourne");
    }));
  });
});