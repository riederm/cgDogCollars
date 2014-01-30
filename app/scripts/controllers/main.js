'use strict';

angular.module('cgDogCollarsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.myInterval = 5000;
      var slides = $scope.slides = [
          {
              image: 'images/dogs/dog01.png',
          text: ''
          },
          {
              image: 'images/dogs/dog02.png',
             text: ''
          },
          {
              image: 'images/dogs/dog03.png',
            text: ''
          }
      ];
     
     
  });
