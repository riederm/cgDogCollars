'use strict';

angular.module('cgDogCollarsApp')
  .controller('AddrivetsCtrl', function ($scope, $routeParams, $location) {
      
      if ($routeParams.rivetId){
          
      }
              
      $scope.rivet = new Object();
       $scope.save = function(){
        gapi.client.rivet.rivet.add($scope.rivet).execute(function(resp){
                $location.path("listRivets");
                console.log(resp);
            });
        };
  });
