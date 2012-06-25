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


var server = http.createServer(app);
server.listen(8888);
io = socketio.listen(server);
io.set('log level', 2);

io.sockets.on('connection', function (socket){
  var currentPath = __dirname + '/';
  var dir = getDir.getDir(currentPath);
  var links = getDir.parseLinks(dir);
  var directoryDepth = 0;

  var dirFolders = []; // array to hold the names of all folders in current directory
  dir.forEach(function(i){
    if (i.folder == true){
      dirFolders.push(i.name);
    }
  });
  socket.emit('navLinks', {links: links});

  socket.on('readFile', function (file){
    console.log('readFile recieved - ' + file.name);
    if(dirFolders.indexOf(file.name) > -1){ // checks if request is in the dirFolders array (meaning that the request is for a folder)
      currentPath += file.name;
      refreshDir();
      directoryDepth += 1;
      links = getDir.parseLinks(dir);
      links += '<code id="back_button">Go back</code>';
      mdserver.readFolder(links, socket);
    } else {
      mdserver.sendFile(file, currentPath, socket);
    }
  });

  socket.on('disconnect', function(){
    // if a user disconnects, reinitialise variables
    var currentPath = __dirname + '/';
    refreshDir();
    var links = getDir.parseLinks(dir);
    var directoryDepth = 0;
  });

  socket.on('saveFile', function (file){
    console.log('saveFile recieved, file: ' + file.name);
    mdserver.saveFile(file, currentPath, socket);
  });

  socket.on('goBackFolder', function(){
    if (directoryDepth > 0){
      currentPath = currentPath.substr(0, currentPath.substr(0, currentPath.length - 1).lastIndexOf('/')) + '/'; // removes current directory form the currentPath variable
      refreshDir();
      directoryDepth -= 1;
      links = getDir.parseLinks(dir);
      if (directoryDepth > 0){
        links += '<code id="back_button">Go back</code>';
      }
      mdserver.readFolder(links, socket);
    }
  })

  socket.on('refreshNav', function(){
    refreshDir();
    links = getDir.parseLinks(dir);
    socket.emit('navLinks', {links: links});
  });

  function refreshDir(){
    dir = getDir.getDir(currentPath);
    dir.forEach(function(i){
      if (i.folder == true){
        dirFolders.push(i.name);
      }
    });
  }

});


console.log("server started");
