var socket = io.connect('http://localhost:8888');
socket.on('hello', function (data){
  console.log(data.message);
});

$(document).ready(function(){
  $(a).click(function(){
    alert('a clicked');
    socket.emit('readFile', {name: 'test.md'});
  });
});
