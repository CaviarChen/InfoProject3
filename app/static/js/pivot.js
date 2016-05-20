$('#s-filter-1').on('change', function() {
  bool = ($('#s-filter-1 :selected').val()=="-1");
  $('#s-filter-2').attr('disabled', bool);
  $('#i-filter-3').attr('disabled', bool);
});

$('#btn-generate').on('click', function(event) {

  waitingDialog.show('Loading');
  $('#table_c').text('');

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

  // get request
  $.get('api/PivotTable', args)
  .done(function(res) {
    var data = JSON.parse(res);
    var txt;
    if (data['code']==-1) {
      txt = '<div class="alert alert-danger" role="alert">'+data['message']+'</div>'

    } else {
      txt = res;

    }

    $('#table_c').append(txt);
    waitingDialog.hide();
  });
});
