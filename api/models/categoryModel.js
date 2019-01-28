'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: {
    type: String,
    required: 'El nombre es obligatorio'
  },
  description: {
    type: String
  },
  createdDate: {
      type: Date,
      default: Date.now
  },
  active: {
    type: Boolean,
  }
});

module.exports = mongoose.model('Category', categorySchema);
