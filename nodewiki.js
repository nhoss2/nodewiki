var fs = require('fs');
var path = require('path');
var async = require('async');

function NodeWiki(opts){

  opts = opts || {};

  this.config = opts.config || {};
  this.app = require('./lib/create-express-app.js')();

  var Routes = require('./lib/routes');
  var routes = new Routes(this);
  this.app.use('/', routes);

  this.currentDir = {
    files: [],
    path: opts.currentDir || process.cwd()
  };

  this.allowedExtensions = [
    '.md',
    '.mdown',
    '.markdown',
    '.mkd',
    '.mkdn',
    '.txt'
  ];

}

NodeWiki.prototype.listFiles = function(callback){
  var self = this;

  var iterator = function(file, callback){
    if(self.allowedExtensions.indexOf(path.extname(file)) > -1){
      callback(true)
    } else {
      callback(false);
    }
  };

  fs.readdir(self.currentDir.path, function(err, files){
    async.filter(files, iterator, function(resultFiles){
      callback(resultFiles);
    });
  });
}

module.exports = NodeWiki;
