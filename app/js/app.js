var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {
    
  $scope.title = "Testing AngularJS Applications";
  $scope.apiKey = "2de143494c0b295cca9337e1e96b00e0";

  $scope.destinations = [];
  $scope.newDestination = {
    city: null,
    country: null
  };

  $scope.addDestination = function () {
    $scope.destinations.push(
    { 
      city: $scope.newDestination.city, 
      country: $scope.newDestination.country
    });
  };
  
  $scope.removeDestination = function (index) {
    $scope.destinations.splice(index, 1);
  }
  
  $scope.messageWatcher = $rootScope.$watch('message', function () {
    if ($rootScope.message) {
      $timeout(function () {
        $rootScope.message = null;
      }, 3000);
    }
  });
    
}]);

testingAngluarApp.filter('warmestDestinations', function () {
  
  return function (destinations, minimumTemp) {
    var warmDestinations = [];
    angular.forEach(destinations, function (destination) {
      if (destination.weather && destination.weather.temp && destination.weather.temp > minimumTemp) {
        warmDestinations.push(destination);
      }
    });
    
    return warmDestinations;
  };
  
});

testingAngluarApp.service('conversionHelper', function () {
  var conversionHelper = 
    {
      convertKelvinToCelsius: function (temperature) {
        return Math.round(temperature - 273);
      } 
    };
  
  return conversionHelper;
  
});

testingAngluarApp.directive('destinationDirective', function () {
  return {
    scope: {
      destination: '=',
      apiKey: '=',
      onRemove: '&'
    },
    controller: function (conversionHelper, $http, $rootScope, $scope) {
      $scope.getWeather = function(destination) {
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+ destination.city + "&appid=" + $scope.apiKey)
          .then(function successCallback(response) {
            if (response.data.weather) {
              destination.weather = {};
              destination.weather.main = response.data.weather[0].main; //return only first weather present
              destination.weather.temp = conversionHelper.convertKelvinToCelsius(response.data.main.temp); 
            } else if (response.data.message) {
              $rootScope.message = response.data.message;
            }
            }, function errorCallback(response) {
              $rootScope.message = "Could not retrieve weather for " + destination.city;
            }
          );
      };  
      
    },
    template: '<span>{{destination.city}}, {{destination.country}} </span>' +
        '<span ng-if="destination.weather"> - {{destination.weather.main}}, {{destination.weather.temp}}C</span>' +
        '<button ng-click="onRemove()">Remove</button>' +
        '<button ng-click="getWeather(destination)">Update Weather</button>'
  };
});