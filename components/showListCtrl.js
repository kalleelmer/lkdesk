var module = angular.module("lkticket.admin");

var ShowListCtrl = function($filter, $scope, Core, $attrs, cartService) {
	var $ctrl = this;

	var selectedPerformance = {};

	$scope.formatDate = function(date) {
		return date.replace(" ", "T");
	};

	$ctrl.$onChanges = function(change) {
		if($attrs.sid){
			$ctrl.loadShow();
		}
	}

	$ctrl.loadShow = function() {

		console.log($attrs.sid);

		if ($attrs.sid != "{{selected}}") {
			Core.get("/admin/shows/" + $attrs.sid).then(function(response) {
				$scope.show = response.data;
				$ctrl.loadShowData();
			}, function(response) {
				alert("Kunde inte hämta nöje: " + response.status);
			});
		}
	}


	$ctrl.loadShowData = function() {
		Core.get("/admin/shows/" + $attrs.sid + "/performances").then(
			function(response) {
				var dates = {};
				for ( var i in response.data) { // Group by date
					var show = response.data[i];
					var key = show.start.substring(0, 10);
					dates[key] = dates[key] ? dates[key] : [];
					dates[key].push(show);
				}
				$scope.show.dates = dates;
			}, function(response) {
				alert("Kunde inte hämta föreställningar: " + response.status);
			});

		Core.get("/admin/shows/" + $attrs.sid + "/rates").then(
			function(response) {
				$scope.show.rates = response.data;

				Core.get("/admin/shows/" + $attrs.sid + "/categories")
					.then(
						function(response) {
							$scope.show.categories = response.data;

							for ( var i in $scope.show.categories) {
								var category = $scope.show.categories[i];
								getPrices(category);
							}

						},
						function(response) {
							alert("Kunde inte hämta platstyper: "
								+ response.status);
						})

			}, function(response) {
				alert("Kunde inte hämta biljettyper: " + response.status);
			});

	}

	var getPrices = function(category) {
		Core.get(
			"/admin/categories/" + category.id
				+ "/prices").then(function(response) {
			category.prices = [];

			for ( var i in response.data) {
				var price = response.data[i];
				category.prices[price.rate_id] = price;
			}

		}, function(response) {
			alert("Kunde inte hämta priserna: " + response.status);
		});
	}

	$scope.addToCart = function(category, rate, show) {

		var count = prompt("Antal");

		var ticket = {category: category,
		rate: rate,
		show: show,
		performance: selectedPerformance,
		count: count
		};

		if (count){
			cartService.addTicket(ticket);
		}
	}

	$scope.setSelectedPerformance = function(performance) {
		selectedPerformance = performance;
	}

}

module.controller("ShowListCtrl", ShowListCtrl);
