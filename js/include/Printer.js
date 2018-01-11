var module = angular.module("lkticket.admin");

var PrinterFactory = function(Core, $routeParams, $location, Clippy, User) {

  var Printer = {};

  var printers = {};

  Printer.refreshPrinters = function() {
    Core.get("/desk/printers").then(
      function(response) {
        printers = response.data;
      },
      function(response) {
        Clippy.say("Kunde inte uppdatera skrivare: " + response.status);
      });
  };

  Printer.refreshPrinters();

  Printer.getPrinters = function() {
    return printers;
  }

  Printer.getSelectedPrinter = function() {
    return _.filter(printers, function(printer) {
      return printer.id == sessionStorage.selectedPrinter;
    })[0];
  }

  Printer.setSelectedPrinter = function(printer) {
    sessionStorage.selectedPrinter = printer;
    console.log(selectedPrinter);
  }

  return Printer;
}
module.factory('Printer', PrinterFactory);
