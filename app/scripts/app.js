'use strict';

angular.module('cgDogCollarsApp', ['ui.bootstrap',
   // 'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
])
        .config(function($routeProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    })
                    .when('/collection', {
                        templateUrl: 'views/collection.html',
                        controller: 'CollectionCtrl'
                    })
                    .when('/designer', {
                      templateUrl: 'views/designer.html',
                      controller: 'DesignerCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        });
