var module = angular.module("lkticket.admin");

var ProfileSelectorCtrl = function($scope, User, $rootScope) {
	var $ctrl = this;

	$scope.profile = User.getUser().profile;

	$scope.profiles = function() {
		return User.getUser().profiles;
	}

	$scope.setProfile = function() {
		console.log($scope.profile);
		User.setProfile($scope.profile);
	}

	$rootScope.$on("PROFILE_SELECTED", function(event, data) {
		$scope.profile = User.getProfile();
	});
}

module.controller("ProfileSelectorCtrl", ProfileSelectorCtrl);
