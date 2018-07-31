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

socket.on('newLocationMessage', function(message)
{
  var list = jQuery('<li></li>');
  var anchor = jQuery('<a target="_blank">My current location</a>'); // blank tells browser to open up in new tab

  list.text(`${message.from}: `);
  anchor.attr('href', message.url);
  list.append(anchor);
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
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function()
{
  if(!navigator.geolocation)
  {
    return alert('Geolocation not supported by this browser.')
  }

  navigator.geolocation.getCurrentPosition(function(position)
  {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function()
  {
    alert('Unable to fetch location.');
  });
});

socket.on('disconnect', function()
{
  console.log('Disconnected from server'); // fires in the CLIENT
});
