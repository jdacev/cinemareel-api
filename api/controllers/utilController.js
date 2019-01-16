'use strict';

var mailHelper = require('./helpers/mailHelper');
var mailTemplateHelper = require('./helpers/mailTemplateHelper');


function generateSecurityCode () {
    return Math.floor(Math.random() * (1000000));
  }

var sendSecurityCode = function(req, res) {
    const mailTemplate = mailTemplateHelper.securityCode(generateSecurityCode());
    mailHelper.send(req.body.email,
        mailTemplate.subject, 
        mailTemplate.html, mailTemplate.text);

    return res.status(200).json({ msg: 'El código de seguridad ha sido enviado a su casilla de correo.' });
}


module.exports = {
    sendSecurityCode: sendSecurityCode
}