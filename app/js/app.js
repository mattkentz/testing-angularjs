var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    
    $scope.title = "Testing AngularJS Applications";
    
}]);