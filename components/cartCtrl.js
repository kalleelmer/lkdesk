var module = angular.module("lkticket.admin");
var cartCtrl = function($filter, $scope, Core, $attrs, Cart, $location) {
	var $ctrl = this;
	$scope.cart = Cart.getCart();
	$scope.history = Cart.getHistory();
	$scope.customer = function() {
		return Cart.customer;
	}

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
		Cart.getCartById(id);
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

		Cart.addTicket(ticket, function(response) {
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
		Cart.removeTicket(ticket, function() {
			$scope.disableButton = false;
		});
	}

	$scope.emptyCart = function() {
		Cart.removeAllTickets();
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
