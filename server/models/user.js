const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        trim: true,
    },

    password: {
        type: 'string',
        require: true,
        minlength: 6
    },

    bio: {
      type: String,
      required: false,
      default: ''
    },

    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

userSchema.methods.toJSON = function()
{
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'username']);
};

userSchema.methods.generateAuthToken = function()
{
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    console.log(token);

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(function()
    {
        return token;
    });
};

userSchema.methods.removeToken = function(token)
{
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

userSchema.statics.findByToken = function(token)
{
    var User = this;
    var decoded;

    try
    {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    catch (e)
    {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

userSchema.statics.findByCredentials = function(username, password)
{
    var User = this;

    return User.findOne({username}).then(function(user)
    {
        if(!user)
        {
            return Promise.reject();
        }

        return new Promise(function(resolve, reject)
        {
           bcrypt.compare(password, user.password, function(err, res)
           {
             if(res)
             {
               resolve(user);
             }

             else
             {
               reject();
             }
           });
        });
    });
};

userSchema.pre('save', function (next)
{
    var user = this;

    if(user.isModified('password'))
    {
        bcrypt.genSalt(10, function(err, salt)
        {
            bcrypt.hash(user.password, salt, function(err, hash)
            {
                user.password = hash;
                next();
            });
        });
    }

    else
    {
        next();
    }
});

let User = mongoose.model('User', userSchema);

module.exports = {
    User
};
