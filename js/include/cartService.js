var module = angular.module("lkticket.admin");

module.factory('cartService', function() {
  var cart = { tickets: [] };
  return {
    addTicket: function(ticket) {
      cart.tickets.push(ticket);
    },
    getCart: function() {
      return cart;
    }
  }
});
