'use strict';

angular.module('cgDogCollarsApp')
  .controller('ListrivetsCtrl', function ($scope) {
      $scope.rivets = [];
      gapi.client.rivet.rivets.list().execute(function(resp){
                $scope.$apply(function() {
                    for(var i = 0; i<resp.collections.length; i++){
                        $scope.rivets = $scope.rivets.concat(resp.collections[i].rivets);
                    }
                });                
            });
  });
