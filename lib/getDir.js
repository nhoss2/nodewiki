var fs = require("fs");
var allowedExtensions = require("./allowedExtensions");
var results = null;

// get contents of current directory
function getDir(directory){
  try {
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

    dir.sort(function(a, b){ 
      var na = a.name.toLowerCase(), nb = b.name.toLowerCase();
      if (na < nb) return -1;
      if (nb < na) return 1;
      return 0;
    });

    // after the alphabetical sorting, the folders get separated from the files
    dir.sort(function(a, b){ 
      if (a.folder == true && b.folder == false) return -1;
      if (a.folder == false && b.folder == true) return 1;
      return 0;
    });

    return dir;

  } catch (err) {
    console.log('[getDir.getDir] ' + err);
  }
}

function getAllFiles(directory){
  results = [];
  getFiles(directory, results);
  return results;
}

function getFiles(directory, results){
  var currentFiles, i, len, fileName;
  try {
    currentFiles = fs.readdirSync(directory);
    len = currentFiles.length;
    for (i = 0; i < len; i++) {
      fileName = currentFiles[i];
      if (fs.statSync(directory + fileName).isDirectory()) {
        getFiles(directory+fileName+'/', results);
      } else if (allowedExtensions.checkExtension(fileName)) {
        results.push(directory+fileName);
      }
    }
  } catch (err) {
    console.log('[getDir.getFiles] ' + err);
  }
}

function parseLinks(dir, dirDepth){

  try {

    var mdLinks = "";

    dir.forEach(function(fileName){
      if (fileName.markdown == true){
        mdLinks += '<a href="#" class="link"><code>' + fileName.name + '</code></a>\n';
      }
      if (fileName.folder == true && fileName.name.charAt(0) != '.'){
        // only display visible folders (and not folders that begin with a dot)
        mdLinks += '<a href="#" class="link"><code>' + fileName.name + '</code></a>\n';
      }
    });

    mdLinks += '<div id="tri_buttons">'
    mdLinks += '<a href="#" id="new_file">New File</a>';
    if (dirDepth > 0){
      mdLinks += '<a href="#" id="go_back">Go Back</a>';
    } else {
      mdLinks += '<a href="#" id="go_back_inactive">Go Back</a>';
    }
    mdLinks += '<a href="#" id="new_folder">New Folder</a>';
    mdLinks += '</div>';

    return mdLinks;

  } catch (err) {
    console.log('error on parseLinks() on getDir.js: ' + err);
  }
}

exports.getDir = getDir;
exports.getAllFiles = getAllFiles;
exports.parseLinks = parseLinks;
