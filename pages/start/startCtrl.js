var module = angular.module("lkticket.admin");

var StartCtrl = function($filter, cartService, $scope, $http, User, $routeParams, Core, $sce, $location) {

  $scope.selected = 1;

  $scope.selectShow = function(selected) {
    $scope.selected = selected;
  }


}

module.controller("StartCtrl", StartCtrl);
