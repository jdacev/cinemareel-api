'use strict';

var User = require('./../models/userModel');
//var authHelper = require('./helpers/authHelper');
var jwt = require('jwt-simple');
var moment = require('moment');

/**
 * Inicio de sesión
 * @param {*} req
 * @param {*} res
 */
var login = function (req, res) {

    // authHelper.login(req, res, function (result) {
    //     return res.status(200).json(result);
    // });
}

/**
 * Registro de nuevo Usuario
 * @param {*} req
 * @param {*} res
 */
var signup = function (req, res) {

    // Missing details
    if (!req.body.email || !req.body.password) {
        res.status(412);
        res.send({ msg: 'Please enter email and password.' });
    } else {
        var newUser = new User ({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: process.env.BASIC_ROLE,
            category: null,
            subcategory: null
        });

        newUser.save(function (err) {
            if (err) {
                res.status(500);
                res.send({ message: 'Internal server error', error: err });
            }
            else {
                res.status(201);
                res.send({ message: 'Bienvenido a CinemaReel!' });
            }
        })
    }
}


/**
 * Middleware para validar si el token del usuario es valido
 * @param {*} res
 * @param {*} next
 */
var isLoginRequired = function (req, res, next){
    if (req.headers.authorization) {

        if(req.headers.authorization.split(' ')[0] === 'JWT') {
            var token = req.headers.authorization.split(' ')[1];
            try {
                var tokenData = jwt.decode(token, process.env.JWT_SECRET, false);

                req.user = { user: tokenData.user };

                if (tokenData.exp <= moment().unix()) {
                    return res.status(407).send( {
                        message: 'Las credenciales han expirado. Deberá ingresar nuevamente a la aplicación.'
                    } );
                } else {
                    if(tokenData.userName) {
                        next();
                    } else {
                        return res.status(401).json({ message: 'Usuario no autorizado. Sin privilegios de usuario' });
                    }
                }
            } catch (err){
                return res.status(401).json({ message: 'Error en la verificación de la firma del token' + err });
            }
        } else {
            return res.status(401).json({ message: 'Usuario no autorizado' });
        }
    } else {
        //Si la petición no contiene Authentication en el Header.
        return res.status(403).send( { message: 'La petición no contiene el token de autenticación en la cabecera.' } );
    }
}

module.exports = {
    signup: signup,
    login: login,
    isLoginRequired: isLoginRequired,
}
