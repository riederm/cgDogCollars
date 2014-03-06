'use strict';

describe('Controller: ListcollarsCtrl', function () {

  // load the controller's module
  beforeEach(module('cgDogCollarsApp'));

  var ListcollarsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListcollarsCtrl = $controller('ListcollarsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
