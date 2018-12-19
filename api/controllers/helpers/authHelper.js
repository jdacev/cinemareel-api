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
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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
            email: req.body.email, status: { $ne: 'removed' }
        })
        .then((user) => {
            if (user == null) {
                callback({ message: 'El correo electrónico no es válido. Intente nuevamente.', user: {}, errType: 1 });
                return;
            }

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    //pushNotifications.checkOrRegisterDeviceRegistrationId(user, req.body);
                    generateUserData(user, res);
                } else {
                    callback({ message: 'La contraseña es incorrecta. Intente nuevamente.', user: {}, error: err, errType: 2 });
                    return;
                }
            });
        })
        .catch((err) => {
            callback({ message: 'Falló el método de autenticación ', error: err, user: {}, errType: 3 });
        })
}

/**
 * Registro de nuevo Usuario
 * @param {*} req
 * @param {*} res
 */
var signup = function (req, res, callback) {
    if (!req.body.email || !req.body.password) {
        //res.status(412);
        callback({ message: 'Tenes que completar el correo electrónico y la contraseña.', user: {}, errType: 1 });
        return;
    } else {
        var newUser = new User ({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            role: process.env.BASIC_ROLE,
            category: null,
            subcategory: null
        });

        newUser.save(function (err) {
            if (err) {
                //res.status(500);
                callback({ message: 'Internal server error', user: {}, errType: 2 });
                return;
            } else {
                //res.status(201);
                User
                .findOne({
                    email: req.body.email, status: { $ne: 'removed' }
                })
                .then((user) => {
                    generateUserData(user, res);
                })
            }
        })
    }
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
    signup: signup,
    createToken: createToken,
    generateUserData: generateUserData
}