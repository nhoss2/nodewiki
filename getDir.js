var fs = require("fs");
var allowedExtensions = require("./allowedExtensions");

// get contents of current directory
function getDir(directory){
  var currentFiles = fs.readdirSync(directory);
  var dir = [];
  currentFiles.forEach(function(fileName){
    if (fs.statSync(directory + fileName).isDirectory() == true){
      dir.push({name: fileName + '/', folder: true, markdown: false});
    } else if (allowedExtensions.checkExtension(fileName) == true){
      dir.push({name: fileName, folder: false, markdown: true});
    } else {
      dir.push({name: fileName, folder: false, markdown: false});
    }
  });

  return dir;
}

function parseLinks(dir){

  var mdLinks = "";

  dir.forEach(function(fileName){
    if (fileName.markdown == true){
      mdLinks += '<a href="#"><code>' + fileName.name + '</code></a>\n';
    }
    if (fileName.folder == true && fileName.name.charAt(0) != '.'){
      // only display visible folders (and not folders that begin with a dot)
      mdLinks += '<a href="#"><code>' + fileName.name + '</code></a>\n';
    }
  });

  return mdLinks;
}

exports.getDir = getDir;
exports.parseLinks = parseLinks;
