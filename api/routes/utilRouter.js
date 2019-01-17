'use strict';

var express = require('express');
var utilCtrl = require('../controllers/utilController');
var utilRouter = express.Router();

utilRouter.route('/securitycode').post(utilCtrl.sendSecurityCode);
utilRouter.route('/verifysecuritycode').post(utilCtrl.verifySecurityCode);
utilRouter.route('/restorepassword').post(utilCtrl.restorePassword);

module.exports = utilRouter;