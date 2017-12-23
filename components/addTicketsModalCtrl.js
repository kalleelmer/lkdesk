var module = angular.module("lkticket.admin");
var addTicketsModalCtrl = function($filter, $scope, Core, Cart, $location, $attrs) {
	var $ctrl = this
	$scope.uid = $attrs.uid;


	$ctrl.$onChanges = function(change) {

		$scope.prices = angular.copy($ctrl.prices);

	}

	$scope.ticketAdded = function() {

	}

	$scope.getNumberOfTickets = function() {
		return _.sumBy($scope.prices, function(o) {return o.count;});
	}

	$scope.getAmount = function() {

		var tickets = _.filter($scope.prices, function(o) {return o.count > 0});
		return _.sumBy(tickets, function(o) {return (o.count * o.price);});
	}

	$scope.getPrice = function(rate_id, category_id){

		var price = _.find($scope.prices, {'rate_id': rate_id, 'category_id' : category_id});

		if (_.isNil(price)){
			return null;
		} else {
			return price;
		}
	}

	$scope.addTicketsToCart = function() {
		var tickets = _.filter($scope.prices, function(o) {return o.count > 0});

		_.forEach(tickets, function(ticket) {
			ticket.performance = $ctrl.selectedperformance;
			Cart.addTicket(ticket, function(response) {
				if (response == true) {

				} else {
					alert("Biljetterna är slut...");
				}
			});
		});

		$scope.prices = angular.copy($ctrl.prices);

	}

}

module.controller("AddTicketsModalCtrl", addTicketsModalCtrl);
