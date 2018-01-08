var module = angular.module("lkticket.admin");

var CartFactory = function(Core, $routeParams, $location, Clippy, User) {

	var replaceObject = function(objectToReplace, object) {
		_.forEach(objectToReplace, function(val) {
			obj = undefined;
		});

		_.forEach(object, function(val, key) {
			objectToReplace[key] = val;
		});

	}

	var Cart = {};

	var cart = {};

	function loadCustomer() {
		if (!cart.customer_id) {
			return;
		}
		Core.get("/desk/customers/" + cart.customer_id).then(
			function(response) {
				cart.customer = response.data;
			}, function(response) {
				Clippy.say("Kunde inte hämta kund: " + response.status);
			});
	}

	function getCartFromServer() {
		if (!sessionStorage.cartId) {
			createNewCart();
		} else {
			var cartId = sessionStorage.cartId;
			cart = {};

			Core.get("/desk/orders/" + cartId).then(
				function(response) {

					replaceObject(cart, response.data);

					loadCustomer();

					Core.get("/desk/orders/" + cartId + "/tickets").then(
						function(response) {

							cart.tickets = response.data;
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

			replaceObject(cart, response.data);
			sessionStorage.cartId = response.data.id;
			cart.tickets = [];

		}, function(response) {
			alert("fel: " + response.status);
		});
	}

	function addTicketsToCart(ticketsToAdd) {
		for (var i = 0; i < ticketsToAdd.length; i++) {
			cart.tickets.push(ticketsToAdd[i]);
		}
	}

	Cart.addTicket = function(ticket, callback) {
		var sendToServer = {
			category_id : ticket.category_id,
			performance_id : ticket.performance.id,
			rate_id : ticket.rate_id,
			count : parseInt(ticket.count),
			profile_id : User.profileID()
		}

		Core.post("/desk/orders/" + cart.id + "/tickets", sendToServer).then(
			function(response) {

				addTicketsToCart(response.data);
				callback(true);

			}, function(error) {
				Clippy.say("Biljetterna är slutsålda!!!");
				// callback(error);
			});
	}

	Cart.getSum = function() {
		if (!cart.tickets) {
			return 0;
		}
		var sum = 0;
		for (var i = 0; i < cart.tickets.length; i++) {
			sum += cart.tickets[i].price;
		}
		return sum;
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
	}

	Cart.removeTicket = function(ticket, callback) {
		Core.deleet("/desk/orders/" + cart.id + "/tickets/" + ticket.id).then(
			function(response) {
				cart.tickets = cart.tickets.filter(function(obj) {
					return obj.id != ticket.id;
				});
				callback();
			}, function(error) {
			});
	}

	Cart.assignCartToCustomer = function(customerId, callback) {
		Core.put("/desk/orders/" + cart.id + "/customer", customerId).then(
			function(response) {
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
			Core.deleet("/desk/orders/" + cart.id + "/tickets/" + ticket.id)
				.then(function(response) {
					cart.tickets = cart.tickets.filter(function(obj) {
						return obj.id != ticket.id;
					});
				}, function(error) {
				});
		});
	}

	Cart.pay = function(method) {

				Core.post("/desk/orders/" + cart.id + "/payments", {
					method : method,
					amount : Cart.getSum(),
					reference: "Kristoffer",
					profile_id: User.profileID()
				}).then(function(response) {
					cart.payment_id = response.data.id;
				}, function(error) {
					console.log(error.status);
				});
	}

	return Cart;
}
module.factory('Cart', CartFactory);
