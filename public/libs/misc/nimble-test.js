var app = angular.module("nimble",[])
app.controller('ContactCtrl',['$scope','$routeParams','$http','$rootScope', function($scope, $routeParams,$http) {
    $scope.getContacts = function(){
        var id = $routeParams.id;
        $http({
            method: 'GET',
            url: '/api/nimble/contact/'+id+'?code='+code
        }).then(function successCallback(response) {
            $scope.contact = response.data;
        }, function errorCallback(response) {
            $scope.contact = response.data;
        });
    };

    $scope.getContacts();


}]);

app.controller('ContactsCtrl',['$scope','$routeParams','$http','$rootScope', function($scope, $routeParams,$http) {

    $scope.contacts = null;






    $scope.getContacts = function(url){
        $http({
            method: 'GET',
            url: '/api/nimble/contacts?code='+code
        }).then(function successCallback(response) {
            $scope.contacts = response.data;
        }, function errorCallback(response) {
            $scope.contacts = response.data;
        });
    };
    $scope.getContactsId = function(){
        $http({
            method: 'GET',
            url: '/api/nimble/contacts/ids?code=' + code
        }).then(function successCallback(response) {
            $scope.contacts = JSON.stringify(response.data, null, 4);
        }, function errorCallback(response) {
            $scope.contacts = JSON.stringify(response.data, null, 4);
        });
    };

    $scope.createContact = function () {


        $http({
            method: 'POST',
            url: '/api/nimble/contacts/create',
            data:{
                firstname : $scope.firstname,
                lastname : $scope.lastname,
                code:code
            }
        }).then(function successCallback(response) {
            $scope.user = response.data;

        }, function errorCallback(response) {

        });

    }




}])


app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
    };
});
app.directive('loading',   ['$http' ,function ($http)
{
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    elm.show();
                }else{
                    elm.hide();
                }
            });
        }
    };

}])


/*
 routing
 */

app.run(function($rootScope,$route) {
    $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
        $rootScope.title = $route.current.title;
    });
});

app.config(function($routeProvider, $locationProvider){ /* the page routing */
    $locationProvider.html5Mode({
        enabled:true,
        requireBase: false,
        reloadOnSearch: false})

    $locationProvider.hashPrefix('!');


    $routeProvider.when("/nimble/contacts",
        {
            title:'contacts',
            templateUrl: '/nimble/contacts.html',
            controller: "ContactsCtrl"
        }).when("/nimble/contact/:id",
        {
            title:'contacts',
            templateUrl: '/nimble/contact-edit.html',
            controller: "ContactsCtrl"
        })
        .when("/nimble/notes",
        {
            title:'notes',
            templateUrl: '/nimble/notes.html',
            controller: "NotesCtrl",
        }).
        otherwise({
            title:'contacts',
            templateUrl: '/nimble/list-api.html'
        })


})


