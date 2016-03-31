var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', function ($rootScope, $scope, $http) {

  $scope.title = "Testing AngularJS Applications";
  $scope.apiKey = "2de143494c0b295cca9337e1e96b00e0";

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
        }
      }, function errorCallback(error) {
        console.log(error);
      }
    );
  };

  $scope.convertKelvinToCelsius = function(temperature) {
    return Math.round(temperature - 273);
  };
});
