$('#s-filter-1').on('change', function() {
  bool = ($('#s-filter-1 :selected').val()=="0");
  $('#s-filter-2').attr('disabled', bool);
  $('#i-filter-3').attr('disabled', bool);
});

$('#btn-generate').on('click', function(event) {

  waitingDialog.show('Loading');

  $.get( 'api/PivotTable', { value: $('#s-value :selected').val() } )
  .done(function( data ) {

    $('#table_c').text(data);
    waitingDialog.hide();
  });
});
