'use strict';

describe('Controller: AddrivetsCtrl', function () {

  // load the controller's module
  beforeEach(module('cgDogCollarsApp'));

  var AddrivetsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddrivetsCtrl = $controller('AddrivetsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
