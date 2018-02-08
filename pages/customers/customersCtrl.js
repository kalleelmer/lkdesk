var module = angular.module("lkticket.admin");

var CustomersCtrl = function($filter, Cart, $scope, $http, User,
  $routeParams, Core, $sce, $location, Clippy) {

  $scope.cart = Cart.getCart();
  $scope.profile = User.getUser().profile;

  Core.get("/desk/profiles/" + $scope.profile.id + "/customers/").then(function(response) {
    $scope.customers = response.data;
  }, function(response) {
    alert("Kunde inte hämta kunder : " + response.status);
  });

  $scope.getCustomer = function(id) {
    Core.get("/desk/customers/" + id).then(
      function(response) {
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

  $scope.createCustomer = function(customer) {
    customer.profile_id = $scope.profile.id;
    Core.post("/desk/customers/", customer).then(
      function(response) {
        $scope.customers.push(response.data);
      },
      function(error) {
        Clippy.say("Fel i skapning av kund: " + error.status)
      }
    )
  };

  $scope.selectOrder = function(order) {
    Cart.getCartById(order);
  }

  $scope.assignCartToCustomer = function() {
    Cart.assignCartToCustomer($scope.selectedCustomer.id, function() {
    	$scope.getCustomer($scope.selectedCustomer.id);
    });
  }


    if ($scope.cart.customer_id > 0) {
      $scope.getCustomer($scope.cart.customer_id);
    }

}

module.controller("CustomersCtrl", CustomersCtrl);
