var module = angular.module("lkticket.admin");

module.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
} ]);

module.config([ "$routeProvider", function($routeProvider) {
	console.log("Route: " + $routeProvider);
	$routeProvider.when("/:id?", {
		templateUrl : "/pages/start/start.html",
		controller: "StartCtrl"
	});
	$routeProvider.otherwise({
		redirectTo : "/"
	});
} ]);
