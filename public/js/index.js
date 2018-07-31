var socket = io();

socket.on('connect', function() // what to do AFTER you've connected
{
  console.log('Connected to server'); // fires in the CLIENT
});

socket.on('newMessage', function(message)
{
  console.log('newMessage', message);

  var list = jQuery('<li></li>');
  list.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(list);
});

jQuery('#message-form').on('submit', function(event)
{
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function()
  {

  });

  socket.on('disconnect', function()
  {
    console.log('Disconnected from server'); // fires in the CLIENT
  });
});
