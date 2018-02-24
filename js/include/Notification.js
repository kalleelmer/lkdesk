var module = angular.module("lkticket.admin");
module.config(function(NotificationProvider) {
	NotificationProvider.setOptions({
		positionY : "bottom"
	});
});
