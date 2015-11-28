var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    
  $scope.title = "Testing AngularJS Applications";

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
    
}]);