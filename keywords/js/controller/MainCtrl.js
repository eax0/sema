(function (a) {
    function MainCtrl($scope, $route, $routeParams, $location) {
        var self = this;
        self.scope = $scope;
        self.scope.$route = $route;
        self.scope.$location = $location;
        self.scope.$routeParams = $routeParams;
    }

    a.module(appId)
        .controller('MainCtrl', MainCtrl)
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/subject_list.html',
                    controller: 'SubjectListCtrl',
                })
                .when('/workarea/:subject', {
                    templateUrl: 'templates/workarea.html'
                    //controller: 'WorkAreaCtrl',
                });

            $locationProvider.html5Mode({
                enabled: true,
            });
        });
})(angular);