var module = angular.module("lkticket.admin");

module.factory('Cart',
	function(Core, $routeParams, $location, Clippy) {

		var Cart = {};

		var cart = {
			totalPrice : 0,
			tickets : [],
			cartObject : {},
			customer : {}
		};

		function getCustomer(id) {
			Core.get("/desk/customers/" + id).then(function(response) {
				cart.customer = response.data;
			}, function(response) {
				Clippy("Kunde inte hämta kund: " + response.status);
			});
		}

		function getCartFromServer() {

			if (!sessionStorage.cartId) {
				createNewCart();
			} else {

				var cartId = sessionStorage.cartId;
				cart.tickets = [];
				cart.totalPrice = 0;

				Core.get("/desk/orders/" + cartId).then(
					function(response) {
						cart.cartObject = response.data

						if (cart.cartObject.customer_id > 0) {
							getCustomer(cart.cartObject.customer_id);
						}

						Core.get("/desk/orders/" + cartId + "/tickets").then(
							function(response2) {

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

		Cart.addTicket = function(ticket, callback) {

			var sendToServer = {
				category_id : ticket.category_id,
				performance_id : ticket.performance.id,
				rate_id : ticket.rate_id,
				count : parseInt(ticket.count)
			}

			Core.post("/desk/orders/" + cart.cartObject.id + "/tickets",
				sendToServer).then(function(response) {

				addTicketsToCart(response.data);
				callback(true);

			}, function(error) {
				Clippy.say("Biljetterna är slutsålda!!!");
				// callback(error);
			});

		}

		Cart.getCart = function() {
			return cart;
		}

		Cart.updateCart = function() {
			getCartFromServer();
		}

		Cart.createNewCart = function() {
			createNewCart();
		}

		Cart.getCartById = function(id) {
			sessionStorage.cartId = id;
			getCartFromServer();
		}

		Cart.printAllTickets = function() {
			var data = {
				tickets : []
			};
			for (var i = 0; i < cart.tickets.length; i++) {
				var ticket = cart.tickets[i];
				if (!ticket.printed) {
					data.tickets.push(ticket.id);
				}
			}
			if (data.tickets.length == 0) {
				Clippy.say("Biljetterna är redan utskrivna.");
				return;
			}
			Core.post("/desk/printers/1/print", data).then(function(response) {
				for (var i = 0; i < cart.tickets.length; i++) {
					var ticket = cart.tickets[i];
					if (!ticket.printed) {
						ticket.printed = 1;
					}
				}
				Clippy.play("Print");
			}, function(response) {
				Clippy.say("Utskriften misslyckades: " + response.status);
			});
			console.log("Ticket list is " + data.tickets);

		}

		Cart.removeTicket = function(ticket, callback) {
			Core.deleet(
				"/desk/orders/" + cart.cartObject.id + "/tickets/" + ticket.id)
				.then(function(response) {
					cart.tickets = cart.tickets.filter(function(obj) {
						return obj.id != ticket.id;
					});
					callback();
				}, function(error) {
				});
		}

		Cart.assignCartToCustomer = function(customerId, callback) {
			Core.put("/desk/orders/" + cart.cartObject.id + "/customer",
				customerId).then(function(response) {
				// cart.customer = response.data;
				getCartFromServer();
				callback();
			}, function(error) {
				console.log(error);
			});
		}

		Cart.removeAllTickets = function() {

			Clippy.play("EmptyTrash");

			_.forEach(cart.tickets, function(ticket) {
				Core.deleet(
					"/desk/orders/" + cart.cartObject.id + "/tickets/"
						+ ticket.id).then(function(response) {
					cart.totalPrice = cart.totalPrice - ticket.price;
					cart.tickets = cart.tickets.filter(function(obj) {
						return obj.id != ticket.id;
					});
				}, function(error) {
				});
			});
		}

		return Cart;

	});
