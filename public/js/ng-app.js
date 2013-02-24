var RUN = angular.module( "RUN", [] )
	.config(function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/', { templateUrl: '/partials/index.html', controller: 'HomeController' })
        .when('/create', { templateUrl: '/partials/createRun.html', controller: 'CreateRunController' })
        .when('/:runId/order', { templateUrl: '/partials/order.html', controller: 'OrderController' })
        .when('/:runId/run', { templateUrl: '/partials/viewRun.html', controller: 'ViewRunController' });
    });