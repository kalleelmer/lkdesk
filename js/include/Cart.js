var module = angular.module("lkticket.admin");

var CartFactory = function(Core, $routeParams, $location, Notification, User,
	Printer) {

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

	cart.tickets = [];

	function loadCustomer() {
		if (!cart.customer_id) {
			return;
		}
		Core.get("/desk/customers/" + cart.customer_id)
			.then(
				function(response) {
					cart.customer = response.data;
				},
				function(response) {
					Notification.error("Kunde inte hämta kund: "
						+ response.status);
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

		if (cart.tickets.filter(function(ticket) {
			return ticket.printed == null;
		}).length > 0 && !(cart.customer_id > 0)) {
			Notification.error("Du har outskrivna biljetter");
			return;
		}

		Core.get("/desk/orders/create?location_id=" + User.locationID()).then(
			function(response) {
				replaceObject(cart, response.data);
				sessionStorage.cartId = response.data.id;
				cart.tickets = [];
			}, function(response) {
				alert("fel: " + response.status);
			});
	}

	Cart.fetchBooking = function(identifier) {
		var req = Core.get("/desk/orders/identifier/" + identifier);
		req.then(function(response) {
			replaceObject(cart, response.data);
			loadCustomer();

			Core.get("/desk/orders/" + cart.id + "/tickets").then(
				function(response) {
					cart.tickets = response.data;
				}, function(response) {
					alert("fel: " + response.status);
				});

		}, function(response) {
			Notification.error("Bokningen kunde inte hämtas: "
				+ response.status);
		});
		return req;
	}

	function addTicketsToCart(ticketsToAdd) {
		for (var i = 0; i < ticketsToAdd.length; i++) {
			cart.tickets.push(ticketsToAdd[i]);
		}
	}

	Cart.addTicket = function(ticket) {

		if (cart.payment_id > 0) {
			Notification.error("En betald kundvagn kan inte ändras");
		} else {
			var sendToServer = {
				category_id : ticket.category_id,
				performance_id : ticket.performance.id,
				rate_id : ticket.rate_id,
				count : parseInt(ticket.count),
				profile_id : User.profileID(),
				location_id : User.locationID()
			}

			var req = Core.post("/desk/orders/" + cart.id + "/tickets",
				sendToServer);
			req.then(function(response) {
				addTicketsToCart(response.data);
			}, function(response) {
				// Pass
			});
			return req;
		}
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

		if (cart.tickets.filter(function(ticket) {
			return ticket.printed == null;
		}).length > 0 && !(cart.customer_id > 0)) {
			Notification.error("Du har outskrivna biljetter");
			return;
		}

		sessionStorage.cartId = id;
		getCartFromServer();
	}

	Cart.printAllTickets = function() {

		if (!Printer.getSelectedPrinter()) {
			Notification.error("Du måste välja en skrivare!");
			return;
		} else if (cart.payment_id > 0) {
			Printer.refreshCurrentPrinter(function(printer) {
				if (Date.now() - printer.alive < 60000) {
					var data = {
						tickets : [],
						reprint: false
					};
					for (var i = 0; i < cart.tickets.length; i++) {
						var ticket = cart.tickets[i];
						if (!ticket.printed) {
							data.tickets.push(ticket.id);
						}
					}
					if (data.tickets.length == 0) {
						Notification.warning("Biljetterna är redan utskrivna.");
						if (!confirm("Biljetterna är utskrivna. Vill du skriva ut igen?")) {
							return;
						}
						if(!confirm("Var noga med att riva ALLA biljetter i HELA bokningen!")){
							return;
						}
						data.reprint = true;
						for (var i = 0; i < cart.tickets.length; i++) {
							data.tickets.push(cart.tickets[i].id);
						}
					}
					Core.post(
						"/desk/printers/" + Printer.getSelectedPrinter().id
							+ "/print?location_id=" + User.locationID(), data).then(
						function(response) {
							for (var i = 0; i < cart.tickets.length; i++) {
								var ticket = cart.tickets[i];
								if (!ticket.printed) {
									ticket.printed = 1;
								}
							}
							Notification.success("Utskrift påbörjad");
						},
						function(response) {
							Notification.error("Utskriften misslyckades: "
								+ response.status);
						});
				} else {
					Notification.error("Skrivaren är offline!");
				}
			});
		} else {
			Notification.erro("Obetalda biljetter kan inte skrivas ut");
		}

	}

	Cart.removeTicket = function(ticket, callback) {
		Core.deleet(
			"/desk/orders/" + cart.id + "/tickets/" + ticket.id
				+ "?location_id=" + User.locationID()).then(function(response) {
			cart.tickets = cart.tickets.filter(function(obj) {
				return obj.id != ticket.id;
			});
			callback();
		}, function(error) {
		});
	}

	Cart.assignCartToCustomer = function(customerId, callback) {
		Core.put(
			"/desk/orders/" + cart.id + "/customer?location_id="
				+ User.locationID(), customerId).then(function(response) {
			getCartFromServer();
			callback();
		}, function(error) {
			console.log(error);
		});
	}

	Cart.unassignCustomer = function(callback) {
		Core.deleet(
			"/desk/orders/" + cart.id + "/customer?location_id="
				+ User.locationID()).then(function(response) {
			getCartFromServer();
			callback();
		}, function(error) {
			console.log(error);
		});
	}

	Cart.removeAllTickets = function() {
		Notification.success("Kundvagn tömd");
		_.forEach(cart.tickets, function(ticket) {
			Cart.removeTicket(ticket, function() {
			});
		});
	}

	Cart.pay = function(method, reference) {
		var body = {
			method : method,
			amount : Cart.getSum(),
			reference : reference,
			profile_id : User.profileID(),
			location_id : User.locationID()
		};

		Core.post("/desk/orders/" + cart.id + "/payments", body).then(
			function(response) {
				cart.payment_id = response.data.id;
				reference = null;
			}, function(error) {
				console.log(error.status);
			});
	}

	Cart.isEmpty = function() {
		return cart.tickets && cart.tickets.length == 0;
	}

	return Cart;
}
module.factory('Cart', CartFactory);
