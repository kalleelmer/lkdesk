var module = angular.module("lkticket.admin");

var PrinterSelectorCtrl = function($scope, Printer, $rootScope) {
	var $ctrl = this;

	$scope.printer = Printer.getSelectedPrinter();

	$scope.printers = function() {
		return Printer.getPrinters();
	}

	$scope.setPrinter = function() {
		if ($scope.printer) {
			Printer.setSelectedPrinter($scope.printer.id);
		}
	}
}

module.controller("PrinterSelectorCtrl", PrinterSelectorCtrl);
