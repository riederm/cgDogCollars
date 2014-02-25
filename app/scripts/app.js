'use strict';

angular.module('cgDogCollarsApp', ['ui.bootstrap',
   // 'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'dragAndDrop'
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
                    .when('/collardetail/:collarId', {
                      templateUrl: 'views/collardetail.html',
                      controller: 'CollardetailCtrl'
                    })
                    .when('/addRivets/:rivetId', {
                      templateUrl: 'views/addrivets.html',
                      controller: 'AddrivetsCtrl'
                    })
                    .when('/listRivets', {
                      templateUrl: 'views/listrivets.html',
                      controller: 'ListrivetsCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        });
