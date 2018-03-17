var module = angular.module("lkticket.admin");

module.component("showList", {
	templateUrl : "/components/showList.html?v=BUILD_NUMBER",
	bindings : {
		sid : "@"
	},
	controller : "ShowListCtrl"
});

module.component("cart", {
	templateUrl : "/components/cartComponent.html?v=BUILD_NUMBER",
	bindings : {},
	controller : "CartCtrl"
});

module.component("addTicketsModal", {
	templateUrl : "/components/addTicketsModal.html?v=BUILD_NUMBER",
	bindings : {
		modaldata : "<",
		prices : "<",
		selectedperformance : "<",
		showname : "<",
		uid : "@"
	},
	controller : "AddTicketsModalCtrl"
});

module.component("profileSelector", {
	templateUrl : "/components/profileSelector.html?v=BUILD_NUMBER",
	bindings : {},
	controller : "ProfileSelectorCtrl"
});

module.component("printerSelector", {
	templateUrl : "/components/printerSelector.html?v=BUILD_NUMBER",
	bindings : {},
	controller : "PrinterSelectorCtrl"
});
