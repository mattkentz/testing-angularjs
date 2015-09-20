testingAngularApp.controller('TestingAngularCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.title = "Testing AngularJS Applications";
    $scope.sort = "city";
    //Populate with some data
    $scope.destinations = [
        {
            city: "London",
            country: "England"
        },
        {
            city: "Munich",
            country: "Germany"
        },
        {
            city: "Zurich",
            country: "Switzerland"
        },
        {
            city: "Rome",
            country: "Italy"
        },
        {
            city : "Paris",
            country: "France"
        }
    ];
    $scope.newDestination = {};
    
    $scope.addDestination = function (isValid) {
        
        if(isValid) {
            $scope.destinations.push(
            { 
                city: $scope.newDestination.city, 
                country: $scope.newDestination.country
            });
        }
    }
    
    $scope.removeDestinationByIndex = function (index) {
        $scope.destinations.splice(index,1);
    };
    
    $scope.getWeatherForDestination = function(destinationObj) {
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+ destinationObj.city).success(function(response) {
            destinationObj.weather = {};
            destinationObj.weather.main = response.weather[0].main; //return only first weather present
            destinationObj.weather.temp = $scope.convertKelvinToCelsius(response.main.temp);
        });
    };
    
    $scope.convertKelvinToCelsius = function(temperature) {
        return Math.round(temperature - 273);
    }
  
}]);