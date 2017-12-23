var module = angular.module("lkticket.admin");

module.factory('Cart', function(Core, $routeParams, $location, Clippy) {

  var cart = {
    totalPrice: 0,
    tickets: [],
    cartObject: {},
  };

  var history = JSON.parse(localStorage.history || null);

  function addToHistory() {

    if (!localStorage.history) {
      localStorage.history = JSON.stringify([sessionStorage.cartId]);
    } else {
      history.push(sessionStorage.cartId);
      localStorage.history = JSON.stringify(history);
    }

    console.log(history);

  }

  function getCartFromServer() {

    if (!sessionStorage.cartId) {
      createNewCart();
    } else {

      var cartId = sessionStorage.cartId;
      cart.tickets = [];
      cart.totalPrice = 0;

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

  getCartFromServer();

  function createNewCart() {

    if (sessionStorage.cartId) {
      addToHistory();
    }

    Core.get("/desk/orders/create").then(function(response) {

      cart.cartObject = response.data;
      sessionStorage.cartId = response.data.id;
      cart.tickets = [];
      cart.totalPrice = 0;

    }, function(response) {
      alert("fel: " + response.status);
    });

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
        Clippy.say("Biljetterna är slutsålda!!!");
        //callback(error);
      });

    },
    getCart: function() {
      return cart;
    },
    updateCart: function() {
      getCartFromServer();
    },
    createNewCart: function() {
      createNewCart();
    },
    getCartById: function(id) {
      addToHistory();
      sessionStorage.cartId = id;
      getCartFromServer();
    },
    getHistory: function() {
      return history;
    },
    removeTicket: function(ticket, callback) {
      Core.delete("/desk/orders/" + cart.cartObject.id + "/tickets/" + ticket.id).then(function(response) {
        cart.tickets = cart.tickets.filter(function(obj) {
          return obj.id != ticket.id;
        });
        callback();
      }, function(error) {});
    },
    removeAllTickets: function() {

      Clippy.play("EmptyTrash");

      _.forEach(cart.tickets, function(ticket){
        Core.delete("/desk/orders/" + cart.cartObject.id + "/tickets/" + ticket.id).then(function(response) {
          cart.totalPrice = cart.totalPrice - ticket.price;
          cart.tickets = cart.tickets.filter(function(obj) {
            return obj.id != ticket.id;
          });
        }, function(error) {});
      });
    }
  }
});
