var router = require('express').Router();
var path = require('path');
var Book = require('../models/Book');

router.get('/createBook', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/createBook.html'));
});

router.post('/createBook', function(request, response){
  console.log('Creating data');
  var data = request.body;
  //Part 1
  var createdBook = new Book({
    bookName: data.bookName,
    author: data.author,
    publishDate: data.publishDate,
    quote: data.quote,
    description: data.description,
    amazonLink: data.amazonLink

  });

  //Part 2
  createdBook.save(function(err){
    if(err) {
      console.log('Save err', err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });
})

module.exports = router;
