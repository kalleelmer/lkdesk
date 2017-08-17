var module = angular.module("lkticket.admin");
var cartCtrl = function($filter, $scope, Core, $attrs, cartService) {
	var $ctrl = this;

  $ctrl.cart = cartService.getCart();
}

module.controller("CartCtrl", cartCtrl);
