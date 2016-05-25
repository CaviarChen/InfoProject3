$(document).ready(function() {
    window.onhashchange();
});


window.onhashchange = function(){

  var page = new Number(window.location.hash.slice(1));
  if ((isNaN(page))||(page<1)) {
    window.location.hash = '#1';
    return;
  }

  waitingDialog.show('Loading');
  $('#table_c').text('');

  $.get('api/Data', {'page':page})
   .done(function(res) {

     var data = JSON.parse(res);
     var txt;
     if (data['code']<0) {
       txt = '<div class="alert alert-danger" role="alert">'+data['message']+'</div>'

     } else {
       txt = '<div class="panel panel-default"><div class="panel-heading">Data</div><div class="panel-body">';
       txt += '<div class="table-responsive"><table class="table table-hover table-bordered">';
       txt += '<tr style="background-color:#FCF8E3">'
       for (var i = 0; i < data['data']['fields'].length; i++) {
         txt += '<td>'+data['data']['fields'][i]+'</td>'
       }
       txt += '</tr>'
       for (var j = 0; j < data['data']['table'].length; j++) {
         txt += '<tr>'
         for (var i = 0; i < data['data']['table'][j].length; i++) {
           txt += '<td>'+data['data']['table'][j][i]+'</td>'
         }
         txt += '</tr>'
       }
       txt += '</table></div></div></div>';
     }
     $('#table_c').append(txt);

     //  Pages

     txt = '<nav><ul class="pagination">';

     var state

     for (var i = 1; i <= data['total_pages']; i++) {
       state = (i==page) ? ' class="active"' : '';
       txt += '<li'+state+'><a href="#'+i+'">'+i+'</a></li>'
     }

     txt += '</ul></nav>'

     $('#page_c').text('');
     $('#page_c').append(txt);

     waitingDialog.hide();
   }).fail(function() {
     $('#table_c').append('<div class="alert alert-danger" role="alert"> Network is unreachable </div>');
     waitingDialog.hide();
   });

}
