var module = angular.module("lkticket.admin");

<<<<<<< HEAD
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

				console.log(response.data);
        $scope.selectedCustomer = response.data;
        Core.get("/desk/customers/" + id + "/orders/").then(
          function(response) {
            $scope.selectedCustomer.orders = response.data;
          },
          function(response) {
            alert("Kunde inte hämta kunder: " + response.status);
          });
      },
      function(response) {
        alert("Kunde inte hämta kund: " + response.status);
      });
  }

  $scope.selectOrder = function(order) {
    cartService.getCartById(order);
  }

  $scope.createCustomer = function(customer) {
    Core.post("/desk/customers/", customer).then(
      function(response) {
				$scope.customers.push(response.data);
      },
      function(error) {

      }
    )
  }
=======
var CustomersCtrl = function($filter, Cart, $scope, $http, User,
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
		Cart.getCartById(order);
	}
>>>>>>> 17da9c0efd21a49b18b1be40b0e19f34110f5fa8

}

module.controller("CustomersCtrl", CustomersCtrl);
