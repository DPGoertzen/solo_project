var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var passport = require('passport'); // npm install
var session = require('express-session'); // npm install
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('./models/user');
var login = require('./routes/login');
var register = require('./routes/register');
var index = require('./routes/index');
var book = require('./routes/book');

var app = express();

var mongoURI = 'mongodb://localhost:27017/illustrated_passport';

var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err) {
  console.log('Mongo error: MONGO SMASH!', err);
});

MongoDB.once('open', function(){
  console.log('Mongo is ready to go, boys');
});

app.use(session({
  secret: 'processing',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 1800000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function(username, password, done) {
  User.findOne({ username: username }, function(err, user){
    if (err) {
      throw err;
    }
    if (!user) {
      return done(null, false);
    }
    user.comparePassword(password, function(err, isMatch){
      if (isMatch) {
        // successfully auth the user
        return done(null, user);
      } else {
        done(null, false);
      }
    });
  });
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if (err) {
      return done(err);
    }

    done(null, user);
  });
});

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/book', book)



var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Server listening on ' + server.address().port);
});
