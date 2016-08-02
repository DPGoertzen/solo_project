var router = require('express').Router();
var path = require('path');

router.get('/index', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/failure', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/neuromancer', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/neuromancer.html'));
});

router.get('/invisiblecities', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/invisiblecities.html'));
});

router.get('/pleasekillme', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/pleasekillme.html'));
});

router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/login.html'));
});

module.exports = router;
