var router = require('express').Router();
var passport = require('passport');

router.get('/', function(req, res) {
  res.send(req.isAuthenticated());
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/failure'
}));


module.exports = router;
