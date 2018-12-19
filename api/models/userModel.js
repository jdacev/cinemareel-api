'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
      type: String,
      required: true
    },
    category: {
        type: String
    },
    subcategory: {
        type: String
    },
    status: {
        type: String
    },
    mobileDeviceRegistrationId: {
      type: String
    },
    deviceId: {
        manufacturer: {type: String},
        model: {type: String},
        platform: {type: String},
        serial: {type: String},
        uuid: {type: String},
        version: {type: String} 
    }
});


userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') && this.password || this.isNew && this.password) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        })
    }
    else {
        return next();
    }
});

/**
 * 
 */
userSchema.methods.comparePassword = function (passw, callback) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
}

module.exports = mongoose.model('User', userSchema);
