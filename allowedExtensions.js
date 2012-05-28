var path = require("path");

// checks if a given file name is allowed (this is usually for reading or writing)
// currently only allows markdown files, may allow text files in the future
function checkExtension(fileName){
  if (path.extname(fileName) == ".md" || path.extname(fileName) == ".mdown" || path.extname(fileName) == ".markdown"){
    return true;
  }
  return false;
}

exports.checkExtension = checkExtension;
