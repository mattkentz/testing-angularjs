describe('Testing AngularJS Test Suite', function(){
  
  beforeEach(module('testingAngularApp'));

  it('should initialize the scope correctly', inject(function($controller) {
    var scope = {};
    var ctrl = $controller('testingAngularCtrl', {$scope:scope});
    expect(scope.title).toBeDefined();
    expect(scope.title).toBe("Testing AngularJS Applications");
  }));
    
});