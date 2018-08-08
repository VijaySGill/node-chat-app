jQuery('.choose-existing-room a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

jQuery('.join-existing-room a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");

   jQuery(".create-own-room-form").trigger('reset'); // resets sign-up form
});
