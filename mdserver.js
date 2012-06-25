var fs = require("fs");
var path = require("path");
var marked = require("marked");
var allowedExtensions = require("./allowedExtensions");

marked.setOptions({
  gfm: true,
  pendantic: false,
  sanitize: true
});


function sendFile(file, directory, socket){
  // make sure only markdown files are sent
  if (allowedExtensions.checkExtension(file.name) == true){
    fs.readFile(directory + file.name, 'utf-8', function(err, data){
      if (err){
        console.log('read file error: ' + err);
        socket.emit('readFileReply', {fileContents: "", error: {error: true, reason: err.code}});
      } else {
        // only send the markdown file if there have been no errors
        var markdownParsed = marked(data)
        socket.emit('readFileReply', {fileContents: markdownParsed, error: {error: false}, rawMd: data, fileName: file.name});
      }
    });
  } else {
    // something other then a markdown file was requested for
    socket.emit('readFileReply', {fileContents: "", error: {error: true, reason: "file requested is not a markdown file"}});
  }
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
      }
    });
  } else {
    console.log('save ERROR!');
    socket.emit('saveFileReply', {fileContents: "", error: {error: true, reason: 'save file type not allowed or there was a problem with the content'}});
  }
}

function readFolder(links, socket){
  socket.emit('navLinks', {links: links});
  socket.emit('readFolderReply', {success: true});
}

exports.sendFile = sendFile;
exports.saveFile = saveFile;
exports.readFolder = readFolder;
