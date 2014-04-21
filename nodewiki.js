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

  var filteredFiles = [];

  var filter = function(file, callback){
    var filePath = path.join(self.currentDir.path, file);

    fs.stat(filePath, function(err, stats){
      if (err) throw err;

      if (stats.isDirectory()){
        filteredFiles.push({name: file, type: 'dir'});
      } else if (self.allowedExtensions.indexOf(path.extname(file)) > -1 && stats.isFile()){
        filteredFiles.push({name: file, type: 'file'});
      }

      callback(null);
    });
  };

  fs.readdir(self.currentDir.path, function(err, files){
    async.each(files, filter, function(err){
      if (err) console.log('error with listing files:', err);
      callback(filteredFiles);
    });
  });

}

module.exports = NodeWiki;
