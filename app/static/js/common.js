$(document).ready(function() {
    // Set Active navbar
    $.each($('#navbar').find('li'), function() {
        $(this).toggleClass('active',window.location.pathname == $(this).find('a').attr('href'));
    });
});
