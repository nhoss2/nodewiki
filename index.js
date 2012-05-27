var fs = require("fs");
var http = require("http");
var path = require("path");
var connect = require("connect");
var socketio = require("socket.io");
var marked = require("marked");

var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static(__dirname));


app.use('/', function(req, res){


  // get contents of current directory
  var currentFiles = fs.readdirSync('.');
  var dir = [];
  currentFiles.forEach(function(fileName){
    if (fs.statSync(fileName).isDirectory() == true){
      dir.push({name: fileName, folder: true, markdown: false});
    } else if (path.extname(fileName) == ".md" || path.extname(fileName) == ".mdown" || path.extname(fileName) == ".markdown"){
      dir.push({name: fileName, folder: false, markdown: true});
    } else {
      dir.push({name: fileName, folder: false, markdown: false});
    }
  });


  /* reading and prasing md files
  var md = fs.readFileSync('test.md', 'utf-8');
  var md_marked = marked(md);
  */

  var mdLinks = "";

  dir.forEach(function(fileName){
    if (fileName.markdown == true){
      mdLinks += '<a href="#">' + fileName.name + '</a>';
    }
  });


  res.writeHead(200);
  res.write('<html>\n<head><script type="text/javascript" src="/socket.io/socket.io.js"></script><script type="text/javascript" src="/static/socketio.js"></script></head><body>' + mdLinks);
  res.end('</body></html>');
});

var server = http.createServer(app);
server.listen(8888);
io = socketio.listen(server);

io.sockets.on('connection', function (socket){
  socket.emit('hello', {message: 'hello!'});
});

console.log("server started");
