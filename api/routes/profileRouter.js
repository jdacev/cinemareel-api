'use strict';

var express = require('express');
var profileCtrl = require('../controllers/profileController');
var profileRouter = express.Router();

profileRouter.route('/:_id').get(profileCtrl.getProfile);

module.exports = profileRouter;