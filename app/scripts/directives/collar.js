'use strict';

angular.module('cgDogCollarsApp')
        .directive('collar', function() {
            return {
                transclude: true,
                template: '<div class="collarContainer" ng-transclude></div>',
                restrict: 'E',
                link: function postLink(scope, element, attrs) {

                }
            };
        });
