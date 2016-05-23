$('#s-filter-1').on('change', function() {
  bool = ($('#s-filter-1 :selected').val()=="-1");
  $('#s-filter-2').attr('disabled', bool);
  $('#i-filter-3').attr('disabled', bool);
});

function create_args() {
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

  waitingDialog.show('Loading');
  $('#table_c').text('');

  var args=create_args(); // restful api args

  // get request
  $.get('api/PivotTable', args)
  .done(function(res) {
    var data = JSON.parse(res);
    var txt;
    if (data['code']==-1) {
      txt = '<div class="alert alert-danger" role="alert">'+data['message']+'</div>'

    } else {
      txt = '<div class="panel panel-default"><div class="panel-heading">Table</div><div class="panel-body">';

      txt += '<div class="table-responsive"><table class="table table-hover table-bordered">';

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
  });
});

$('#btn-json').on('click', function(event) {
  var args=create_args(); // restful api args
  window.open('/api/PivotTable?'+$.param(args),'_blank');

});
