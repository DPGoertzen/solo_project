angular.module('illustratedApp').controller('PleaseKillMeController', function(DataService){
  var vm = this;
  vm.book = DataService.data;
  DataService.findByName('Please Kill Me');
  console.log('this is DataService.data', DataService.data);
  console.log('this is vm.book', vm.book);
})
