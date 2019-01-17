'use strict';

var mailHelper = require('./helpers/mailHelper');
var mailTemplateHelper = require('./helpers/mailTemplateHelper');
var User = require('../models/userModel');
var bcryptjs = require('bcryptjs');


function generateSecurityCode () {
    return Math.floor(Math.random() * (1000000));
  }

var sendSecurityCode = function(req, res) {
    var securityCode = generateSecurityCode();
    const mailTemplate = mailTemplateHelper.securityCode( securityCode );
    mailHelper.send(req.body.email,
        mailTemplate.subject,
        mailTemplate.html, mailTemplate.text, securityCode);

    return res.status(200).json({ message: 'El código de seguridad ha sido enviado a su casilla de correo.' });
}

var verifySecurityCode = function(req, res){

    User
    .findOne({ email: req.body.email })
    .then( (user) => {
        if(!user){
            return res.status(200).json({ errType: 1, message: 'El correo electrónico no es válido.' });
        }
        if(user.securityCode == req.body.securityCode){
            return res.status(200).json({ errType: 0, message: 'Código de seguridad valido.' });
        } else {
            return res.status(200).json({ errType: 2, message: 'El código de seguridad que ingresó es inválido.' });
        }
    })
}

var restorePassword = function(req, res){

    encryptPassword(req.body.password, function(data){
        var newPassword = data;
        
        User
        .findOneAndUpdate({ email: req.body.email },
            { $set: {securityCode: null, password: newPassword} },
            { new: true }, 
            function (err, user) {
                if(err || !user){
                    return res.status(401).json({ errType: 1, message: 'Se produjo un error restableciendo la contraseña. Intente nuevamente. ' + err });
                }else{
                    return res.status(200).json({ errType: 0, message: 'La contraseña se restableció con éxito!' });
                }
        })
        .catch((err) => {
            return res.status(401).json({ errType: 2, message: 'Se produjo un error buscando el usuario ' + err });
        });
    })
}

var encryptPassword = function(password, callback) {
    bcryptjs.genSalt(10, function (err, salt) {
        bcryptjs.hash(password, salt, function (err, hash) {
            callback(hash);
        });
    })
}


module.exports = {
    sendSecurityCode: sendSecurityCode,
    verifySecurityCode: verifySecurityCode,
    restorePassword: restorePassword
}