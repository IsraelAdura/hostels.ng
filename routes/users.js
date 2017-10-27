var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer')

//custom modules
var User = require('../models/user');
var Passport = require('../config/passport');


var image = require('./helpers/image');
image.multer
var upload = image.upload

/*var isUnique = function (req, res, next) {
  User.getAllUsers(function (err, users) {
    users.forEach(function (user) {
    //  console.log(user)
      if (user.username == req.body.username) {
        req.flash('success_msg', 'username taken,try again');

      }
    });
  })
}*/


//signup
router.get('/register', function (req, res) {
  res.render('register');
});

//get login
router.get('/login', function (req, res) {
  res.render('login');
});

//post signup information
router.post('/register', upload.any(), function (req, res) {
  //console.log(req.body)
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var password = req.body.password;
  var password2 = req.body.password2;

  //req.body validation
  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('email', 'enter valid email eg. mail@mail.com').isEmail();
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password', 'passwords must be at least 4 characters long').isLength({ min: 4 });
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('mobile', 'Kindly Enter your mobile Number').notEmpty()


  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password,
      mobile: mobile
    })
    User.createUser(newUser, function (err, user) {
      if (err) { throw err };
      console.log(user);
    });
    req.flash('success_msg', 'you are registered to login');


    res.redirect('/login');
  }
})
Passport.passport();

router.post('/login',
  passport.authenticate('local',
    { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
  function (req, res) {
    res.redirect('/');
  });

//logout
router.get('/logout', function (req, res) {
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/login');
})



module.exports = router;