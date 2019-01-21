'use strict';

var express = require('express');
var profileCtrl = require('../controllers/profileController');
var authCtrl = require('../controllers/authController');
var profileRouter = express.Router();

profileRouter.route('/:_id').get(authCtrl.isLoginRequired, profileCtrl.getProfile);
profileRouter.route('/profile').put(authCtrl.isLoginRequired, profileCtrl.updateProfile);

module.exports = profileRouter;