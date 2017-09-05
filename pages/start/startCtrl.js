var module = angular.module("lkticket.admin");

var ShowCtrl = function($filter, cartService, $scope, $http, User, $routeParams, Core, $sce) {

  $scope.selected = 1;

  if ($routeParams.id) {
    cartService.reloadCart();
  }

  $scope.selectShow = function(selected) {
    $scope.selected = selected;
  }


}

module.controller("StartCtrl", ShowCtrl);
