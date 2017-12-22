var module = angular.module("lkticket.admin");

var StartCtrl = function($filter, cartService, $scope, $http, User, $routeParams, Core, $sce, $location, clippyService) {

  $scope.selected = 1;
  $scope.cartId = cartService.getCart();

  console.log($scope.cartId);

  $scope.selectShow = function(selected) {
    $scope.selected = selected;
  }


}

module.controller("StartCtrl", StartCtrl);
