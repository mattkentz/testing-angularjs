var testingAngularApp = angular.module('testingAngularApp', []);

testingAngularApp.controller('TestingAngularCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.title = "Testing AngularJS Applications";
    
    $scope.phones = ['phone1', 'phone2', 'phone3'];
    
  
}]);