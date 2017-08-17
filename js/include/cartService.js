var module = angular.module("lkticket.admin");

module.factory('cartService', function() {
  var cart = {};
  return {
    addTicket: function(ticket) {
      console.log(ticket);

      var sendToServer = {
        category_id: ticket.category.id,
        performance_id: ticket.performance.id,
        rate_id: ticket.rate.id,
        count: 1
      }

      var cartObject = {
        category_id: ticket.category.id,
        performance_id: ticket.performance.id,
        rate_id: ticket.rate.id,
        count: 1,
        rate_name: ticket.rate.name,
        category_name: ticket.category.name
      }

      if (!cart[ticket.performance.id]) {
        cart[ticket.performance.id] = {
          tickets: [],
          name: ticket.show.name,
          time: ticket.performance.start
        };
      }

      cart[ticket.performance.id].tickets.push(cartObject);

    },
    getCart: function() {
      return cart;
    }
  }
});
