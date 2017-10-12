var module = angular.module("lkticket.admin");

var ShowListCtrl = function($filter, $scope, Core, $attrs, cartService) {
  var $ctrl = this;

  $scope.selectedPerformance = {};

  $scope.ticketsToAdd = [];

  $scope.addTicketToAdd = function(ticket) {

    for (var i = 0; i < $scope.ticketsToAdd.length; i++) {
      if ($scope.ticketsToAdd[i].category_id == ticket.category_id && $scope.ticketsToAdd[i].rate_id == ticket.rate_id && $scope.ticketsToAdd[i].show == ticket.show) {
        $scope.ticketsToAdd[i].count = ticket.count;
        return;
      }
    }

    $scope.ticketsToAdd.push(ticket);
    console.log($scope.ticketsToAdd);
  }

  $scope.formatDate = function(date) {
    return date.replace(" ", "T");
  };

  $ctrl.$onChanges = function(change) {
    if ($attrs.sid) {
      $ctrl.loadShow();
    }
  }

  $ctrl.loadShow = function() {

    console.log($attrs.sid);

    if ($attrs.sid != "{{selected}}") {
      Core.get("/admin/shows/" + $attrs.sid).then(function(response) {
        $scope.show = response.data;
        $ctrl.loadShowData();
				$ctrl.loadShowMatrice();
      }, function(response) {
        alert("Kunde inte hämta nöje: " + response.status);
      });
    }
  }

  $ctrl.loadShowMatrice = function() {

    Core.get("/admin/shows/" + $attrs.sid + "/categories")
      .then(
        function(response) {
          var categories = response.data;

					Core.get("/admin/shows/" + $attrs.sid + "/rates").then(
						function(response) {
							var rates = response.data;
							console.log(categories);

							for (var i in categories) {
								categories[i].rates = [];

								for (var n in rates) {

									rates[n].price = 10;
									categories[i].rates.push(rates[n]);

								}

		          }

							console.log(categories);

						},
						function(response) {
							alert("Kunde inte hämta rates: " + response.status);
						});

        },
        function(response) {
          alert("Kunde inte hämta kategorier: " + response.status);
        });

  }

  $ctrl.loadShowData = function() {
    Core.get("/admin/shows/" + $attrs.sid + "/performances").then(
      function(response) {
        var dates = {};
        for (var i in response.data) { // Group by date
          var show = response.data[i];
          var key = show.start.substring(0, 10);
          dates[key] = dates[key] ? dates[key] : [];
          dates[key].push(show);
        }
        $scope.show.dates = dates;
      },
      function(response) {
        alert("Kunde inte hämta föreställningar: " + response.status);
      });

    Core.get("/admin/shows/" + $attrs.sid + "/rates").then(
      function(response) {
        $scope.show.rates = response.data;

        Core.get("/admin/shows/" + $attrs.sid + "/categories")
          .then(
            function(response) {
              $scope.show.categories = response.data;

              for (var i in $scope.show.categories) {
                var category = $scope.show.categories[i];
                getPrices(category);
              }

              console.log($scope.show);

            },
            function(response) {
              alert("Kunde inte hämta platstyper: " +
                response.status);
            })

      },
      function(response) {
        alert("Kunde inte hämta biljettyper: " + response.status);
      });

  }

  var getPrices = function(category) {
    Core.get(
      "/admin/categories/" + category.id +
      "/prices").then(function(response) {
      category.prices = [];

      for (var i in response.data) {
        var price = response.data[i];
        category.prices[price.rate_id] = price;
      }

    }, function(response) {
      alert("Kunde inte hämta priserna: " + response.status);
    });
  }

  $scope.addTicketsToCart = function() {
    for (var i = 0; i < $scope.ticketsToAdd.length; i++) {
      $scope.addToCart($scope.ticketsToAdd[i])
    }

    //TODO fixa felhantering

    $scope.ticketsToAdd = [];

  }

  $scope.getPriceOfCart = function() {

    var price = 0;

    for (var i = 0; i < $scope.ticketToAdd.length; i++) {
      price += $scope.ticketToAdd[i].price;
    }

    return price;
  }

  $scope.addToCart = function(ticket) {

    ticket.performance = $scope.selectedPerformance;

    if (ticket.count) {
      cartService.addTicket(ticket);
    }
  }

  $scope.setSelectedPerformance = function(performance) {
    $scope.selectedPerformance = performance;
    console.log(performance);
  }

}

module.controller("ShowListCtrl", ShowListCtrl);
