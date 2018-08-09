const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');
const {Rooms} = require('./utils/rooms')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server); // returns a web socket server
var users = new Users(); // creates user array
var rooms = new Rooms()

app.use(express.static(publicPath));

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
