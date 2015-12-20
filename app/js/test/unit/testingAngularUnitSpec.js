describe('Testing AngularJS Test Suite', function(){
  
  beforeEach(module('testingAngularApp'));
  
  describe('Testing AngularJS Controller', function(){

    var ctrl, rootScope, scope, timeout; 

    beforeEach(inject(function ($controller, $rootScope, $timeout) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      ctrl = $controller('testingAngularCtrl', {$scope:scope});
      timeout = $timeout;
    }));

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

    it('should remove error message after a few seconds', function () {
      rootScope.message = "Error";
      expect(rootScope.message).toBe("Error");
      rootScope.$apply();
      timeout.flush();
      expect(rootScope.message).toBeNull();
    });
  });
  
  describe('Testing AngularJS Filter', function(){
    var warmestDestinations;
    
    beforeEach(inject(function ($filter) {
      warmestDestinations = $filter("warmestDestinations");
    }));
    
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
      
      var warmest = warmestDestinations(destinations, 15);
      expect(warmest.length).toBe(2);
      expect(warmest[0].city).toBe("Beijing");
      expect(warmest[1].city).toBe("Melbourne");
    }));
  });
  
  describe('Testing AngularJS Service', function(){
    
    var conversionHelper;
    
    beforeEach(inject(function (_conversionHelper_) {
      conversionHelper = _conversionHelper_;
    }));
    
    it('should calculate the correct temperature in degrees celsius', function() {
      var kelvin = 300;
      var celsius = conversionHelper.convertKelvinToCelsius(kelvin);

      expect(celsius).toBe(27);
    }); 
    
  });
  
  describe('Testing AngularJS Directive', function(){
    
    var ctrl, httpBackend, isolateScope, rootScope, scope, template; 
    
    beforeEach(inject(function ($compile, $httpBackend, $rootScope) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      httpBackend = $httpBackend;
      
      scope.apiKey = 'xyz';
      
      scope.destination = {
        city: 'London',
        country: 'England'
      };
      
      var element = angular.element(
        '<div destination-directive destination="destination" api-key="apiKey" on-remove="remove()"></div>');
      template = $compile(element)(scope);
      scope.$digest();
      isolateScope = element.isolateScope();
      ctrl = element.controller();
    }));
    
    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should update the weather for the specified destination', function() {
      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=London&appid=" + scope.apiKey).respond(
        {
          weather: [{main : 'Rain', detail : 'Light rain'}], 
          main : { temp : 288 }
        }
      );

      isolateScope.getWeather(scope.destination);

      httpBackend.flush();

      expect(scope.destination.weather.main).toBe("Rain");
      expect(scope.destination.weather.temp).toBe(15);
    });
    
    it('should display error message when a message is returned', function() {
      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=London&appid=" + scope.apiKey).respond(
        {
          message: 'Weather unavailable'
        }
      );

      isolateScope.getWeather(scope.destination);

      expect(rootScope.message).toBeUndefined();
      httpBackend.flush();
      expect(rootScope.message).toBe('Weather unavailable');
    });
    
    it('should display error message when no data is returned', function() {
      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=London&appid=" + scope.apiKey).respond(
        {}
      );

      isolateScope.getWeather(scope.destination);

      expect(rootScope.message).toBeUndefined();
      httpBackend.flush();
      expect(rootScope.message).toBe('Could not retrieve weather for London');
    });
    
    it('should display error message when there is a problem with the request', function() {
      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=London&appid=" + scope.apiKey).respond(500);

      isolateScope.getWeather(scope.destination);

      expect(rootScope.message).toBeUndefined();
      httpBackend.flush();
      expect(rootScope.message).toBe('A server error has occurred');
    });
    
    it('should call the parent controller remove function', function () {
      scope.removeTest = 1;
      scope.remove = function () {
        scope.removeTest++;
      }
      
      isolateScope.onRemove();
      expect(scope.removeTest).toBe(2);
    });
    
    it('should generate the correct HTML structure', function () {
      var templateAsHtml = template.html();
      
      expect(templateAsHtml).toContain('London, England');
      
      scope.destination.city = 'Tokyo';
      scope.destination.country = 'Japan';
      
      scope.$digest();
      templateAsHtml = template.html();
      
      expect(templateAsHtml).toContain('Tokyo, Japan');
    });

  });
});