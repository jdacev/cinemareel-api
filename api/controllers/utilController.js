'use strict';

var mailHelper = require('./helpers/mailHelper');
var mailTemplateHelper = require('./helpers/mailTemplateHelper');
var User = require('../models/userModel');


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
            return res.status(200).json({ message: 'El correo electrónico no es válido.' });
        }
        if(user.securityCode == req.body.securityCode){
            return res.status(200).json({ message: 'Código de seguridad valido.' });
        } else {
            return res.status(401).json({ message: 'El código de seguridad que ingresó es inválido.' });
        }
    })
}

var restorePassword = function(req, res){

}


module.exports = {
    sendSecurityCode: sendSecurityCode,
    verifySecurityCode: verifySecurityCode,
    restorePassword: restorePassword
}