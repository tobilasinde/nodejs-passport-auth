var passport = require('passport');
var auth = require('../modules/auth.js');
var multer  = require('multer')
var path = require('path');
var models = require('../models');
var User = models.user;


// Dashboard Page
exports.index = function(req, res) {
    var user = req.user;
    //you probably also want to pass this to your view
    res.render('index', { title: 'Dashboard', user: user});
}
// Dsiplay login form
exports.login_get = function(req, res){
    var user = req.user;
    if(!user){
       res.render('pages/user/login', {title: 'Login'});
    }
    res.redirect('/');
 }

// Authenticate a user at login
 exports.login_post = passport.authenticate('local', { successRedirect: '/', failureRedirect: 'login' });

// Log out a user
 exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
  }


  const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
        cb(null,req.user.id + '_' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // For uploading pictures
  const upload = multer({
    storage: storage
  }).single('avatar');

  // Create Users Form
  exports.signup_get = function(req, res, next) {
    var displayData = {
         title: 'SignUp',
    };
    res.render('pages/user/create', displayData);
};
// Create a new user and authenticate
exports.signup_post = function(req, res) {
    auth.createUser(req, res, function(data) {
        if (data.success == false) {
            return res.render('pages/user/create', { message : data.message });
        }
        // console.log(storage.destination);
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
 }

 exports.profile = function(req, res, next) {
    var displayData = {
         title: 'Profile',
         user: req.user,
    };
    res.render('pages/user/profile', displayData);
};

exports.profile_update_get = function(req, res, next) {
    var displayData = {
         title: 'Profile Update',
         user: req.user,
    };
    res.render('pages/settings/index', displayData);
};
// Handle Group update on POST.
exports.profile_update_post = [
    // Process request after validation and sanitization.
    (req, res, next) => {
        upload(req, res, (err) => {
            if(err){
                res.render('pages/settings/index', {
                    msg: err
                });
            } else {
                User.update({
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,
                    img_url: req.file.filename,
                },
                {
                    where: {
                        id: req.user.id
                    }
                }).then(function(){
                    res.redirect('/profile');
                });
            }
        });
    }
];
