describe('TestingAngularCtrl', function(){
    // Remember to declare variables outside of the beforeEach block scope
    var rootScope, scope, ctrl;
    
    beforeEach(module('testingAngularApp'));
    
    // Inject any required services and controllers and map them to the local variables
    beforeEach(inject(function($controller, $rootScope){
        rootScope = $rootScope
        scope = rootScope.$new();
        ctrl = $controller('TestingAngularCtrl', {$scope : scope});
    }));


    it('should create a "cities" model and add 2 cities', function () {
        scope.newCity =
            {
                name : "London",
                duration : 5
            };
        
        scope.addDestination(true);    
        
        expect(scope.cities.length).toBe(1);   
        
        scope.newCity.name = "Frankfurt";
        scope.addDestination(true);
        
        expect(scope.cities.length).toBe(2);
        //Javascript arrays are 0 indexed
        expect(scope.cities[1].name).toBe("Frankfurt");        
    });
    
    //Lets try taking the test driven approach
    it('should remove a city with a specific index', function () {
        scope.cities = [
            {
                name : "Rome",
                duration : 5
            },
            {
                name : "Milan",
                duration : 2
            },
            {
                name : "Venice",
                duration : 3
            },
            
        ];
        
        expect(scope.cities.length).toBe(3);
        expect(scope.cities[1].name).toBe("Milan"); 
        
        scope.removeCityByIndex(1);
        
        expect(scope.cities.length).toBe(2);
        expect(scope.cities[1].name).toBe("Venice"); 
    });
});