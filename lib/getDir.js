var fs = require("fs");
var allowedExtensions = require("./allowedExtensions");
var withMeta = require('./meta').withMeta;

// get contents of current directory
function getDir(directory, cb){
  withMeta(directory, function(meta){
    try {
      var currentFiles = fs.readdirSync(directory);
      var dir = [];
      currentFiles.forEach(function(fileName){
        var trueFileName = fileName;
        Object.keys(meta.aliases).forEach(function(alias){
          var src = meta.aliases[alias];
          if (fileName === src){
            fileName = alias;
          }
        });
        if (fs.statSync(directory + trueFileName).isDirectory() == true){
          dir.push({name: fileName + '/', folder: true, markdown: false});
        } else if (allowedExtensions.checkExtension(trueFileName) == true){
          dir.push({name: fileName, folder: false, markdown: true});
        } else {
          dir.push({name: fileName, folder: false, markdown: false});
        }

      });

      // "alphabetical" sorting, doesn't quite work - puts capital letters
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

      cb(dir);
    } catch (err) {
      console.log('error with getDir() on getDir.js: ' + err);
      cb([]);
    }
  });
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
exports.parseLinks = parseLinks;
