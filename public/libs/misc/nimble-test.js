var app = angular.module("nimble",[])

app.controller('TasksCtrl',['$scope','$routeParams','$http','$rootScope','$location', function($scope, $routeParams,$http,$rootScope,$location) {
    $scope.createTask = function () {


        var due_date = moment($scope.due_date).format("MM-DD-YYYY hh:mm");

        $http({
            method: 'POST',
            url: '/api/nimble/task',
            data:{
                id: $rootScope.contact_id,
                notes: $scope.notes,
                subject: $scope.subject,
                due_date: due_date
            }
        }).then(function successCallback(response) {
            $location.path('/nimble/contact/'+$rootScope.contact_id);
        }, function errorCallback(response) {

        });

    }
}]);
app.controller('ContactCtrl',['$scope','$rootScope','$routeParams','$http', function($scope,$rootScope, $routeParams,$http) {

    $rootScope.contact_id = $routeParams.id;
    $scope.getContactInfo = function(){
        var id = $routeParams.id;
        $http({
            method: 'GET',
            url: '/api/nimble/contact/'+id
        }).then(function successCallback(response) {
            $scope.contact = response.data;
        }, function errorCallback(response) {
            $scope.contact = response.data;
        });
    };

    $scope.updateContact = function () {

        var id = $routeParams.id;
        $http({
            method: 'PUT',
            url: '/api/nimble/'+id,
            data:{
                firstname : $scope.contact.fields["first name"]["0"].value,
                lastname : $scope.contact.fields["last name"]["0"].value
            }
        }).then(function successCallback(response) {
            $scope.user = response.data;

        }, function errorCallback(response) {

        });

    }

    $scope.getContactInfo();


}]);

app.controller('NotesCtrl',['$scope','$rootScope','$routeParams','$http','$location', function($scope,$rootScope, $routeParams,$http,$location) {
    $scope.createNote = function () {

        $http({
            method: 'POST',
            url: '/api/nimble/notes/create',
            data:{
                contact_id : $rootScope.contact_id,
                note : $scope.note,
                note_preview : $scope.note_preview

            }
        }).then(function successCallback(response) {
               $location.path('/nimble/contact/'+$rootScope.contact_id);
        }, function errorCallback(response) {

        });

    }
    $scope.getNotes = function () {

        $http({
            method: 'GET',
            url: '/api/nimble/contact/'+$rootScope.contact_id+'/notes',
        }).then(function successCallback(response) {
               $scope.notes = response.data;
        }, function errorCallback(response) {

        });

    }
    //$scope.getNotes();


}]);

app.controller('ContactsCtrl',['$scope','$routeParams','$http', function($scope, $routeParams,$http,$state) {

    $scope.contacts = null;

    $scope.getContacts = function(url){
        $http({
            method: 'GET',
            url: '/api/nimble/contacts'
        }).then(function successCallback(response) {
            $scope.contacts = response.data;
        }, function errorCallback(response) {
            $scope.contacts = response.data;
        });
    };
    $scope.getContactsId = function(){
        $http({
            method: 'GET',
            url: '/api/nimble/contacts/ids'
        }).then(function successCallback(response) {
            $scope.contacts = JSON.stringify(response.data, null, 4);
        }, function errorCallback(response) {
            $scope.contacts = JSON.stringify(response.data, null, 4);
        });
    };

    $scope.deleteContact = function (id) {
        $http({
            method: 'DELETE',
            url: '/api/nimble/contact/'+id
        }).then(function successCallback(response) {

            $scope.getContacts();

        }, function errorCallback(response) {

        });


    }

    $scope.createContact = function () {


        $http({
            method: 'POST',
            url: '/api/nimble/contacts/create',
            data:{
                firstname : $scope.firstname,
                lastname : $scope.lastname

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
                templateUrl: '/nimble/note-list.html',
                controller: "NotesCtrl"
            })
        .when("/nimble/notes/create",
            {
                title:'notes',
                templateUrl: '/nimble/note-create.html',
                controller: "NotesCtrl"
            })
        .when("/nimble/tasks/create",
            {
                title:'tasks',
                templateUrl: '/nimble/task-create.html',
                controller: "TasksCtrl"
            })

        .otherwise({
            title:'contacts',
            templateUrl: '/nimble/contacts.html',
            controller: "ContactsCtrl"
        })


})
