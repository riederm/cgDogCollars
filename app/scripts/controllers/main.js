'use strict';
angular.module('cgDogCollarsApp')
        .controller('MainCtrl', ['$scope', function($scope, $animate) {
                $scope.myInterval = 5000;
                $scope.carousel = {
                    slides: [
                        {image: 'images/dogs/dog01.png', text: ''},
                        {image: 'images/dogs/dog02.png', text: ''},
                        {image: 'images/dogs/dog03.png', text: ''}
                    ],
                    interval: 5000
                };

            }]);

// apply to the parrent of the element you want 
// angular animations to be disabled on    

angular.module('ui.bootstrap.setNgAnimate', ['ngAnimate'])
        .directive('setNgAnimate', ['$animate', function($animate) {
                return {
                    link: function($scope, $element, $attrs) {

                        $scope.$watch(function() {
                            return $scope.$eval($attrs.setNgAnimate, $scope);
                        }, function(valnew, valold) {
                            $animate.enabled(!!valnew, $element);
                        });


                    }
                };
            }]);