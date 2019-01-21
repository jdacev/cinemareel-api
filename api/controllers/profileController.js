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
            return res.status(401).json({ errType:1, user: {}, message: 'El Usuario no existe' });
        } else {
            return res.status(200).json({ errType:0, user: user });
        }
    } )
}

var updateProfile = function (req, res) {
    console.log(req.body);
    User
    .findOneAndUpdate( {email: req.body.email}, req.body, function(err) {
        if(err){
            return res.status(401).json({ errType:1, message: 'Error técnico ' + err });
        }else{
            return res.status(200).json({ errType:0, message: 'Perfil actualizado' });
        }
    })
}

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile
}