var module = angular.module("lkticket.admin");

var LoginCtrl = function($scope, User, $route, Core, Printer) {
	var ctrl = this;

	console.log("Loading LoginCtrl");

	$scope.userStatus = function(status) {
		return Core.STATE == status;
	}

	$scope.selectedPrinter = function() {
		return Printer.getSelectedPrinter();
	}

	$scope.loginURL = function() {
		return Core.LOGIN_URL;
	}

	$scope.user = function() {
		return Core.user;
	}

	$scope.switchUser = function() {
		Core.switchUser();
	}

	$scope.logout = function() {
		Core.logout();
	}
}

module.controller("LoginCtrl", LoginCtrl);
