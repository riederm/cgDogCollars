'use strict';

angular.module('cgDogCollarsApp')
        .controller('DesignerCtrl', function($scope) {
            $scope.rivetGroups = [
                {
                    title: "Spitznieten",
                    rivets: [
                        {image: "images/rivets/number_1.png"},
                        {image: "images/rivets/number_1.png"},
                        {image: "images/rivets/number_1.png"}
                    ]
                },
                {
                    title: "Motivnieten",
                    rivets: [
                        {image: "images/rivets/number_2.png"},
                        {image: "images/rivets/number_2.png"},
                        {image: "images/rivets/number_2.png"}
                    ]
                },
                {
                    title: "Strassnieten",
                    rivets: [
                        {image: "images/rivets/number_3.png"},
                        {image: "images/rivets/number_3.png"},
                        {image: "images/rivets/number_3.png"}
                    ]
                },
                {
                    title: "Andere",
                    rivets: [
                        {image: "images/rivets/number_4.png"},
                        {image: "images/rivets/number_4.png"},
                        {image: "images/rivets/number_4.png"}
                    ]
                }
            ];
        });
