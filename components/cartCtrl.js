var module = angular.module("lkticket.admin");
var cartCtrl = function($filter, $scope, Core, $attrs, cartService, $location) {
  var $ctrl = this;
  $ctrl.cart = cartService.getCart();

	$scope.selectedPerformance = {};
	$scope.modaldata = {
		categories: {},
		rates: {}
	};
	$scope.prices = [];
	$scope.show = {name: ""};

  $scope.reload = function() {
    $location.path("/");
  }

  $scope.pay = function() {
    alert("Betalt och klart!");
    $location.path("/");
  }

  $scope.saveCustomer = function() {
    console.log($scope.customer);
    $scope.customer = angular.copy({});
  }

  $scope.editShow = function(tickets) {

		$scope.prices = [];

    var uniqueCategories = _.sortedUniqBy(tickets, function(o) {
      return o.category_id;
    });

    Core.get("/admin/performances/" + tickets[0].performance_id).then(
      function(response) {

				$scope.selectedPerformance = response.data;

				Core.get("/admin/shows/" + $scope.selectedPerformance.show_id + "/rates").then(
		      function(response) {
		        $scope.modaldata.rates = response.data;
		      },
		      function(response) {
		        alert("Kunde inte hämta rates: " + response.status);
		      });

        Core.get("/admin/shows/" + $scope.selectedPerformance.show_id + "/categories")
          .then(
            function(response) {
              $scope.modaldata.categories = response.data;
              for (var a in $scope.modaldata.categories) {
                Core.get("/desk/categories/" + $scope.modaldata.categories[a].id + "/prices").then(
                  function(response) {

                    $scope.prices = _.concat($scope.prices, response.data);

										_.forEach(_.filter(tickets, {'category_id' : response.data[0].category_id}), function(ticket) {

											_.find($scope.prices, {'rate_id': ticket.rate_id, 'category_id' : ticket.category_id}).count = _.filter(tickets, {'rate_id': ticket.rate_id, 'category_id' : ticket.category_id}).length;

										});

                  },
                  function(error) {

                  }
                );
              }

            },
            function(response) {
              alert("Kunde inte hämta kategorier: " + response.status);
            });

      },
      function(response) {
        alert("Kunde inte hämta föreställningen: " + response.status);
      });



  }

}

module.controller("CartCtrl", cartCtrl);
