'use strict';

var authHelper = require('./helpers/authHelper');
var jwt = require('jwt-simple');
var moment = require('moment');

/**
 * Inicio de sesión
 * @param {*} req
 * @param {*} res
 */
var login = function (req, res) {

    authHelper.login(req, res, function (result) {
        return res.status(200).json(result);
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
var signup = function (req, res) {

    authHelper.signup(req, res, function (result) {
        return res.status(200).json(result);
    });
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
                    if(tokenData.email) {
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
