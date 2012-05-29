var fs = require("fs");
var http = require("http");
var path = require("path");
var connect = require("connect");
var socketio = require("socket.io");
var mdserver = require("./mdserver");
var allowedExtensions = require("./allowedExtensions");

var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static('static'));


app.use('/', function(req, res){
  res.end(fs.readFileSync('static/index.html', 'utf-8'));
});

  // get contents of current directory
  var currentFiles = fs.readdirSync('.');
  var dir = [];
  currentFiles.forEach(function(fileName){
    if (fs.statSync(fileName).isDirectory() == true){
      dir.push({name: fileName, folder: true, markdown: false});
    } else if (allowedExtensions.checkExtension(fileName) == true){
      dir.push({name: fileName, folder: false, markdown: true});
    } else {
      dir.push({name: fileName, folder: false, markdown: false});
    }
  });

  var mdLinks = "";

  dir.forEach(function(fileName){
    if (fileName.markdown == true){
      mdLinks += '<a class="md_file" href="#">' + fileName.name + '</a>';
    } 
  });

var server = http.createServer(app);
server.listen(8888);
io = socketio.listen(server);

io.sockets.on('connection', function (socket){
  socket.emit('navLinks', {links: mdLinks});

  socket.on('readFile', function (file){
    console.log('readFile recieved, file: ' + file.name);
    mdserver.sendFile(file, socket);
  });

  socket.on('saveFile', function (file){
    console.log('saveFile recieved, file: ' + file.name);
    mdserver.saveFile(file, socket);
  });
});


console.log("server started");
