'use strict';

angular.module('cgDogCollarsApp')
        .controller('CollardetailCtrl', ['$scope', '$routeParams', 
    function($scope, $routeParams) {
                $scope.collar = {
                    id: $routeParams.collarId,
                    name: "Collar" + $routeParams.collarId
                        
                };
            }
        ]);
