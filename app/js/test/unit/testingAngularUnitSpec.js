describe('Testing AngularJS Test Suite', function(){

  beforeEach(module('testingAngularApp'));

  describe('Testing AngularJS Controller', function () {
    var scope, ctrl, httpBackend, timeout, rootScope;

    beforeEach(inject(function($controller, $rootScope, $httpBackend, $timeout) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      ctrl = $controller('testingAngularCtrl', {$scope:scope});
      httpBackend = $httpBackend;
      timeout = $timeout;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should initialize the title in the scope', function() {
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

    it('should remove a destination from the destinations list', function () {
      scope.destinations =
        [
          {
            city: "Paris",
            country: "France"
          },
          {
            city: "Warsaw",
            country: "Poland"
          }
        ];

      expect(scope.destinations.length).toBe(2);
      expect(scope.destinations[0].city).toBe("Paris");
      expect(scope.destinations[0].country).toBe("France");
      expect(scope.destinations[1]).toBeDefined();

      scope.removeDestination(0);

      expect(scope.destinations.length).toBe(1);
      expect(scope.destinations[0].city).toBe("Warsaw");
      expect(scope.destinations[0].country).toBe("Poland");
      expect(scope.destinations[1]).toBeUndefined();
    });

    it('should remove error message after a fixed period of time', function () {
      rootScope.message = "Error";
      expect(rootScope.message).toBe("Error");
      rootScope.$apply();

      timeout.flush();

      expect(rootScope.message).toBeNull();
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
            city: "Moscow",
            country: "Russia"
          },
          {
            city: "Mexico City",
            country: "Mexico",
            weather:
            {
              temp: 12
            }
          },
          {
            city: "Lima",
            country: "Peru",
            weather:
            {
              temp: 15
            }
          },
        ];
      expect(destinations.length).toBe(4);

      var warmestDestinations = filter("warmestDestinations")(destinations, 15);
      expect(warmestDestinations.length).toBe(2);
      expect(warmestDestinations[0].city).toBe("Beijing");
      expect(warmestDestinations[1].city).toBe("Lima");
    }));
  });

  describe('Testing AngularJS Directive', function(){

    var scope, template, httpBackend, isolateScope, rootScope;

    beforeEach(inject(function ($compile, $httpBackend, $rootScope) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      httpBackend = $httpBackend;

      scope.apiKey = 'xyz';

      scope.destination = {
        city: 'Tokyo',
        country: 'Japan'
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

    it('should update the weather for a specific destination', function() {
      scope.destination =
      {
        city : "Melbourne",
        country: "Australia"
      };

      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q="+ scope.destination.city +"&appid=" + scope.apiKey).respond(
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

    it('should add a message if no city is found', function() {
      scope.destination =
      {
        city : "Melbourne",
        country: "Australia"
      };

      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q="+ scope.destination.city +"&appid=" + scope.apiKey).respond({});

      isolateScope.getWeather(scope.destination);

      httpBackend.flush();

      expect(rootScope.message).toBe("City not found");
    });

    it('should add a message if there is a server error', function() {
      scope.destination =
      {
        city : "Melbourne",
        country: "Australia"
      };

      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q="+ scope.destination.city +"&appid=" + scope.apiKey).respond(500);

      isolateScope.getWeather(scope.destination);

      httpBackend.flush();

      expect(rootScope.message).toBe("Server Error");
    });

    it('should call the parent controller remove function', function () {
      scope.removeTest = 1;
      scope.remove = function () {
        scope.removeTest++;
      };

      isolateScope.onRemove();
      expect(scope.removeTest).toBe(2);
    });

    it('should generate the correct HTML structure', function () {
      var templateAsHtml = template.html();

      expect(templateAsHtml).toContain('Tokyo, Japan');

      scope.destination.city = 'London';
      scope.destination.country = 'England';

      scope.$digest();
      templateAsHtml = template.html();

      expect(templateAsHtml).toContain('London, England');
    });

  });
});
