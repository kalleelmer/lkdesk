var module = angular.module("lkticket.admin");

var ShowListCtrl = function($filter, $scope, Core, $attrs, Cart, User, Notification) {
	var $ctrl = this;

	console.log($attrs.sid);

	$scope.selectedPerformance = {};
	$scope.modaldata = {
		categories : {},
		rates : {}
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
			Core.get("/desk/shows/" + $attrs.sid).then(function(response) {
				$scope.show = response.data;
				$ctrl.loadShowData();
				$ctrl.getRateAndCategories();
			}, function(response) {
				Notification.error("Kunde inte hämta nöje: " + response.status);
			});
		} else {
			Core.get("/desk/shows/1").then(function(response) {
				$scope.show = response.data;
				$ctrl.loadShowData();
				$ctrl.getRateAndCategories();
			}, function(response) {
				Notification.error("Kunde inte hämta nöje: " + response.status);
			});
		}
	}

	$ctrl.getRateAndCategories = function() {

		Core.get("/desk/shows/" + $attrs.sid + "/rates").then(
			function(response) {
				$scope.modaldata.rates = response.data;
			}, function(response) {
				Notification.error("Kunde inte hämta priser: " + response.status);
			});

		Core.get("/desk/shows/" + $attrs.sid + "/categories").then(
			function(response) {
				$scope.modaldata.categories = response.data;

				for ( var a in $scope.modaldata.categories) {
					Core.get(
						"/desk/categories/" + $scope.modaldata.categories[a].id
							+ "/prices").then(function(response) {

						$scope.prices = _.concat($scope.prices, response.data);

					}, function(error) {

					});
				}

			}, function(response) {
				Notification.error("Kunde inte hämta kategorier: " + response.status);
			});

	}

	$ctrl.loadShowData = function() {
		Core.get("/desk/shows/" + $attrs.sid + "/performances").then(
			function(response) {
				$scope.performances = response.data;
				for ( var i in response.data) { // Group by date
					var perf = response.data[i];
					perf.date = new Date(perf.start).toISOString().substring(0,
						10);
					$ctrl.loadAvailability(perf)
				}
			}, function(response) {
				Notification.error("Kunde inte hämta föreställningar: " + response.status);
			});

	}

	$ctrl.loadAvailability = function(perf) {
		var profile_id = User.getProfile().id;
		var req = Core.get("/desk/performances/" + perf.id + "/profiles/"
			+ profile_id + "/availability");
		req.then(function(response) {
			perf.availability = response.data;
			perf.available = 0;
			perf.total = 0;
			perf.tooltip = "";
			for ( var key in perf.availability) {
				var cat = perf.availability[key];
				perf.available += cat.available;
				perf.total += cat.total;
				perf.tooltip += cat.name + ": " + cat.available + "/"
					+ cat.total + "\n";
			}
			perf.tooltip = perf.tooltip.trim();
		});
	}

	$scope.setSelectedPerformance = function(performance) {
		$scope.selectedPerformance = performance;
	}
}

module.controller("ShowListCtrl", ShowListCtrl);
