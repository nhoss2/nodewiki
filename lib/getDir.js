var fs = require("fs");
var allowedExtensions = require("./allowedExtensions");

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

    // "alphebetical" sorting, doesn't quite work - puts capital letters
    // ahead of lowercase letters but other then that its ok
    dir.sort(function(a, b){
      if ([a.name, b.name].sort()[0] == a.name) return -1;
      return 1;
    });

    // after the alphebetical sorting, the folders get serpated from the files
    dir.sort(function(a, b){
      if (a.folder == true && b.folder == false) return -1;
      if (a.folder == false && b.folder == true) return 1;
      return 0;
    });

    return dir;

  } catch (err) {
    console.log('error with getDir() on getDir.js: ' + err);
  }
}

function parseLinks(dir, dirDepth){
  /* tri_buttons menu moved above filelist */
  try {

    var mdLinks = "";

    mdLinks += '<div id="tri_buttons"><ul>'
    if (dirDepth > 0){
      mdLinks += '<li><a href="#" class="btn btn-sm btn-default" id="go_back" title="Go back"><span class="glyphicon glyphicon-arrow-left"></span></a></li>';
    } else {
      mdLinks += '<li><a href="#" class="btn btn-sm btn-default disabled" id="go_back_inactive"><span class="glyphicon glyphicon-arrow-left"></span></a></li>';
    }
    mdLinks += '<li><a href="#" class="btn btn-sm btn-default" id="new_file" title="New file"><span class="glyphicon glyphicon-plus"></span></a></li>';
    mdLinks += '<li><a href="#" class="btn btn-sm btn-default" id="new_folder" title="New directory"><span class="glyphicon glyphicon-folder-open"></a></li>';
    mdLinks += '</ul></div><ul>';

    dir.forEach(function(fileName){
      if (fileName.markdown == true){
        mdLinks += '<li><a href="#" class="link">' + fileName.name + '</a></li>';
      }
      if (fileName.folder == true && fileName.name.charAt(0) != '.'){
        // only display visible folders (and not folders that begin with a dot)
        mdLinks += '<li><a href="#" class="link">' + fileName.name + '</a></li>';
      }
    });

    /*mdLinks += '<div id="tri_buttons"><ul>'
    mdLinks += '<li><a href="#" class="btn btn-sm btn-default" id="new_file">New File</a></li>';
    if (dirDepth > 0){
      mdLinks += '<li><a href="#" class="btn btn-sm btn-default" id="go_back">Go Back</a></li>';
    } else {
      mdLinks += '<li><a href="#" class="btn btn-sm btn-default disabled" id="go_back_inactive">Go Back</a></li>';
    }
    mdLinks += '<li><a href="#" class="btn btn-sm btn-default" id="new_folder">New Folder</a></li>';
    mdLinks += '</ul></div>';*/

    mdLinks += '</ul>';

    return mdLinks;

  } catch (err) {
    console.log('error on parseLinks() on getDir.js: ' + err);
  }
}

exports.getDir = getDir;
exports.parseLinks = parseLinks;
