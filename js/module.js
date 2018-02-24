var module = angular.module("lkticket.admin", [ "ngRoute", "xeditable",
	"ngFileUpload", "angular.filter", "ui-notification" ]);

module.run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});
