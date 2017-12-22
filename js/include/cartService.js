var module = angular.module("lkticket.admin");

module.factory('cartService', function(Core, $routeParams, $location) {

  var cart = {
    totalPrice: 0,
    tickets: [],
    cartObject: {},
  };

  function createNewCart() {

    Core.get("/desk/orders/create").then(function(response) {

      cart.cartObject = response.data;
      localStorage.cartId = response.data.id;
      cart.tickets = [];
      cart.totalPrice = 0;

    }, function(response) {
      alert("fel: " + response.status);
    });

  }

  function getCartFromServer() {

    if (!localStorage.cartId) {
      createNewCart();
    } else {

      var cartId = localStorage.cartId;

      cart = {
        totalPrice: 0,
        tickets: [],
        cartObject: {},
      };

      Core.get("/desk/orders/" + cartId).then(function(response) {
        cart.cartObject = response.data

        Core.get("/desk/orders/" + cartId + "/tickets").then(function(response2) {

          addTicketsToCart(response2.data);
        }, function(response) {
          alert("fel: " + response.status);
        });

      }, function(response) {
        alert("fel: " + response.status);
      });
    }
  }

  function addTicketsToCart(ticketsToAdd) {
    for (var i = 0; i < ticketsToAdd.length; i++) {
      cart.tickets.push(ticketsToAdd[i]);
      cart.totalPrice = cart.totalPrice + ticketsToAdd[i].price;
    }
  }

  return {
    addTicket: function(ticket, callback) {

      var sendToServer = {
        category_id: ticket.category_id,
        performance_id: ticket.performance.id,
        rate_id: ticket.rate_id,
        count: parseInt(ticket.count)
      }

      Core.post("/desk/orders/" + cart.cartObject.id + "/tickets", sendToServer).then(function(response) {

        addTicketsToCart(response.data);
        callback(true);

      }, function(error) {
        callback(error);
      });

    },
    getCart: function() {
      return cart;
    },
    reloadCart: function() {
      getCartFromServer();
    },
    createNewCart: function() {
      createNewCart();
    }
  }
});
