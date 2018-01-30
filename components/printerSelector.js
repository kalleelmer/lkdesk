var module = angular.module("lkticket.admin");

var PrinterSelectorCtrl = function($scope, Printer) {
	var $ctrl = this;

	$scope.printers = function() {
		return Printer.getPrinters();
	}

	$scope.setPrinter = function() {
		console.log($scope.printer);
		Printer.setSelectedPrinter($scope.printer.id);
	}
}

module.controller("PrinterSelectorCtrl", PrinterSelectorCtrl);
