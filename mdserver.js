var fs = require("fs");
var path = require("path");
var marked = require("marked");
var allowedExtensions = require("./allowedExtensions");

function sendFile(file, socket){
  // make sure only markdown files are sent
  if (allowedExtensions.checkExtension(file.name) == true){
    fs.readFile(file.name, 'utf-8', function(err, data){
      if (err){
        console.log('read file error: ' + err);
        socket.emit('readFileReply', {fileContents: "", error: {error: true, reason: err.code}});
      } else {
        // only send the markdown file if there have been no errors
        var markdownParsed = marked(data)
        socket.emit('readFileReply', {fileContents: markdownParsed, error: {error: false}});
      }
    });
  } else {
    // something other then a markdown file was requested for
    socket.emit('readFileReply', {fileContents: "", error: {error: true, reason: "file requested is not a markdown file"}});
  }
}

exports.sendFile = sendFile;
