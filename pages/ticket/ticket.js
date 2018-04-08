var module = angular.module("lkticket.admin");

var TicketCtrl = function($rootScope, $scope, $http, User, Core, $routeParams,
	Notification, $location) {

	$scope.ticketID = $routeParams.id ? $routeParams.id : "";

	var reloadTicket = function() {
		Core.get("/desk/tickets/" + $scope.ticketID).then(
			function(response) {
				$scope.ticket = response.data;
			},
			function(response) {
				Notification.error("Biljetten kunde inte hämtas: "
					+ response.status);
			});
	}

	$scope.showTicket = function() {
		if ($scope.ticketID) {
			$location.path("/ticket/" + $scope.ticketID);
		}
	}

	$rootScope.$on("LOGIN_SUCCESS", function(event, data) {
		reloadTicket();
	});

	if (User.loggedIn()) {
		reloadTicket();
	}
}

module.controller("TicketCtrl", TicketCtrl);
