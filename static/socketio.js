
$(document).ready(function(){

  var socket = io.connect();
  socket.on('connect', function(){
    socket.on('hello', function (data){
      console.log(data.message);
    });

    $('a').click(function(){
      socket.emit('readFile', {name: 'test.md'});
    });
  });

});
