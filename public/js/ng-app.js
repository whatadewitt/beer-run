var RUN = angular.module( "RUN" )
	.config(function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/sitemanager/tools/', { templateUrl: 'partials/index.html', controller: '' })
        .when('/sitemanager/tools/browse/', { templateUrl: 'partials/browse.html', controller: 'ManageContentController' });
    });