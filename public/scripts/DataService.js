angular.module('illustratedApp').factory('DataService', function($http){
  var data = {};

  function bookSuccess(response){
    console.log('bookSuccess', response.data);
    data.book = response.data;
    console.log('data.book is', data.book);
    console.log('and the data object is', data);
  }

  function bookFail(){
    console.log('error retrieving book');
  }

  function findByName(name){
    $http.get('/book/findBook/' + name).then(bookSuccess, bookFail);
  }

  return {
    data: data,
    findByName: findByName
  }

});
