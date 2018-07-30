var socket = io();

socket.on('connect', function() // what to do AFTER you've connected
{
  console.log('Connected to server'); // fires in the CLIENT
});

socket.on('newMessage', function(message)
{
  console.log('newMessage', message);
});

socket.on('disconnect', function()
{
  console.log('Disconnected from server'); // fires in the CLIENT
});
