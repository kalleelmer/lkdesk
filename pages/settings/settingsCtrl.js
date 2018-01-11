var module = angular.module("lkticket.admin");

var settingsCtrl = function($filter, Cart, $scope, $http, User,
  $routeParams, Core, $sce, $location, Printer) {

		$scope.printers = function() {
			return Printer.getPrinters();
		}

		$scope.setSelectedPrinter = function(printer) {
			Printer.setSelectedPrinter(printer);
		}

		$scope.getSelectedPrinter = function() {
			return Printer.getSelectedPrinter();
		}

}

module.controller("SettingsCtrl", settingsCtrl);
