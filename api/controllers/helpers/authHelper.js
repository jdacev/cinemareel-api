'use strict';

var jwt = require('jwt-simple');
var User = require('./../../models/userModel');
//var pushNotifications = require('./pushNotificationsHelper');
var moment = require('moment');

var number = process.env.TOKEN_EXPIRES_NUMBER_VALUE || 7;
var literal = process.env.TOKEN_EXPIRES_STRING_VALUE || 'days';

/**
 * 
 * @param {*} user 
 * @param {*} res 
 */
var generateUserData = function (user, res) {

    var generatedUserData = {};

    generatedUserData = {
        _id: user.id,
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        category: user.category,
        subcategory: user.subcategory
    }

    var token = 'JWT ' + createToken(generatedUserData);
    res.status(200).send({ token: token, user: generatedUserData, errType:0 });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 */
var login = function (req, res, callback) {

    User
        .findOne({
            userName: req.body.username, status: { $ne: 'removed' }
        })
        .then((user) => {
            if (user == null) {
                callback({ message: 'El usuario no es válido. Intente nuevamente.', user: {}, errType: 1 });
                return;
            }

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    //pushNotifications.checkOrRegisterDeviceRegistrationId(user, req.body);
                    generateUserData(user, res);
                } else {
                    callback({ message: 'La contraseña es incorrecta. Intente nuevamente.', user: {}, errType: 2 });
                    return;
                }
            });
        })
        .catch((err) => {
            callback({ message: 'Falló el método de autenticación ', error: err, user: {}, errType: 3 });
        })
}


var createToken = function (data) {
    const payload = {
        iat: moment().unix(), // fecha de creacion del token
        // Expiración del token
        exp: moment().add(number, literal).unix(),
        email: data.email,
        role: data.role,
        userName: data.userName,
        user: data
    };

    return jwt.encode(payload, process.env.JWT_SECRET);
}

module.exports = {
    login: login,
    createToken: createToken,
    generateUserData: generateUserData
}