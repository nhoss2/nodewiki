var fs = require("fs");
var http = require("http");
var path = require("path");
var connect = require("connect");
var socketio = require("socket.io");
var mdserver = require("./mdserver");
var allowedExtensions = require("./allowedExtensions");

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
    } else if (allowedExtensions.checkExtension(fileName) == true){
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
      mdLinks += '<a class="md_file" href="#">' + fileName.name + '</a>';
    } 
  });


  res.writeHead(200);
  res.write(fs.readFileSync('static/index.html', 'utf-8') + mdLinks);
  res.end('</body></html>');
});

var server = http.createServer(app);
server.listen(8888);
io = socketio.listen(server);

io.sockets.on('connection', function (socket){
  socket.emit('hello', {message: 'hello!'});

  socket.on('readFile', function (file){
    console.log('readFile recieved, file: ' + file.name);
    mdserver.sendFile(file, socket);
  });
});


console.log("server started");
