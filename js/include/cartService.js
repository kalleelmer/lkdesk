var module = angular.module("lkticket.admin");

module.factory('cartService', function(Core) {
  var cartObject = {};
  var cart = {
    totalPrice: 0,
    performances: {}
  };

  Core.get("/desk/orders/create").then(function(response) {
    cartObject = response.data;
  }, function(response) {
    alert("fel: " + response.status);
  });

  function addTicketsToCart(ticketsToAdd) {
    console.log(ticketsToAdd);
    for (var i = 0; i < ticketsToAdd.length; i++) {

      if (!cart.performances[ticketsToAdd[i].performance_id]) {
        cart.performances[ticketsToAdd[i].performance_id] = {
          start: "",
          tickets: []
        };

        Core.get("/desk/performances/" + ticketsToAdd[i].performance_id).then(function(response) {
          cart.performances[response.data.id].start = response.data.start;

          Core.get("/desk/shows/" + response.data.show_id).then(function(response2) {
            cart.performances[response.data.id].name = response2.data.name;
          }, function(error) {
            alert("error: " + error.status);
          });

        }, function(error) {
          alert("error: " + error.status);
        });



      }

      cart.performances[ticketsToAdd[i].performance_id].tickets.push(ticketsToAdd[i]);
      cart.totalPrice = cart.totalPrice + ticketsToAdd[i].price;

    }
  }

  return {
    addTicket: function(ticket) {

      var sendToServer = {
        category_id: ticket.category.id,
        performance_id: ticket.performance.id,
        rate_id: ticket.rate.id,
        count: parseInt(ticket.count)
      }

      Core.post("/desk/orders/" + cartObject.id + "/tickets", sendToServer).then(function(response) {

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
