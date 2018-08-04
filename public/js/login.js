jQuery('.not-registered a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

jQuery('.already-registered a').click(function()
{
   jQuery('form').animate({height: "toggle", opacity: "toggle"}, "slow");

   jQuery(".register-form").trigger('reset'); // resets sign-up form
});
