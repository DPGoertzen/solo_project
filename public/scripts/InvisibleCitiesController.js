angular.module('illustratedApp').controller('InvisibleCitiesController', function(DataService){
  var vm = this;
  vm.book = DataService.data;
  DataService.findByName('Invisible Cities');
  console.log('this is DataService.data', DataService.data);
  console.log('this is vm.book', vm.book);
})
