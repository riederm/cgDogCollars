'use strict';

describe('Controller: ListrivetsCtrl', function () {

  // load the controller's module
  beforeEach(module('cgDogCollarsApp'));

  var ListrivetsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListrivetsCtrl = $controller('ListrivetsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
