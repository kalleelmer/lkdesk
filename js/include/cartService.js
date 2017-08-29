var module = angular.module("lkticket.admin");

module.factory('cartService', function(Core) {
  var cart = {
    totalPrice: 0,
    tickets: [],
    cartObject: {},
  };

  Core.get("/desk/orders/create").then(function(response) {
    cart.cartObject = response.data;

  }, function(response) {
    alert("fel: " + response.status);
  });

  function addTicketsToCart(ticketsToAdd) {
    console.log(ticketsToAdd);
    for (var i = 0; i < ticketsToAdd.length; i++) {


      cart.tickets.push(ticketsToAdd[i]);
      cart.totalPrice = cart.totalPrice + ticketsToAdd[i].price;



    }
    console.log("KART: ", cart);
  }

  return {
    addTicket: function(ticket) {

      var sendToServer = {
        category_id: ticket.category.id,
        performance_id: ticket.performance.id,
        rate_id: ticket.rate.id,
        count: parseInt(ticket.count)
      }

      Core.post("/desk/orders/" + cart.cartObject.id + "/tickets", sendToServer).then(function(response) {

        addTicketsToCart(response.data);

      }, function(error) {
        alert("fel: " + error.status);
      });

    },
    getCart: function() {
      return cart;
    }
  }
});
