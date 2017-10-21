var module = angular.module("lkticket.admin");

var ShowListCtrl = function($filter, $scope, Core, $attrs, cartService) {
  var $ctrl = this;

  $scope.selectedPerformance = {};
  $scope.modaldata = {
    categories: {},
    rates: {}
  };
  $scope.prices = [];

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
        $ctrl.getRateAndCategories();
      }, function(response) {
        alert("Kunde inte hämta nöje: " + response.status);
      });
    }
  }

  $ctrl.getRateAndCategories = function() {

    Core.get("/admin/shows/" + $attrs.sid + "/rates").then(
      function(response) {
        $scope.modaldata.rates = response.data;
      },
      function(response) {
        alert("Kunde inte hämta rates: " + response.status);
      });

    Core.get("/admin/shows/" + $attrs.sid + "/categories")
      .then(
        function(response) {
          $scope.modaldata.categories = response.data;

          for (var a in $scope.modaldata.categories) {
            Core.get("/desk/categories/" + $scope.modaldata.categories[a].id + "/prices").then(
              function(response) {

                $scope.prices = _.concat($scope.prices, response.data);

              },
              function(error) {

              }
            );
          }

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

  }

  $scope.setSelectedPerformance = function(performance) {
    $scope.selectedPerformance = performance;
  }

}

module.controller("ShowListCtrl", ShowListCtrl);
