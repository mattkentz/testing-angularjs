var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', function ($rootScope, $scope, $http, $timeout) {

  $scope.title = "Testing AngularJS Applications";
  $scope.apiKey = "3e913428f0759a6c8db3a0114bf38611";

  $scope.destinations = [];
  $scope.newDestination = {
    city: undefined,
    country: undefined
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
  };

  $scope.getWeather = function(destination) {
    $http.get('http://api.openweathermap.org/data/2.5/weather?q='+ destination.city + "&appid=" + $scope.apiKey)
      .then(function successCallback(response) {
        if (response.data.weather) {
          destination.weather = {};
          destination.weather.main = response.data.weather[0].main; //return only first weather present
          destination.weather.temp = $scope.convertKelvinToCelsius(response.data.main.temp);
        } else {
          $scope.message = "City not found";
        }
      }, function errorCallback(error) {
        $scope.message = "Server Error";
      }
    );
  };

  $scope.convertKelvinToCelsius = function(temperature) {
    return Math.round(temperature - 273);
  };

  $scope.messageWatcher = $scope.$watch('message', function () {
    if ($scope.message) {
      $timeout(function () {
        $scope.message = null;
      }, 3000);
    }
  });
});

testingAngluarApp.filter('warmestDestinations', function () {

  return function (destinations, minimumTemp) {
    var warmDestinations = [];
    angular.forEach(destinations, function (destination) {
      if (destination.weather && destination.weather.temp && destination.weather.temp >= minimumTemp) {
        warmDestinations.push(destination);
      }
    });

    return warmDestinations;
  };

});
