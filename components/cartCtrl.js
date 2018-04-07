var module = angular.module("lkticket.admin");
var cartCtrl = function($filter, $scope, Core, $attrs, Cart, $location,
	Printer, User, Notification) {
	var $ctrl = this;

	$scope.cart = function() {
		return Cart.getCart();
	}

	$scope.customer = function() {
		return Cart.customer;
	}

	if (!Printer.getSelectedPrinter() && !User.getUser().profile) {
		$("#setPrinter").modal()
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

	$scope.totalPrice = function() {
		return Cart.getSum();
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

		Cart.addTicket(ticket).then(function(response) {
			$scope.disableButton = false;
			Notification.success("Biljetten har lagts till");
		}, function(failure) {
			$scope.disableButton = false;
			Notification.error("Platserna är slut");
		});
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

	$scope.printTickets = function() {
		Cart.printAllTickets();
	}

	$scope.pay = function(method) {
		Cart.pay(method);
	}

	$scope.saveCustomer = function() {
		console.log($scope.customer);
		$scope.customer = angular.copy({});
	}

	$scope.createNewCart = function() {
		Cart.createNewCart();
	}

	$scope.valueGroupBY = function(group) {

		if (group.printed) {
			return true;
		} else {
			return false;
		}

	}

	$scope.cartEmpty = function() {
		return Cart.isEmpty();
	}

	$scope.removeBooking = function() {
		Cart.unassignCustomer(function() {
			Notification.success("Bokning borttagen");
		});
	}
}

module.controller("CartCtrl", cartCtrl);
