'use strict';

angular.module('cgDogCollarsApp')
  .directive('rivetPoint', function () {
    return {
      template: '<div ng-class = "{dragmode: enabled, highlight: highlight}"  class="rivet-point">\n\
                             <img ng-show="image" src="{{image}}" /> \n\
                         </div>',
      scope: {
            image: '=',
            showborder: '=',
            highlight: '=',
            enabled: '='
        },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          
      }
    };
  });
