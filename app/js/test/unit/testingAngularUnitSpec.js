
describe('Testing AngularJS Test Suite', function() {

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

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should initialize the title in the scope', function() {
      expect(scope.title).toBeDefined();
      expect(scope.title).toBe("Testing AngularJS Applications");
    });

    it('should add 2 destinations to the destinations list', function () {
      expect(scope.destinations).toBeDefined();
      expect(scope.destinations.length).toBe(0);

      scope.newDestination = {
        city: "London",
        country: "England"
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
      expect(scope.destinations[0].city).toBe("London");
      expect(scope.destinations[0].country).toBe("England");
    });

    it('should remove a destination from the destinations list', function () {
      scope.destinations = [
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

      scope.removeDestination(0);

      expect(scope.destinations.length).toBe(1);
      expect(scope.destinations[0].city).toBe("Warsaw");
      expect(scope.destinations[0].country).toBe("Poland");
    });

    it('should remove error message after a fixed period of time', function () {
      rootScope.message = "Error";
      expect(rootScope.message).toBe("Error");

      rootScope.$apply();
      timeout.flush();

      expect(rootScope.message).toBeNull();
    });

  });

  describe('Testing AngularJS Filter', function () {
    it('should return only warm destinations', inject(function ($filter) {
      var warmest = $filter('warmestDestinations');

      var destinations = [
        {
          city: "Beijing",
          country: "China",
          weather: {
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
          weather: {
            temp: 12
          }
        },
        {
          city: "Lima",
          country: "Peru",
          weather: {
            temp: 15
          }
        }
      ];

      expect(destinations.length).toBe(4);

      var warmDestinations = warmest(destinations, 15);

      expect(warmDestinations.length).toBe(2);
      expect(warmDestinations[0].city).toBe("Beijing");
      expect(warmDestinations[1].city).toBe("Lima");
    }));
  });

  describe('Testing AngularJS Directive', function () {
    var scope, template, httpBackend, isolateScope, rootScope, conversionService;

    beforeEach(function () {
      module(function ($provide) {
        var MockConversionService = {
          convertKelvinToCelsius: function (temp) {
            return Math.round(temp - 273);
          }
        };

        $provide.value('conversionService', MockConversionService);
      });
    });

    beforeEach(inject(function ($compile, $rootScope, $httpBackend, _conversionService_) {
      scope = $rootScope.$new();
      rootScope = $rootScope;
      httpBackend = $httpBackend;
      conversionService = _conversionService_;

      scope.destination = {
        city: "Tokyo",
        country: "Japan"
      };

      scope.apiKey = "xyz";

      var element = angular.element(
      '<div destination-directive destination="destination" api-key="apiKey" on-remove="remove()"></div>"'
      );

      template = $compile(element)(scope);
      scope.$digest();

      isolateScope = element.isolateScope();
    }));

    it('should update the weather for a specific destination', function () {
      spyOn(conversionService, 'convertKelvinToCelsius').and.callFake(function (temp) {
        return temp - 273;
      });
      scope.destination = {
        city: "Melbourne",
        country: "Australia"
      };

      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey).respond(
        {
          weather: [{main: 'Rain', detail: 'Light rain'}],
          main: {temp: 288}
        });

      isolateScope.getWeather(scope.destination);

      httpBackend.flush();

      expect(scope.destination.weather.main).toBe("Rain");
      expect(scope.destination.weather.temp).toBe(15);
      expect(conversionService.convertKelvinToCelsius).toHaveBeenCalledWith(288);
    });

    it('should add a message if no city is found', function () {
      scope.destination = {
        city: "Melbourne",
        country: "Australia"
      };

      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey).respond(
        {});

      isolateScope.getWeather(scope.destination);

      httpBackend.flush();

      expect(rootScope.message).toBe("City not found");
    });

    it('should add a message when there is a server error', function () {
      spyOn(rootScope, '$broadcast');
      scope.destination = {
        city: "Melbourne",
        country: "Australia"
      };

      httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey).respond(500);

      isolateScope.getWeather(scope.destination);

      httpBackend.flush();

      expect(rootScope.message).toBe("Server error");
      expect(rootScope.$broadcast).toHaveBeenCalled();
      expect(rootScope.$broadcast).toHaveBeenCalledWith('messageUpdate',
        { type: 'error', message: 'Server Error' });
      expect(rootScope.$broadcast.calls.any()).toBeTruthy();
      expect(rootScope.$broadcast.calls.count()).toBe(1);
    });

  });
});
