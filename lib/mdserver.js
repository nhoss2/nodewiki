var fs = require("fs");
var path = require("path");
var marked = require("marked");
var allowedExtensions = require("./allowedExtensions");
var git = require("./git");
var nodewiki = require("../nodewiki");

marked.setOptions({
  gfm: true,
  pendantic: false,
  sanitize: true,
});

function withMeta(directory, cb){
  var metaPath = directory + "index.json";
  fs.readFile(metaPath, 'utf-8', function(err,meta){
    var metaChanged = false;
    if (err){
      meta = {index:"index.md",aliases:{}};
      metaChanged = true;
    } else {
      try{
        meta = JSON.parse(meta);
      } catch(e){
        meta = {index:"index.md",aliases:{}};
        metaChanged = true;
      }
    }
    if (!meta.hasOwnProperty('index') || typeof meta.index !== 'string'){
      meta.index = 'index.md';
      metaChanged = true;
    }
    if (!meta.hasOwnProperty('aliases') || typeof meta.aliases !== 'object'){
      meta.aliases = {};
      metaChanged = true;
    }
    cb(meta);
    if (metaChanged){
      var metaString = JSON.stringify(meta, null, 2);
      fs.writeFile(metaPath, metaString, function(err,res){});
    }
  });
}

function withMdFile(directory, file, name, cb){
  fs.readFile(directory + file.name, 'utf-8', function(err, data){
    if (err){
      console.log('read file error: ' + err);
      cb({fileContents: "", error: {error:true, reason: err.code}});
    } else {
      // only send the markdown file if there have been no errors
      var markdownParsed = marked(data);
      cb({fileContents: markdownParsed, error: {error: false}, rawMd: data, fileName: name});
    }
  });
}

function sendMdFile(directory, file, name, socket){
  // make sure only markdown files are sent
  if (allowedExtensions.checkExtension(file.name) != true){
    // something other then a markdown file was requested for
    socket.emit('readFileReply', {fileContents: "", error: {error: true, reason: "file requested is not a markdown file"}});
  } else {
    withMdFile(directory, file, name, function(data){
      socket.emit('readFileReply', data);
    });
  }
}

function sendFile(file, directory, socket){
  withMeta(directory, function(meta){
    if (meta.aliases.hasOwnProperty(file.name) && typeof meta.aliases[file.name] === 'string'){
      var name = meta.aliases[file.name];
    } else {
      name = file.name;
    }
    sendMdFile(directory, file, name, socket);
  });
}

function saveFile(file, directory, socket){
  if (allowedExtensions.checkExtension(file.name) == true && typeof file.content != 'undefined'){
    // only allow markdown files to be saved
    console.log('saving file');
    fs.writeFile(directory + file.name, file.content, function(err, data){
      console.log('saved file ' + directory + file.name);
      if (err){
        console.log('save file error: ' + err);
      } else {
        var markdownParsed = marked(file.content);
        socket.emit('saveFileReply', {fileContents: markdownParsed, error: {error: false}, rawMd: file.content, fileName: file.name});
//        if (process.argv[2] == 'git' || process.argv[2] == '--git'){
          if (nodewiki.gitMode == true) {
            git.commit(file, directory);
            console.log('git.commit called');
          } else {
            console.log('git commit not called');
          }
          
      }
    });
  } else {
    console.log('save error!');
    socket.emit('saveFileReply', {fileContents: "", error: {error: true, reason: 'file type not allowed (try saving it as *.md) or there was a problem with the content'}});
  }
}

function readFolder(currentPath, links, socket){
  socket.emit('navLinks', {links: links});
  socket.emit('readFolderReply', {success: true});
  withMeta(currentPath, function(meta){
    var file = {name:meta.index};
    if (meta.aliases.hasOwnProperty(file.name) && typeof meta.aliases[file.name] === 'string'){
      var name = meta.aliases[file.name];
    } else {
      name = file.name;
    }
    withMdFile(currentPath, file, name, function(data){
      if (!data.error.error)
        socket.emit('readFileReply', data);
    });
  });
}

exports.sendFile = sendFile;
exports.saveFile = saveFile;
exports.readFolder = readFolder;
