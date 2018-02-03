var module = angular.module("lkticket.admin");

var StartCtrl = function($filter, Cart, $scope, $http, User,
	$routeParams, Core, $sce, $location, Clippy) {

	$scope.selected = 1;
	$scope.cartId = Cart.getCart();

	console.log($scope.cartId);

	$scope.selectShow = function(selected) {
		$scope.selected = selected;
	}

}

module.controller("StartCtrl", StartCtrl);
