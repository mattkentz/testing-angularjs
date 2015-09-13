describe('TestingAngularCtrl', function(){

  beforeEach(module('testingAngularApp'));

  it('should create "phones" model with 3 phones', inject(function($controller) {
    var scope = {},
        ctrl = $controller('TestingAngularCtrl', {$scope:scope});

    expect(scope.phones.length).toBe(3);
  }));

});