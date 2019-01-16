'use strict';

var User = require('../../models/userModel');
const sgMail = require('@sendgrid/mail');


var send = function(email, subject, html, text) {
    
    User
    .findOne({ email: email })
    .then((user) => {
        
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
        res.status(500);
        res.send({ message: 'Internal server error in sendMail findUser ' + err });
    });
}

module.exports = {
    send: send
}
