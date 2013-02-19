#!/usr/bin/env node

var fs = require("fs");
var http = require("http");
var path = require("path");
var connect = require("connect");
var socketio = require("socket.io");
var mod_getopt = require('posix-getopt');
var mdserver = require("./lib/mdserver");
var getDir = require("./lib/getDir");

// Defaults
var portNumberDefault = 8888;
var portNumber = portNumberDefault;
exports.gitMode = false;  // for lib/mdserver.js

// Process command line
var parser, option;
parser = new mod_getopt.BasicParser('h(help)g(git)p:(port)', process.argv);

while ((option = parser.getopt()) !== undefined) {

  switch (option.option) {

  case 'g':
    if (fs.existsSync(process.cwd() + '/.git')){
      exports.gitMode = true;
    } else {
      console.log(
        'ERROR: No git repository found\n',
        '\'--git\' requires a git repository in the current directory.\n',
        'Type "git init" to create one.');
      process.exit(1);
    }
    break;

  case 'h':
    showHelp();
    process.exit(0);
    break;

  case 'p':
    var argPort = parseInt(option.optarg);
    if (typeof argPort == 'number' && argPort > 0){
      portNumber = argPort;
    } else {
      console.log('ERROR: %s is not a valid port number.\n', option.optarg);
      process.exit(1);
    }
    break;

  default:
    /* error message already emitted by getopt() */
    console.assert('?' == option.option);
    showUsage();
    process.exit(1);
    break;
  }
}

function showHelp(){
  console.log('Node Wiki', '\n---------');
  showUsage();
}

function showUsage() {
  console.log(
    'usage: nodewiki [--git] [--help] [--port <portnumber>]\n',
    '  -g | --git    Commit each save to a git repository\n',
    '  -h | --help   Print this message\n',
    '  -p | --port   Use the specified port'
    );
}

/*
 * For backwards compatibility, handle argument style (no '--' or '-')
 * options. Implmented for original options only: git, help, and <portNum>.
 */
for (var argn = parser.optind();
     argn < process.argv.length;
     argn++) {
  var arg = process.argv[argn];

  if (arg == "git") {
    exports.gitMode = true;
  } else if (arg == "help") {
    showHelp();
    process.exit(1);
  } else if (typeof parseInt(arg) == 'number' && (arg = parseInt(arg)) > 0) {
    if (portNumber != portNumberDefault) {
      console.log("WARNING: Overriding previous port number, %d", portNumber);
    }
    portNumber = arg;
  } else {
    console.log("WARNING: Unknown argument: %s", arg);
  }
}
  
// end of command line processing

var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static(__dirname + '/static'));

app.use('/', function(req, res){
  res.end(fs.readFileSync(__dirname + '/static/index.html', 'utf-8'));
});

var server = http.createServer(app);
server.listen(process.env.PORT || portNumber);
io = socketio.listen(server);
io.set('log level', 2);

io.sockets.on('connection', function (socket){
  var currentPath = process.cwd() + '/';
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
      links = getDir.parseLinks(dir, directoryDepth);
      mdserver.readFolder(links, socket);
    } else {
      mdserver.sendFile(file, currentPath, socket);
    }
  });

  socket.on('disconnect', function(){
    // if a user disconnects, reinitialise variables
    var currentPath = process.cwd() + '/';
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
      links = getDir.parseLinks(dir, directoryDepth);
      mdserver.readFolder(links, socket);
    }
  })

  socket.on('refreshNav', function(){
    refreshNavLinks();
  });

  socket.on('newFolder', function(folderName){
    fs.mkdir(currentPath + folderName, 0777, function(err){
      if (err){
        socket.emit('newFolderReply', err);
      } else {
        refreshNavLinks();
      }
    });
  });

  function refreshNavLinks(){
    refreshDir();
    links = getDir.parseLinks(dir, directoryDepth);
    socket.emit('navLinks', {links: links});
  }

  function refreshDir(){
    dir = getDir.getDir(currentPath);
    if (typeof dir != 'undefined'){
      dir.forEach(function(i){
        if (i.folder == true){
          dirFolders.push(i.name);
        }
      });
    }
  }

});
if (exports.gitMode == true) {
  console.log('Using git mode.');
}
console.log("server started, port: " + portNumber);
