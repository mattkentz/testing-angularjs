testingAngularApp.controller('TestingAngularCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.title = "Testing AngularJS Applications";
    
    //Populate with some data
    $scope.cities = [
        {
            name: "London",
            duration: "2"
        },
        {
            name: "Munich",
            duration: "3"
        },
        {
            name: "Zurich",
            duration: "2"
        },
        {
            name: "Rome",
            duration: "5"
        },
    ];
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