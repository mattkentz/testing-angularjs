var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', function ($rootScope, $scope) {

  $scope.title = "Testing AngularJS Applications";

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
});
