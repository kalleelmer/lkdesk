var module = angular.module("lkticket.admin");

var ShowListCtrl = function($filter, $scope, Core, $attrs) {
	var $ctrl = this;
	console.log($attrs.id);
	$scope.formatDate = function(date) {
		return date.replace(" ", "T");
	};

	Core.get("/admin/shows/" + $attrs.id).then(function(response) {
		$scope.show = response.data;
		$ctrl.loadShowData();
	}, function(response) {
		alert("Kunde inte hämta nöje: " + response.status);
	});

	$ctrl.loadShowData = function() {
		Core.get("/admin/shows/" + $attrs.id + "/performances").then(
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

		Core.get("/admin/shows/" + $attrs.id + "/rates").then(
			function(response) {
				$scope.show.rates = response.data;

				Core.get("/admin/shows/" + $attrs.id + "/categories")
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

			console.log($scope.show);

		}, function(response) {
			alert("Kunde inte hämta priserna: " + response.status);
		});
	}

	$scope.addCategory = function() {

		var name = prompt("Ange namn");
		if (!name) {
			return;
		}
		// TODO Lösa så att ett id skapas, annars går det inte att skapa nya
		// priser

		var category = {
			name : name,
		};

		Core.post("/admin/shows/" + $scope.id + "/categories", category).then(
			function(response) {
				$scope.show.categories.push(response.data);
			}, function(response) {
				alert("Kunde inte hämta rate: ", response.status);
			});
	};

}

module.controller("ShowListCtrl", ShowListCtrl);
