'use strict';

var express = require('express');
var authCtrl = require('../controllers/authController');
var loginRouter = express.Router();

loginRouter.route('').post(authCtrl.login);

module.exports = loginRouter;