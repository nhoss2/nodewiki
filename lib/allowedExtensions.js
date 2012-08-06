var path = require("path");

// checks if a given file name is allowed (this is usually for reading or writing)
function checkExtension(fileName){
  if (path.extname(fileName) == ".md" || path.extname(fileName) == ".mdown" || path.extname(fileName) == ".markdown" || path.extname(fileName) == ".mkd" || path.extname(fileName) == ".mkdn" || path.extname(fileName) == ".txt"){
    return true;
  }
  return false;
}

exports.checkExtension = checkExtension;
