jQuery('.not-registered a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

jQuery('.already-registered a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");

   jQuery(".register-form").trigger('reset'); // resets sign-up form
});

jQuery('.register-form').submit(function()
{
  var userObj = {
    name: jQuery('.name-field').val(),
    email: jQuery('.email-field').val(),
    username: jQuery('.username-field').val(),
    password: jQuery('.password-field').val()
  };

  jQuery.ajax({
    url: 'https://still-eyrie-98136.herokuapp.com',
    type: "POST",
    data: JSON.stringify(userObj),
    contentType: 'application/json'
  }).done(function( msg )
  {
    console.log(msg);
  });
});
