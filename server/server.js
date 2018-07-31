const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server); // returns a web socket server

app.use(express.static(publicPath));

io.on('connection', function(socket)
{
  console.log('New user connected'); // fires on SERVER

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!')); // broadcasts to ALL connected users

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined')); // broadcast emits a message to ALL other connected users APART from you

  socket.on('createMessage', function(message, callback)
  {
      io.emit('newMessage', generateMessage(message.from, message.text)); // actually sending a message to users
      callback();
  });

  socket.on('createLocationMessage', function(coords)
  {
    io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', function()
  {
    console.log('User was disconnected');// fires on SERVER when user closes client
  });
}); // let's you register an event listener to listen for connections

server.listen(port, function() // aka app.createServer
{
  console.log(`Started up server on port ${port}`);
});
