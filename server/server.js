const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server); // returns a web socket server

app.use(express.static(publicPath));

io.on('connection', function(socket)
{
  console.log('New user connected'); // fires on SERVER

  socket.emit('newMessage', { // emit sends messages to EVERYONE
    from: 'Admin',
    text: 'Welcome to the Chat!',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', { // broadcast emits a message to ALL other connected users APART from you
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', function(message)
  {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
    socket.broadcast.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
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
