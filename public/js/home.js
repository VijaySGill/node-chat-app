var socket = io();

jQuery(document).ready(function()
{
  jQuery(".logged-in-message").delay(2200).fadeOut(1000);

  jQuery.ajax({
    url: '/me/name',
    method: 'GET',
    success: function(data)
    {
      jQuery('#user-name').val(data);
    }
  });
});

jQuery('.create-room-form').submit(function()
{
  event.preventDefault();

  var room = jQuery('.room-name').val();

  if(room)
  {
    jQuery('.finish-create-room').animate({height: "toggle", opacity: "toggle"}, "slow");
    jQuery('.create-room').hide();
    jQuery('.table100').hide();
    jQuery("#finish-room-label").text(room);
    jQuery('#room-name').val(room);
  }
});

socket.on('UpdateRoomList', function(rooms)
{
  if(!rooms.length > 0)
  {
    $("#table").find('tbody')
    .append($('<tr class="row100 body">')
        .append($('<td class="cell100 column1">No active chatrooms. <br/>Please create one!</td>'))
        .append($(`<td class="cell100 column2"></td>`))
        )
  }

  jQuery.ajax({
    url: '/me/name',
    method: 'GET',
    success: function(data)
    {
      rooms.forEach(function(room)
      {
        $("#table").find('tbody')
        .append($('<tr class="row100 body">')
            .append($(`<td id="chatroom-name" class="cell100 column1"><a href='/chat.html?name=${data}&room=${room}' target="_blank" rel="noopener noreferrer">${room}</a></td>`))
            )
        .append($('</tr>'))
      });
    }
  });
});
