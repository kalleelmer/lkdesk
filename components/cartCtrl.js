var module = angular.module("lkticket.admin");
var cartCtrl = function($filter, $scope, Core, $attrs, cartService, $location) {
	var $ctrl = this;
	$scope.cart = cartService.getCart();
	$scope.history = cartService.getHistory();

	$scope.selectedPerformance = {};
	$scope.modaldata = {
		categories : {},
		rates : {}
	};
	$scope.prices = [];
	$scope.show = {
		name : ""
	};

	$scope.disableButton = false;

	$scope.changeCart = function(id) {
		cartService.getCartById(id);
	}

	$scope.addTicket = function(ticket) {

		console.log(ticket);

		var ticket = {
			category_id : ticket.category_id,
			performance : {
				id : ticket.performance_id
			},
			rate_id : ticket.rate_id,
			count : 1
		}

		$scope.disableButton = true;

		cartService.addTicket(ticket, function(response) {
			$scope.disableButton = false;
			if (response == true) {

			} else {
				console.log(response);
				alert("Tyvärr fanns det inte fler biljetter: "
					+ response.status)
			}
		})
	}

	$scope.removeTicket = function(ticket) {
		$scope.disableButton = true;
		cartService.removeTicket(ticket, function() {
			$scope.disableButton = false;
		});
	}

	$scope.emptyCart = function() {
		cartService.removeAllTickets();
	}

	$scope.pay = function() {

		$scope.createNewCart();

		Core.post("/" + $scope.cart.cartObject.id + "/payments", {
			method : "cash"
		}).then(function() {

		}, function(error) {
			console.log(error.status);
		});

	}

	$scope.saveCustomer = function() {
		console.log($scope.customer);
		$scope.customer = angular.copy({});
	}

}

module.controller("CartCtrl", cartCtrl);
