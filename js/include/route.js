var module = angular.module("lkticket.admin");

module.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
} ]);

module.config([ "$routeProvider", function($routeProvider) {
	console.log("Route: " + $routeProvider);
	$routeProvider.when("/", {
		templateUrl : "/pages/start/start.html",
		controller : "StartCtrl"
	});
	$routeProvider.when("/customers", {
		templateUrl : "/pages/customers/customers.html",
		controller : "CustomersCtrl"
	});
	$routeProvider.when("/reservations", {
		templateUrl : "/pages/reservations/reservations.html",
		controller : "ReservationsCtrl"
	});
	$routeProvider.when("/reports", {
		templateUrl : "/pages/reports/reports.html",
		controller : "ReportsCtrl"
	});
	$routeProvider.when("/settings", {
		templateUrl : "/pages/settings/settings.html",
		controller : "SettingsCtrl"
	});
	$routeProvider.when("/favorites", {
		templateUrl : "/pages/favorites/favorites.html",
		controller : "FavCtrl"
	});
	$routeProvider.otherwise({
		redirectTo : "/"
	});
} ]);
