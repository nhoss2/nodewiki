var fs = require("fs");
var path = require("path");
var marked = require("marked");
var allowedExtensions = require("./allowedExtensions");
var git = require("./git");
var nodewiki = require("../nodewiki");
var withMeta = require("./meta").withMeta;
var writeMeta = require("./meta").writeMeta;

marked.setOptions({
  gfm: true,
  pendantic: false,
  sanitize: true,
});


function withMdFile(directory, file, name, cb){
  fs.readFile(directory + name, 'utf-8', function(err, data){
    if (err){
      console.log('read file error: ' + err);
      cb({fileContents: "", error: {error:true, reason: err.code}});
    } else {
      // only send the markdown file if there have been no errors
      var markdownParsed = marked(data);
      cb({fileContents: markdownParsed, error: {error: false}, rawMd: data, fileName: file.name, trueFileName: name});
    }
  });
}

function sendMdFile(directory, file, name, socket){
  // make sure only markdown files are sent
  if (allowedExtensions.checkExtension(name) != true){
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
  withMeta(directory, function(meta){
    if (allowedExtensions.checkExtension(file.name) == true && typeof file.content != 'undefined'){
      // only allow markdown files to be saved
      console.log('saving file');
      fs.writeFile(directory + file.name, file.content, function(err, data){
        console.log('saved file ' + directory + file.name);
        if (err){
          console.log('save file error: ' + err);
        } else {
          Object.keys(meta.aliases).forEach(function(alias){
            if (meta.aliases[alias] === file.name)
              delete meta.aliases[alias];
          });
          if (file.alias)
            meta.aliases[file.alias] = file.name;
          writeMeta(meta, directory);
          var markdownParsed = marked(file.content);
          socket.emit('saveFileReply', {fileContents: markdownParsed, error: {error: false}, rawMd: file.content,
                                        fileName: file.name});
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
  });
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

//  API V2 Serveur d évènements (semaphore look-alike)
//  
//  
//  try_wait (netsem, id, data, n, ctime, mtime)
//      if lock exists
//          if n==0
//              return false
//          stored n is decremented
//          time is reset with mtime
//          return true
//      if lock doesn't exist
//          create lock with n=given n
//          time is set with ctime
//          return true
//  
//  pour le blacklistage:
//      [ try_wait "blacklistage_auth_2" "truc@orange.fr" {...} 5 60,
//        try_wait "blacklistage_auth_2" "truc@orange.fr" {...} 15 600 ]
//  
//  for result in results:
//      if result == false
//          return "Oulah ! Blacklisted !!"
//
//  lock     (netsem, id, data, n, time, return_url)
//      <- null
//  create   (netsem)
//      <- false, true
//  destroy  (netsem)
//      <- null
//  
//  
//  time is a string,
//       "2012-03-27T03:21" -> expiration date
//       "+03:21","+03-01T" -> add time to current date
//  
//  d



