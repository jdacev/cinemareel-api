'use strict';

var mailHelper = require('./helpers/mailHelper');
var mailTemplateHelper = require('./helpers/mailTemplateHelper');


var sendSecurityCode = function(req, res) {
    const mailTemplate = mailTemplateHelper.securityCode(123456);
    mailHelper.send(req.body.email,
        mailTemplate.subject, 
        mailTemplate.html, mailTemplate.text);

    return res.status(200).json({ msg: 'Correo enviado con éxito.' });
}


module.exports = {
    sendSecurityCode: sendSecurityCode
}