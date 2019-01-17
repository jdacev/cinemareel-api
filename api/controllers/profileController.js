'use strict';

var mailHelper = require('./helpers/mailHelper');
var mailTemplateHelper = require('./helpers/mailTemplateHelper');
var User = require('../models/userModel');
var bcryptjs = require('bcryptjs');


var getProfile = function(req, res) {
    
    User
    .findOne({_id: req.params._id} )
    .then( (user) => {
        if(!user){
            return res.status(401).json({ user: {}, message: 'El Usuario no existe' });
        } else {
            return res.status(200).json({ user: user });
        }
    } )
}

module.exports = {
    getProfile: getProfile
}