var module = angular.module("lkticket.admin");

var ShowsCtrl = function($scope, $http, User, Core) {

  Core.get("/shows").then(function(response) {
    $scope.shows = response.data;
  }, function(response) {
    alert("Kunde inte hämta nöjan: " + response.status);
  });

  $scope.toggleEditMode = function(show) {
		show.editToggle = !show.editToggle;
    console.log(show);
	}

  $scope.editNameOfShow = function(show) {
    //TODO Lösa riktigt mot databasen
    //$scope.shows[index].name = newName;
    $scope.toggleEditMode(show);

    }

}

module.controller("ShowsCtrl", ShowsCtrl);
