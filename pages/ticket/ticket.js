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

	$scope.refundTicket = function() {
		alert("Endast kortköp!");
		if (!confirm("Klipp sönder biljetten.")) {
			return;
		}
		if (!confirm("Ge " + $scope.ticket.price + " kr till kunden.")) {
			return;
		}
		Notification.info("Registrerar återköp...");
		var data = {
			method : "card",
			reference : null
		};
		$scope.working = true;
		Core.post("/desk/tickets/" + $scope.ticket.id + "/refund", data).then(
			function(response) {
				$scope.ticket = response.data;
				Notification.success("Återköp registrerat");
				$scope.working = false;
			}, function(failure) {
				Notification.error("Återköp mislyckades: " + failure.status);
				$scope.working = false;
			});
	}

	$rootScope.$on("LOGIN_SUCCESS", function(event, data) {
		reloadTicket();
	});

	if (User.loggedIn()) {
		reloadTicket();
	}
}

module.controller("TicketCtrl", TicketCtrl);
