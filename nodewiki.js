#!/usr/bin/env node

var fs = require("fs");
var http = require("http");
var path = require("path");
var connect = require("connect");
var socketio = require("socket.io");
var mdserver = require("./mdserver");
var getDir = require("./getDir");

// for the CLI:
var start = false;
if (typeof process.argv[2] == 'undefined'){
  console.log('Starting node wiki');
  start = true;
}

if (process.argv[2] == 'help' || process.argv[2] == '--help' || process.argv[2] == '-h'){
  console.log('Node Wiki', '\n---------', '\nusage: nodewiki [--git] [--help]');
  console.log('\nThe \'--git\' option automatically commits each save to a git repository');
}

if (process.argv[2] == '--git' || process.argv[2] == 'git'){
  console.log('Starting node wiki in git mode');

  if (path.existsSync(process.cwd() + '/.git')){
    start = true;
  } else {
    console.log('ERROR: no git repository found. To use the \'--git\' option, you need a git repository to be in the current directory. Type "git init" to create one.');
  }
}
// end CLI code

if (start){
  var app = connect();
  app.use(connect.logger('dev'));
  app.use(connect.static(__dirname + '/static'));

  app.use('/', function(req, res){
    res.end(fs.readFileSync(__dirname + '/static/index.html', 'utf-8'));
  });

  var server = http.createServer(app);
  server.listen(8888);
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
        links = getDir.parseLinks(dir);
        links += '<code id="back_button">Go back</code>';
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
      if (directoryDepth > 0){
        links += '<code id="back_button">Go back</code>';
      }
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
}
