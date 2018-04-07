var module = angular.module("lkticket.admin");

var ProfileSelectorCtrl = function($scope, User, $rootScope) {
	var $ctrl = this;

	$scope.profile = User.getUser().profile;

	$scope.profiles = function() {
		return User.getUser().profiles;
	}

	$scope.location = User.getUser().location;

	$scope.locations = function() {
		return User.getUser().locations;
	}

	$scope.setProfile = function() {
		console.log($scope.profile);
		User.setProfile($scope.profile);
	}

	$scope.setLocation = function() {
		console.log($scope.location);
		User.setLocation($scope.location);
	}

	$rootScope.$on("PROFILE_SELECTED", function(event, data) {
		$scope.profile = User.getProfile();
	});

	$rootScope.$on("LOCATION_SELECTED", function(event, data) {
		$scope.location = User.getLocation();
	});
}

module.controller("ProfileSelectorCtrl", ProfileSelectorCtrl);
