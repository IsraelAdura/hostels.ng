var express = require('express');
var router = express.Router();
var config = require('../config/passport')
var User = require('../models/user');

var multer = require('multer');
var image = require('./helpers/image');
image.multer
var upload = image.upload




/* GET adminpage. */
router.get('/', isAdmin, function (req, res, next) {
    User.getAllUsers(function (err, users) {
        res.render('admin', { users: users });
    })
})

function isAdmin(req, res, next) {
    if (req.user._id == config.admin) {
     //   console.log(req.user._id)
        return next();
    }
    // res.redirect('users/login');
}

router.get('/delete/:id', isAdmin, function (req, res) {
    if (req.params.id == config.admin) {
        res.status(500).send('<h1>you cant delete an Admin! </h1>');
    } else {
        User.findByIdAndRemove(req.params.id, function (err, user) {
            res.redirect('/admin');
           // console.log(req.params.id, user);
        });
    }
})
router.get('/update/:id', isAdmin, function (req, res) {
    User.getAllUsers(function (err, users) {
        User.getUserById(req.params.id, function (err, user) {
            if (err) throw err;
            res.render('userprofile', {
                view: user,
                users: users
            });
        });
    });
})

router.get('/image/:id', isAdmin, function (req, res) {
    User.getAllUsers(function (err, users) {
        User.getUserById(req.params.id, function(err,user){
            if (err)throw err;

            res.render('userimage', {
                view:user, 
                users: users 
            });
        })
    })
})

router.post('/updateImage/:id',upload.any(), function (req, res) {
   // console.log(req.files[0].originalname)
      User.findByIdAndUpdate({ _id: req.params.id },{picture:{
        originalname:req.files[0].originalname}
      }, function (err, user) {
        if (err) { throw err };
        res.redirect('/userimage');
    })
  })


module.exports = router;

