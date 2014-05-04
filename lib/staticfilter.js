var path = require('path');
var url = require('url');
var parseurl = require('parseurl');

var extentionFilter = function(allowedExtensions){

  if (typeof allowedExtensions == 'undefined'){
    throw new TypeError('Allowed extensions have not been defined');
  }
  
  return function(req, res, next){

    var ext = path.extname(parseurl(req).pathname);

    if (allowedExtensions.indexOf(ext) > -1){
      return next();
    } else {
      return res.send(404);
    }

  }

};

module.exports = extentionFilter;
