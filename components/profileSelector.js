var module = angular.module("lkticket.admin");

var ProfileSelectorCtrl = function($scope, User) {
	var $ctrl = this;

	$scope.profiles = function() {
		return User.getUser().profiles;
	}

	$scope.setProfile = function() {
		console.log($scope.profile);
		User.setProfile($scope.profile);
	}
}

module.controller("ProfileSelectorCtrl", ProfileSelectorCtrl);
