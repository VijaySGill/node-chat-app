var socket = io();

function scrollToBottom()
{
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  // Heights
  var clientHeight = messages.prop('clientHeight'); // get height of client's visibility area
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
  {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() // what to do AFTER client has connected to server
{
  var params = jQuery.deparam(window.location.search);
  params.room = params.room.toLowerCase();

  socket.emit('join', params, function(error)
  {
    if(error)
    {
      alert(error);
      window.location.href = '/'; // redirects user back to root page
    }

    else
    {
      var params = jQuery.deparam(window.location.search);
      jQuery('.chat__sidebar p').replaceWith(jQuery("<p />").text(params.room.toLowerCase()));

      window.history.replaceState({}, document.title, "/" + ''); // removes parameters from URL
    }
  });
});

socket.on('newMessage', function(message)
{
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#message-template').html(); // returns HTML code inside the specified template
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message)
{
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#location-message-template').html(); // returns HTML code inside the specified template
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(event)
{
  event.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: jQuery('[name=message]').val()
  }, function()
  {
    jQuery(messageTextBox).val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function()
{
  if(!navigator.geolocation)
  {
    return alert('Geolocation not supported by this browser.')
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...'); // attr lets you add an attribute to the HTML object

  navigator.geolocation.getCurrentPosition(function(position) // success case
  {
    locationButton.removeAttr('disabled').text('Send Location'); // removes the specified attribute

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() // fail case
  {
    locationButton.removeAttr('disabled').text('Send Location');

    alert('Unable to fetch location.');
  });
});

socket.on('updateUserList', function(users)
{
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user)
  {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('disconnect', function()
{
  console.log('Disconnected from server'); // fires in the CLIENT
});
