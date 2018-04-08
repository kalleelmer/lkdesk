var module = angular.module("lkticket.admin");

module.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
} ]);

module.config([ "$routeProvider", function($routeProvider) {
	console.log("Route: " + $routeProvider);
	$routeProvider.when("/", {
		templateUrl : "/pages/start/start.html?v=BUILD_NUMBER",
		controller : "StartCtrl"
	});
	$routeProvider.when("/customers", {
		templateUrl : "/pages/customers/customers.html?v=BUILD_NUMBER",
		controller : "CustomersCtrl"
	});
	$routeProvider.when("/reservations", {
		templateUrl : "/pages/reservations/reservations.html?v=BUILD_NUMBER",
		controller : "ReservationsCtrl"
	});
	$routeProvider.when("/settings", {
		templateUrl : "/pages/settings/settings.html?v=BUILD_NUMBER",
		controller : "SettingsCtrl"
	});
	$routeProvider.when("/favorites", {
		templateUrl : "/pages/favorites/favorites.html?v=BUILD_NUMBER",
		controller : "FavCtrl"
	});
	$routeProvider.when("/ticket", {
		templateUrl : "/pages/ticket/ticket.html?v=BUILD_NUMBER",
		controller : "TicketCtrl"
	});
	$routeProvider.when("/ticket/:id", {
		templateUrl : "/pages/ticket/ticket.html?v=BUILD_NUMBER",
		controller : "TicketCtrl"
	});
	$routeProvider.otherwise({
		redirectTo : "/"
	});
} ]);
