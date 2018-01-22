var module = angular.module("lkticket.admin");

var ShowsCtrl = function($scope, $http, User, Core) {

	Core.get("/desk/shows").then(function(response) {
		$scope.shows = response.data;
	}, function(response) {
		alert("Kunde inte hämta nöjen: " + response.status);
	});

}

module.controller("ShowsCtrl", ShowsCtrl);
