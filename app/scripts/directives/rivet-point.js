'use strict';

angular.module('cgDogCollarsApp')
  .directive('rivetPoint', function () {
    return {
      template: '<div ng-class = "{dragmode: showborder, highlight: highlight}"  class="rivet-point">\n\
                             <img ng-show="image" src="{{image}}" /> \n\
                         </div>',
      scope: {
            image: '=',
            showborder: '=',
            highlight: '='
        },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          
      }
    };
  });
