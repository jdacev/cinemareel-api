'use strict';

var User = require('../../models/userModel');
const sgMail = require('@sendgrid/mail');


var send = function(email, subject, html, text, securityCode) {
    
    User
    .findOneAndUpdate({ email: email },
        { $set: {securityCode: securityCode} },
        { new: true }, 
        function (err, user) {
            if(err || !user){
                return res.status(500).json({ message: 'Se produjo un error en el envío del código de seguridad. Intente nuevamente. ' + err });
            }
            const msg = {
                to: user.email,
                from: process.env.EMAIL_SENDER,
                subject: subject,
                text: text,
                html: html,
              };
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              sgMail.send(msg);
    })
    .catch((err) => {
        return res.status(500).json({ message: 'Se produjo un error interno en sendMail findUser ' + err });
    });
}

module.exports = {
    send: send
}
