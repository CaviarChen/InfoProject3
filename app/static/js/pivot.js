$(document).ready(function() {
  if(window.location.hash!='') {
    window.onhashchange();
  }
});

$('#s-filter-1').on('change', function() {
  bool = ($('#s-filter-1 :selected').val()=="-1");
  $('#s-filter-2').attr('disabled', bool);
  $('#i-filter-3').attr('disabled', bool);
});

function set_args(args) {
  $('#s-filter-1 option[value="'+args['filter1']+'"]').prop('selected', true);
  if (args['filter1']!="-1") {
    $('#s-filter-2 option[value="'+args['filter2']+'"]').prop('selected', true);
    $('#i-filter-3').val(args['filter3']);
  }
  $('#s-row option[value="'+args['row']+'"]').prop('selected', true);
  $('#s-col option[value="'+args['col']+'"]').prop('selected', true);
  $('#s-val-1 option[value="'+args['val1']+'"]').prop('selected', true);
  $('#s-val-2 option[value="'+args['val2']+'"]').prop('selected', true);

  $("#s-filter-1").trigger("change");
}

function get_args() {
  var args={}; // restful api args
  args['filter1'] = $('#s-filter-1 :selected').val();
  if (args['filter1']!="-1") {
    args['filter2'] = $('#s-filter-2 :selected').val();
    args['filter3'] = $('#i-filter-3').val();
  }
  args['row'] = $('#s-row :selected').val();
  args['col'] = $('#s-col :selected').val();
  args['val1'] = $('#s-val-1 :selected').val();
  args['val2'] = $('#s-val-2 :selected').val();

  return args;
}

$('#btn-generate').on('click', function(event) {
  var args=get_args(); // restful api args
  window.location = '#q=' + JSON.stringify(args);
});

$('#btn-json').on('click', function(event) {
  var args=get_args(); // restful api args
  window.open('/api/PivotTable?'+$.param(args),'_blank');

});

window.onhashchange = function(){
  waitingDialog.show('Loading');
  $('#table_c').text('');

  try{
      args = JSON.parse(window.location.hash.slice(3));
  }catch(e){
    var args = {};
  }


  set_args(args);

  $.get('api/PivotTable', args)
  .done(function(res) {
    var data = JSON.parse(res);
    var txt;
    if (data['code']<0) {
      txt = '<div class="alert alert-danger" role="alert">'+data['message']+'</div>'

    } else {
      txt = '<div class="panel panel-default"><div class="panel-heading">Table</div><div class="panel-body">';

      txt += '<div class="table-responsive"><table class="table table-hover table-bordered table-condensed">';

      txt += '<tr>'
      txt += '<td>#</td>'
      for (var i = 0; i < data['data']['rows'].length; i++) {
        txt += '<td>'+data['data']['rows'][i]+'</td>'
      }
      txt += '</tr>'

      for (var j = 0; j < data['data']['cols'].length; j++) {
        txt += '<tr>'
        txt += '<td>'+data['data']['cols'][j]+'</td>'
        for (var i = 0; i < data['data']['rows'].length; i++) {
          txt += '<td style="background-color: '+data['data']['color'][j*data['data']['rows'].length+i]+'">'+data['data']['table'][j*data['data']['rows'].length+i]+'</td>'
        }
        txt += '</tr>'
      }
      txt += '</table></div></div></div>';
    }
    $('#table_c').append(txt);
    waitingDialog.hide();
  }).fail(function() {
    $('#table_c').append('<div class="alert alert-danger" role="alert"> Network is unreachable </div>');
    waitingDialog.hide();
  });

}
