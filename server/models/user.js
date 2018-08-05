const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true // removes all leading and trailing spaces but NOT spaces inbetween
  },

  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email address'
    }
  },

  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  tokens: [{
    access: {
      type: String,
      required: true
    },

    token: {
      type: String,
      required: true
    }
  }]
});

module.exports = {
  User: User
};
