'use strict';

var express = require('express');
var utilCtrl = require('../controllers/utilController');
var utilRouter = express.Router();

utilRouter.route('/securitycode').post(utilCtrl.sendSecurityCode);

module.exports = utilRouter;