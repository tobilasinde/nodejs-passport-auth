var express = require('express');
var router  = express.Router();

var auth_controller = require('../controllers/authController');

// get dashboard
router.get('/', auth_controller.index);

// get login
router.get('/login', auth_controller.login_get);

// post login
router.post('/login', auth_controller.login_post);

// get logout
router.get('/logout', auth_controller.logout);

//get signup
 router.get('/signup', auth_controller.signup_get);

 //post signup
router.post('/signup', auth_controller.signup_post);

// Profile
router.get('/profile', auth_controller.profile);
router.get('/profile_update', auth_controller.profile_update_get);
router.post('/profile_update', auth_controller.profile_update_post);

module.exports = router;
