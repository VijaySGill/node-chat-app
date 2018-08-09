var socket = io();

socket.on('UpdateRoomList', function(rooms)
{
  if(!rooms.length > 0)
  {
    jQuery('.rooms-selector').append( `<option value="" selected disabled hidden>no active chatrooms</option>`);
  }

  else if(rooms.length >= 1)
  {
    jQuery('.rooms-selector').append( `<option value="" selected disabled hidden>Select a chatroom</option>`);
  }

  rooms.forEach(function(room)
  {
    jQuery('.rooms-selector').append( `<option>${room}</option>`);
  });
})

jQuery('.rooms-selector').click(function(e)
{
    jQuery('.room-name-field').val(e.target.value);
});


jQuery('.choose-existing-room a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

jQuery('.join-existing-room a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");

   jQuery(".create-own-room-form").trigger('reset'); // resets sign-up form
});
