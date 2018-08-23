require('./config/config.js');

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');

const {ObjectID} = require('mongodb')
const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');
const {Rooms} = require('./utils/rooms');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server); // returns a web socket server
var users = new Users(); // creates user array
var rooms = new Rooms()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(publicPath));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.post('/register', async function(request, response)
{
    if(request.body.password === request.body.confirmPassword)
    {
      try
      {
          const body = _.pick(request.body, ['username', 'password']);
          const user = new User(body);
          await user.save();
          // const token = await user.generateAuthToken();
          // response.cookie('x-auth', token).header('x-auth', token);
          response.render('home', {
            message: 'You have successfully logged in.'
          });
      }

      catch(e)
      {
          console.log(e);
          response.status(400).render('register', {message: e});
      }
    }

    else
    {
      response.status(400).render('register', {message: 'Passwords do not match. Please try again.'});
    }
});

app.post('/login', async function(req, res)
{
  try
  {
    const body = _.pick(req.body, ['username', 'password']);
    const user = await User.findByCredentials(body.username, body.password);
    // const token = await user.generateAuthToken();

    // res.cookie('x-auth', token).header('x-auth', token);
    res.render('home', {
      message: 'You have successfully logged in.'
    });
  }

  catch(e)
  {
    res.status(400).render('login', {message: 'Incorrect login details. Please try again.'});
  }
});

app.delete('/logout', authenticate, async function(req, res)
{
    try
    {
        await req.user.removeToken(req.token);
        res.status(200).clearCookie('x-auth', req.token).render('login', {message: 'You have successfully logged out.'});
    }

    catch(e)
    {
        res.status(400).render('login', {message: 'Please try again.'});
    }
});

app.get('/', async function(req, res)
{
  try
  {
      let token = req.cookies['x-auth'];
      const user = await User.findByToken(token);
      res.render('home', {message: '', name: user.name});
  }

  catch(e)
  {
      res.status(400).render('login', {message: ''})
  }
});

app.get('/home', async function(req, res)
{
  try
  {
      let token = req.cookies['x-auth'];
      const user = await User.findByToken(token);
      res.render('home', {message: 'You have successfully logged in', name: user.name});
  }

  catch(e)
  {
      res.status(400).render('login', {message: 'Login required.'})
  }
});

app.get('/profile', async function(req, res)
{
    try
    {
        let token = req.cookies['x-auth'];
        const user = await User.findByToken(token);
        res.render('profile', {
          message: `@${user.username}`,
          bio: user.bio,
          error: ''});
    }

    catch(e)
    {
        res.status(400).render('login', {message: 'Login required.'})
    }
});

app.get('/profile-password', async function(req, res)
{
  try
  {
      let token = req.cookies['x-auth'];
      const user = await User.findByToken(token);
      res.render('profile-password', {
        message: ''
      });
  }

  catch(e)
  {
      res.status(400).render('login', {message: 'Login required.'})
  }
});

app.get('/me/name', authenticate, function(request, response)
{
  response.send(request.user.username);
});

app.get('/me/bio', authenticate, function(request, response)
{
  response.send(request.user.bio);
});

app.patch('/update-profile', authenticate, function(request, response)
{
  // console.log("-------------------------------------------");
  // console.log("Original bio = " + JSON.stringify(request.user.bio, undefined, 2));
  // console.log("New body is = " + JSON.stringify(request.body.bio, undefined, 2));
  //
  // console.log("\nOriginal username = " + JSON.stringify(request.user.username, undefined, 2));

  var userInput = request.body.username; // remove @ from start when saving new username
  if(userInput.charAt(0) === '@')
  {
    userInput = userInput.substr(1);
  }

  // console.log("New username is = " + JSON.stringify(userInput, undefined, 2));
  // console.log("-------------------------------------------");

  var body = _.pick(request.body, ['username', 'bio']);
  if(!body.username.length > 0 || body.username === '@')
  {
    return response.status(400).render('profile', {
      message: `@${request.user.username}`,
      bio: request.user.bio,
      error: 'Please specify a username.'});
  }

  else if(request.user.username === userInput && request.user.bio == body.bio)
  {
    return response.render('profile', {
      message: request.body.username,
      bio: request.user.bio,
      error: 'No changes detected. Please try again.'
    });
  }

  else if(request.user.username != userInput)
  {
    User.findOne({username: userInput}).then(function(user)
    {
      if(user)
      {
        response.render('profile', {
          message: `${request.body.username}`,
          bio: request.user.bio,
          error: 'This username already exists. Please try again.'});
      }

      else
      {
        body.username = userInput;
        body.bio = request.body.bio;

        User.findOneAndUpdate({_id: request.user._id}, {$set: body}, {new: true}).then(function(user)
        {
          if(!user)
          {
            return response.status(404).send();
          }

          response.render('profile', {
            message: `${request.body.username}`,
            bio: request.user.bio,
            error: 'Successfully updated user profile.'
          });

        }).catch(function(error)
        {
          response.status(400).send();
        });
      }
    });
  }

      else if(request.user.bio != body.bio)
      {
            body.bio = request.body.bio;

            User.findOneAndUpdate({_id: request.user._id}, {$set: body}, {new: true}).then(function(user)
            {
              if(!user)
              {
                return response.status(404).send();
              }

              response.render('profile', {
                message: `${request.body.username}`,
                bio: request.user.bio,
                error: 'Successfully updated user profile.'
              });

            }).catch(function(error)
            {
              response.status(400).send();
            });
      }
});

app.patch('/update-password', authenticate, function(request, response)
{
  User.findOne({_id: request.user._id}).then(function(user)
  {
      if(!user)
      {
        return Promise.reject();
      }

      bcrypt.compare(request.body.currentPassword, request.user.password, function(err, res)
      {
        if(res)
        {
          if(request.body.password === request.body.newPassword)
          {
            var body = _.pick(request.body, ['password']); // new password plain text
            var newPassword;

            bcrypt.genSalt(10, function(err, salt)
            {
                bcrypt.hash(body.password, salt, function(err, hash)
                {
                    body.password = hash;

                    User.findOneAndUpdate({_id: request.user._id}, {$set: body}, {new: true}).then(async function(user)
                    {
                      response.render('profile-password', {
                        message: 'Successfully updated password.'
                      });

                    }).catch(function(error)
                    {
                      response.status(400).send();
                    });
                });
            });
          }

          else
          {
            response.render('profile-password', {
              message: 'Passwords do not match. Please try again.'
            });
          }
        }

        else
        {
          response.render('profile-password', {
            message: 'Incorrect password. Please try again.'
          });
        }
    });
  });
});

io.on('connection', function(socket) // let's you register event listeners to listen for connections
{
  socket.emit('UpdateRoomList', rooms.getRoomList())

  socket.on('join', function(params, callback)
  {
    if(!isRealString(params.name) || !isRealString(params.room))
    {
      return callback('Display name and chatroom name are required.');
    }

    rooms.addRoom(params.room)

    socket.join(params.room); // let user join new room
    users.removeUser(socket.id); // removes user from any previous rooms
    users.addUser(socket.id, params.name, params.room); // user joins room

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!')); // broadcasts to ALL connected users
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat`)); // broadcast emits a message to ALL other connected users APART from you

    callback();
  });

  socket.on('createMessage', function(message, callback)
  {
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text))
    {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); // actually sending a message to users
    }

    callback();
  });

  socket.on('createLocationMessage', function(coords)
  {
    var user = users.getUser(socket.id);

    if(user)
    {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', function()
  {
    // fires on SERVER when user leaves chat
    var user = users.removeUser(socket.id);

    if(user)
    {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room)); // update user list because someone has left
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`)); // alert all other users that they left

      rooms.removeRoom(user.room, users.getUserList(user.room).length)
    }
  });
});

server.listen(port, function() // aka app.createServer
{
  console.log(`Started up server on port ${port}`);
});

module.exports = {
    app
};
