
$(document).ready(function(){

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
        $('#content').html(data.fileContents);
      }
    });
  });

});
