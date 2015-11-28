describe('Testing AngularJS Test Suite', function(){
  
  var ctrl, rootScope, scope; 
  
  beforeEach(module('testingAngularApp'));
  
  beforeEach(inject(function ($controller, $rootScope) {
    rootScope = $rootScope;
    scope = rootScope.$new();
    ctrl = $controller('testingAngularCtrl', {$scope:scope});
  }));
  
  afterEach(function() {
    //Cleanup code here
  });

  it('should initialize the scope correctly', function () {
    expect(scope.title).toBeDefined();
    expect(scope.title).toBe("Testing AngularJS Applications");
  });
  
  it('should add 2 destinations', function () {
    expect(scope.destinations).toBeDefined();
    expect(scope.destinations.length).toBe(0);
    
    scope.newDestination =
      {
        city : "London",
        country : "England"
      };

    scope.addDestination();    

    expect(scope.destinations.length).toBe(1);  
    expect(scope.destinations[0].city).toBe("London");
    expect(scope.destinations[0].country).toBe("England"); 

    scope.newDestination.city = "Frankfurt";
    scope.newDestination.country = "Germany";
    scope.addDestination();

    expect(scope.destinations.length).toBe(2);
    expect(scope.destinations[1].city).toBe("Frankfurt");
    expect(scope.destinations[1].country).toBe("Germany"); 
  });
  
  it('should remove a destination', function () {
    scope.destinations = 
      [
        {
          city: "Milan",
          country: "Italy"
        },
        {
          city: "New York",
          country: "USA"
        }
      ];

    expect(scope.destinations.length).toBe(2);  
    expect(scope.destinations[0].city).toBe("Milan");
    expect(scope.destinations[0].country).toBe("Italy"); 
    expect(scope.destinations[1]).toBeDefined();

    scope.removeDestination(0);

    expect(scope.destinations.length).toBe(1);
    expect(scope.destinations[0].city).toBe("New York");
    expect(scope.destinations[0].country).toBe("USA"); 
    expect(scope.destinations[1]).toBeUndefined();
  });
    
});