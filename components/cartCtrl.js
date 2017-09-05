var module = angular.module("lkticket.admin");
var cartCtrl = function($filter, $scope, Core, $attrs, cartService, $location) {
	var $ctrl = this;
  $ctrl.cart = cartService.getCart();

	$scope.reload = function() {
		console.log("Hej");
		$location.path("/");
	}

	$scope.pay = function() {
		alert("Betalt och klart!");
		$location.path("/");
	}

}

module.controller("CartCtrl", cartCtrl);
