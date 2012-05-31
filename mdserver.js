var fs = require("fs");
var path = require("path");
var marked = require("marked");
var allowedExtensions = require("./allowedExtensions");

marked.setOptions({
  gfm: true,
  pendantic: false,
  sanitize: true
});


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
        socket.emit('readFileReply', {fileContents: markdownParsed, error: {error: false}, rawMd: data, fileName: file.name});
      }
    });
  } else {
    // something other then a markdown file was requested for
    socket.emit('readFileReply', {fileContents: "", error: {error: true, reason: "file requested is not a markdown file"}});
  }
}

function saveFile(file, socket){
  if (allowedExtensions.checkExtension(file.name) == true){
    console.log('saving file');
    fs.writeFile(file.name, file.content, function(err, data){
      if (err){
        console.log('save file error: ' + err);
      } else {
        var markdownParsed = marked(file.content);
        socket.emit('saveFileReply', {fileContents: markdownParsed, error: {error: false}, rawMd: file.content, fileName: file.name});
      }
    });
  }
}

function readFolder(folder, socket){

}

exports.sendFile = sendFile;
exports.saveFile = saveFile;
exports.readFolder = readFolder;
