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

  socket.emit('newMessage', {
    from: "Tina Turner",
    text: "Hey. What's Love Got To Do With It?",
    createdAt: 123
  });

  socket.on('createMessage', function(message)
  {
    console.log('createMessage', message);
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
