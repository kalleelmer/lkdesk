var module = angular.module("lkticket.admin");

var PrinterFactory = function(Core, $routeParams, $location, User, $interval, Notification) {

  var Printer = {};

  var printers = {};

  Printer.refreshPrinters = function() {
    Core.get("/desk/printers").then(
      function(response) {
        printers = response.data;

        if (sessionStorage.selectedPrinter) {
          if (Date.now() - Printer.getSelectedPrinter().alive > 60000) {
            Notification.warning("Den valda skrivaren är offline");
          }
        }

      },
      function(response) {
        Notification.error("Kunde inte uppdatera skrivare: " + response.status);
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
  }

  Printer.refreshCurrentPrinter = function(callback) {
    Core.get("/desk/printers/" + sessionStorage.selectedPrinter).then(
      function(response) {
        callback(response.data);
      },
      function(response) {
        Notification.error("Kunde inte uppdatera skrivare: " + response.status);
      });
  }

  var promise = $interval(Printer.refreshPrinters, 30000);

  return Printer;
}
module.factory('Printer', PrinterFactory);
