var module = angular.module("lkticket.admin");

var ShowsCtrl = function($rootScope, $scope, $http, User, Core) {

	var reloadShows = function() {
		Core.get("/desk/profiles/" + User.getProfile().id + "/shows").then(
			function(response) {
				$scope.shows = response.data;
			}, function(response) {
				alert("Kunde inte hämta nöjen: " + response.status);
			});
	}

	$rootScope.$on("PROFILE_SELECTED", function(event, data) {
		reloadShows();
	});

	if (User.loggedIn() && User.getProfile() != null) {
		reloadShows();
	}
}

module.controller("ShowsCtrl", ShowsCtrl);
