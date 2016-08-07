angular.module('illustratedApp').controller('NeuromancerController', function(DataService){
  var vm = this;
  vm.book = DataService.data;
  DataService.findByName('Neuromancer');
  console.log('this is DataService.data', DataService.data);
  console.log('this is vm.book', vm.book);
})
