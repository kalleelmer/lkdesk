var module = angular.module("lkticket.admin");

module.component("showList", {
  templateUrl: '/components/showList.html',
  bindings: {
    sid: '@'
  },
  controller: "ShowListCtrl"
});

module.component("cart", {
  templateUrl: '/components/cartComponent.html',
  bindings: {
  },
  controller: "CartCtrl"
});

module.component("addTicketsModal", {
  templateUrl: '/components/addTicketsModal.html',
  bindings: {
    modaldata: '<',
    prices: '<',
    selectedperformance: '<',
    showname: '<',
    uid: '@'
  },
  controller: "AddTicketsModalCtrl"
});
