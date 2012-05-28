
$(document).ready(function(){

  var socket = io.connect();
  socket.on('connect', function(){
    socket.on('hello', function (data){
      console.log(data.message);
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
