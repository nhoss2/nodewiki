var fs = require("fs");
var http = require("http");
var path = require("path");
var connect = require("connect");
var socketio = require("socket.io");
var marked = require("marked");

var app = connect();
app.use(connect.logger('dev'));

app.use('/', function(req, res){


  // get contents of current directory
  var currentFiles = fs.readdirSync('.');
  var dir = [];
  currentFiles.forEach(function(fileName){
    if (fs.statSync(fileName).isDirectory() == true){
      dir.push({name: fileName, folder: true, markdown: false});
    } else if (path.extname(fileName) == ".md"){
      dir.push({name: fileName, folder: false, markdown: true});
    } else {
      dir.push({name: fileName, folder: false, markdown: false});
    }
  });

  var md = fs.readFileSync('test.md', 'utf-8');
  var md_marked = marked(md);

  res.writeHead(200);
  res.write('<body>' + JSON.stringify(dir));
  res.end();
});

var server = http.createServer(app);
server.listen(8888);

console.log("server started");
