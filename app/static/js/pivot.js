$('#btn-generate').on('click', function(event) {
  $.get( "api/PivotTable", { value: $("#select_value :selected").val() } )
  .done(function( data ) {
    console.log( "Data Loaded: " + data );
  });
});
