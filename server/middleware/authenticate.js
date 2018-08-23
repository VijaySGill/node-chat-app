var {User} = require('./../models/user')

const authenticate = function(req, res, next)
{
    var token = req.cookies['x-auth'];

    User.findByToken(token).then(function(user)
    {
        if(!user)
        {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch(function(e)
    {
        res.status(401).send(e)
    });
};

module.exports = {
    authenticate
};
