var testingAngularApp = angular.module('testingAngularApp', []);

testingAngularApp.controller('TestingAngularCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.title = "Testing AngularJS Applications";
    
    $scope.cities = [];
    $scope.newCity = {};
    
    $scope.addDestination = function (isValid) {
        
        if(isValid) {
            $scope.cities.push(
            { 
                name: $scope.newCity.name, 
                duration: $scope.newCity.duration
            });
        }
    }
    
    $scope.removeCityByIndex = function (index) {
        $scope.cities.splice(index,1);
    }
  
}]);