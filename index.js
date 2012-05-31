var fs = require("fs");
var http = require("http");
var connect = require("connect");
var socketio = require("socket.io");
var mdserver = require("./mdserver");
var getDir = require("./getDir");

var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static('static'));


app.use('/', function(req, res){
  res.end(fs.readFileSync('static/index.html', 'utf-8'));
});

var currentPath = __dirname + '/';
var dir = getDir.getDir(currentPath);
var links = getDir.parseLinks(dir);
var directoryDepth = 0;

var dirFolders = [];
dir.forEach(function(i){
  if (i.folder == true){
    dirFolders.push(i.name);
  }
});

var server = http.createServer(app);
server.listen(8888);
io = socketio.listen(server);

io.sockets.on('connection', function (socket){
  socket.emit('navLinks', {links: links});

  socket.on('readFile', function (file){
    if(dirFolders.indexOf(file.name) > -1){
      // if folder
      currentPath += file.name;
      dir = getDir.getDir(currentPath);
      links = getDir.parseLinks(dir);
      socket.emit('navLinks', {links: links});
      directoryDepth += 1;
      mdserver.readFolder(file.name, socket);
    } else {
      mdserver.sendFile(file, socket);
    }
  });

  socket.on('saveFile', function (file){
    console.log('saveFile recieved, file: ' + file.name);
    mdserver.saveFile(file, socket);
  });
});


console.log("server started");
