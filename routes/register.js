var router = require('express').Router();
var path = require('path');

var User = require('../models/User');

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.post('/', function(req, res) {
  User.create(req.body, function(err) {
    console.log("request body:", req.body);
    if (err) {
      console.log("HERE IS THE ERROR:", err);
      res.sendStatus(500);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
