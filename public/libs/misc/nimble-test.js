app = angular.module("nimble")
app.controller('NimbleCtrl', function($scope, $http) {


})


/*
 routing
 */
app.config(function($routeProvider, $locationProvider){ /* the page routing */
    $locationProvider.html5Mode({
        enabled:true,
        requireBase: false,
        reloadOnSearch: false})

    $locationProvider.hashPrefix('!');

    $routeProvider.when("/contacts",
        {
            title:'param',
            templateUrl: '/nimble/contact-list.html',
            controller: "NimbleCtrl",
            controllerAs: "app"
        })


})


