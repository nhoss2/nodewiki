var socket = io.connect('http://localhost:8888');
socket.on('hello', function (data){
  console.log(data.message);
});
