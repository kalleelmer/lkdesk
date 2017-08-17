var module = angular.module("lkticket.admin");

module.component("showList",{
      templateUrl: '/templates/showList.html',
      bindings: {
         sid: '@'
       },
      controller: "ShowListCtrl"
  });
