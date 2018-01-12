var module = angular.module("lkticket.admin");

var settingsCtrl = function($filter, Cart, $scope, $http, User,
  $routeParams, Core, $sce, $location, Printer, Clippy) {

		$scope.printers = function() {
			return Printer.getPrinters();
		}

		$scope.setSelectedPrinter = function(printer) {
			Printer.setSelectedPrinter(printer);
		}

		$scope.getSelectedPrinter = function() {
			return Printer.getSelectedPrinter();
		}

		$scope.setMascot = function(name) {
			Clippy.setMascot(name);
		}

		$scope.getSelectedMascot = function() {
			return localStorage.mascot;
		}

}

module.controller("SettingsCtrl", settingsCtrl);
