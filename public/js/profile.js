jQuery(document).ready(function()
{
  var name = jQuery('.profile-header p').html();

  jQuery('#username-field').val(name);

  jQuery.ajax({
    url: '/me/bio',
    method: 'GET',
    success: function(data)
    {
      jQuery('#bio-field').val(data);
    }
  });
});
