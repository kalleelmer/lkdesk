var module = angular.module("lkticket.admin");

var CustomersCtrl = function($filter, Cart, $scope, $http, User,
	$routeParams, Core, $sce, $location, Clippy) {

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

	$scope.createCustomer = function(customer) {
    Core.post("/desk/customers/", customer).then(
      function(response) {
				$scope.customers.push(response.data);
      },
      function(error) {
				Clippy.say("Fel i skapning av kund: " + error.status)
      }
    )};

	$scope.selectOrder = function(order) {
		Cart.getCartById(order);
	}

	$scope.cart = Cart.getCart();

	$scope.createNewCartToCustomer = function() {
		Cart.createNewCart();
		Cart.assignCartToCustomer($scope.selectedCustomer.id);
	}

}

module.controller("CustomersCtrl", CustomersCtrl);
