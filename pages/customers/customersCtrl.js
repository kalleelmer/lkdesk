var module = angular.module("lkticket.admin");

var CustomersCtrl = function($filter, cartService, $scope, $http, User,
	$routeParams, Core, $sce, $location) {

	Core.get("/desk/customers").then(function(response) {
		$scope.customers = response.data;
	}, function(response) {
		alert("Kunde inte hämta kunder: " + response.status);
	});

	$scope.getCustomer = function(id) {
		Core.get("/desk/customers/" + id).then(
			function(response) {
				$scope.selectedCustomer = response.data;
				Core.get("/desk/customers/" + id + "/orders/").then(
					function(response) {
						$scope.selectedCustomer.orders = response.data;
					}, function(response) {
						alert("Kunde inte hämta kunder: " + response.status);
					});
			}, function(response) {
				alert("Kunde inte hämta kund: " + response.status);
			});
	}

	$scope.selectOrder = function(order) {
		cartService.getCartById(order);
	}

}

module.controller("CustomersCtrl", CustomersCtrl);
