var module = angular.module("lkticket.admin");
var addTicketsModalCtrl = function($filter, $scope, Core, Cart, $location,
	$attrs, Notification) {
	var $ctrl = this
	$scope.uid = $attrs.uid;

	$ctrl.$onChanges = function(change) {

		$scope.prices = angular.copy($ctrl.prices);

	}

	$scope.addTickets = function(rate_id, category_id, delta) {
		var price = $scope.getPrice(rate_id, category_id);
		if (!price.count) {
			price.count = 0;
		}
		price.count = parseInt(price.count) + delta;
		price.count = Math.max(0, price.count);
	}

	$scope.getNumberOfTickets = function() {
		return _.sumBy($scope.prices, function(o) {
			return o.count;
		});
	}

	$scope.getAmount = function() {

		var tickets = _.filter($scope.prices, function(o) {
			return o.count > 0
		});
		return _.sumBy(tickets, function(o) {
			return (o.count * o.price);
		});
	}

	$scope.getPrice = function(rate_id, category_id) {

		var price = _.find($scope.prices, {
			'rate_id' : rate_id,
			'category_id' : category_id
		});

		if (_.isNil(price)) {
			return null;
		} else {
			return price;
		}
	}

	$scope.calculatePrice = function(price) {
		if (price == 0) {
			// Complimentary tickets are not subject to surcharge
			return 0;
		}
		return Math.max(0, price + $ctrl.selectedperformance.surcharge);
	}

	$scope.available = function(category) {
		var perf = $ctrl.selectedperformance;
		if (!perf || !perf.availability) {
			return 0;
		}
		var availability = perf.availability[category.id];
		return availability ? availability.available : 0;
	}

	$scope.addTicketsToCart = function() {

		var tickets = _.filter($scope.prices, function(o) {
			return o.count > 0
		});

		_
			.forEach(
				tickets,
				function(ticket) {
					ticket.performance = $ctrl.selectedperformance;
					$ctrl.selectedperformance.availability[ticket.category_id].available -= ticket.count;
					$ctrl.selectedperformance.available -= ticket.count;
					console.log($ctrl.selectedperformance);
					Notification.primary("Lägger till biljetter...");
					Cart.addTicket(ticket).then(
						function(response) {
							Notification.success("Biljetterna har lagts till");
						},
						function(failure) {
							switch (failure.status) {
							case 409:
								Notification.error("Biljetterna är slutsålda");
								break;
							default:
								Notification
									.error("Kunde inte lägga till biljetter: "
										+ failure.status);
							}
						});
				});

		$scope.prices = angular.copy($ctrl.prices);

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

}

module.controller("AddTicketsModalCtrl", addTicketsModalCtrl);
