var router = require('express').Router();
var path = require('path');
var User = require('../models/User');

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

router.get('/retrieveSettings', function(request, response){
  var user = request.user;
  User.findById(user._id, function(err, user){
    if(err){
      console.log(err);
    }
    console.log(user);
    response.send(user);
  });

})


router.post('/addSettings', function(request, response){
  var user = request.user;
  var data = request.body;
  User.findById(user._id, function(err, user){
    if(err){
      console.log(err);
    }
    console.log(request.body);
    user.sliderRed = data.sliderRed;
    user.sliderGreen = data.sliderGreen;
    user.sliderBlue = data.sliderBlue;
    user.save(function(err){
      if(err){
        console.log(err);
      }
    });
  });

});

router.get('/testroute', function(request, response){
  console.log("WORKS");
  response.sendStatus(200);
})

router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/login.html'));
});

module.exports = router;
