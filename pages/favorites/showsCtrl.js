var module = angular.module("lkticket.admin");

var FavCtrl = function($scope, $http, User, Core, Cart) {

	$scope.addTicketsToCart = function(cid, pid, rid) {

		console.log("HEJ");

		var ticket = {
			category_id : cid,
			performance: {id: pid},
			rate_id : rid,
			count :1,
		}

			Cart.addTicket(ticket, function(response) {
				if (response == true) {

				} else {
					alert("Biljetterna är slut...");
				}
			});

	}

}

module.controller("FavCtrl", FavCtrl);
