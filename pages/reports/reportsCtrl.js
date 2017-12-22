var module = angular.module("lkticket.admin");

var reportsCtrl = function($filter, cartService, $scope, $http, User, $routeParams, Core, $sce, $location) {

  $scope.selected = 1;

  cartService.reloadCart();

  $scope.selectShow = function(selected) {
    $scope.selected = selected;
  }


}

module.controller("ReportsCtrl", reportsCtrl);
