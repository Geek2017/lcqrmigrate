// Application Modules and Routing
angular
    .module('QrApp', ['ngRoute', 'angularUtils.directives.dirPagination'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html',
                controller: "loginCtrl"
            })
            .when('/enroll', {
                templateUrl: 'views/enroll.html',
                controller: "enrollCtrl"
            })
            .when('/privacy', {
                templateUrl: 'views/privacy.html'
            })



    });