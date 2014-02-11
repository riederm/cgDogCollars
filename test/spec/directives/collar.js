'use strict';

describe('Directive: collar', function () {

  // load the directive's module
  beforeEach(module('cgDogCollarsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<collar></collar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the collar directive');
  }));
});
