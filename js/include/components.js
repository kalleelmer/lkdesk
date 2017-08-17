var module = angular.module("lkticket.admin");

module.component("showList",{
      templateUrl: '/components/showList.html',
      bindings: {
         sid: '@'
       },
      controller: "ShowListCtrl"
  });
