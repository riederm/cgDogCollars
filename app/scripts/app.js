'use strict';

angular.module('cgDogCollarsApp', ['ui.bootstrap'
,  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/collection', {
        templateUrl: 'views/collection.html',
        controller: 'CollectionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
