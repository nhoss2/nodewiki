
$(document).ready(function(){

  var rawMd, fileName;
  var editing = false;

  var socket = io.connect();
  socket.on('connect', function(){
    socket.on('navLinks', function (data){
      $('#navigation').html(data.links);
    });

    $(document).on('click', 'a.md_file', function(a){
      socket.emit('readFile', {name: $(a.currentTarget).text()});
    });

    socket.on('readFileReply', function(data){
      if (data.error.error == true){
        console.warn('error: ' + data.error.reason);
      } else {
        $('#content_area').html(data.fileContents);
        rawMd = data.rawMd;
        fileName = data.fileName;
      }
    });

    socket.on('saveFileReply', function(data){
      if (data.error.error == true){
        console.warn('there was an error saving');
        $('#save_bar').html('there was an error');
      } else {
        $('#content_area').html(data.fileContents);
        $('#save_bar').html('');
        rawMd = data.rawMd;
        fileName = data.fileName;
        editing = false;
      }
    });

    $(document).on('click', '#save_bar a', function(){
      socket.emit('saveFile', {name: fileName, content: $('#content textarea').val()});
      $('#save_bar').html('saving...');
    });
  });

  $(document).on('click', '#content_area', function(){
    if (editing == false){
      editing = true;
      $('#content_area').html('<textarea rows="20" cols="60">' + rawMd + '</textarea>');
      $('#save_bar').html('<a href="#">save</a>');
    }
  });


});
