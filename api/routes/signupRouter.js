'use strict';

var express = require('express');
var authCtrl = require('../controllers/authController');
var signupRouter = express.Router();

signupRouter.route('').post(authCtrl.signup);

module.exports = signupRouter;