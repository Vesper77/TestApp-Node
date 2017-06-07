$('#getOne').on('click', function() {
  $.ajax({
    url: '/api/photos/' + $('#getId').val(),
    dataType: 'text',
    cache: false,
    contentType: false,
    processData: false,
    type: 'get',
    success: function() {
      window.location.replace('/api/photos/' + $('#getId').val())
    },
    error: function(response) {
      $('body').empty();
      $('body').html(JSON.stringify(response));
    },
  });
});

$('#delete').on('click', function() {
  $.ajax({
    url: '/api/photos/' + $('#deleteId').val(),
    dataType: 'text',
    cache: false,
    contentType: false,
    processData: false,
    type: 'delete',
    success: function(response) {
      $('body').empty();
      $('body').html(response);
    },
    error: function(response) {
      $('body').empty();
      $('body').html(JSON.stringify(response));
    },
  });
});

$('#put').on('click', function() {
  var file_data = $('#putPict').prop('files')[0];
  var form_data = new FormData();
  form_data.append('file', file_data);
  form_data.append('name', $('#putName').val());
  form_data.append('description', $('#putDesc').val());
  $.ajax({
    url: '/api/photos/' + $('#putId').val(),
    dataType: 'text',
    cache: false,
    contentType: false,
    processData: false,
    data: form_data,
    type: 'put',
    success: function(response) {
      $('body').empty();
      $('body').html(response);
    },
    error: function(response) {
      $('body').empty();
      $('body').html(JSON.stringify(response));
    },
  });
});


$('#post').on('click', function() {
  var file_data = $('#postPict').prop('files')[0];
  var form_data = new FormData();
  form_data.append('file', file_data);
  form_data.append('name', $('#postName').val());
  form_data.append('description', $('#postDesc').val());
  $.ajax({
    url: '/api/photos',
    dataType: 'text',
    cache: false,
    contentType: false,
    processData: false,
    data: form_data,
    type: 'post',
    success: function(response) {
      $('body').empty();
      $('body').html(response);
    },
    error: function(response) {
      $('body').empty();
      $('body').html(JSON.stringify(response));

    },
  });
});