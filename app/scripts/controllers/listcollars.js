'use strict';

angular.module('cgDogCollarsApp')
  .controller('ListcollarsCtrl', function ($scope, $location) {
  
    $scope.collars = [];
    gapi.client.rivet.collar.list().execute(function(resp){
        $scope.$apply(function(){
            $scope.collars = resp.collars;
        });
    });

  });
