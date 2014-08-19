var fs = require('fs');
var path = require('path');
var async = require('async');

function NodeWiki(opts){

  opts = opts || {};

  this.config = opts.config || {};

  if (opts.rootDir){
    try {
      fs.statSync(opts.rootDir);
    } catch (err){
      if (err.code == 'ENOENT'){
        throw new TypeError('root directory does not exist');
      }
    }
  }
  this.rootDir = opts.rootDir || process.cwd();

  this.allowedExtensions = [
    '.md',
    '.mdown',
    '.markdown',
    '.mkd',
    '.mkdn',
    '.txt'
  ];

  this.marked = require('marked');

  this.app = require('./lib/create-express-app.js')();

  var Routes = require('./lib/routes');
  var routes = new Routes(this);
  this.app.use('/', routes);

}

NodeWiki.prototype.listFiles = function(dir, cb){

  var self = this;
  var reqDir = path.join(self.rootDir, dir);

  // check if requested directory is within root directory of nodewiki
  if (reqDir.indexOf(self.rootDir) !== 0){
    return cb('error');
  }

  var filteredFiles = [];

  var filter = function(file, callback){
    var filePath = path.join(reqDir, file);

    fs.stat(filePath, function(err, stats){
      if (err) throw err;

      if (stats.isDirectory()){
        filteredFiles.push({name: file + '/', type: 'dir'});
      } else if (self.allowedExtensions.indexOf(path.extname(file)) > -1 && stats.isFile()){
        filteredFiles.push({name: file, type: 'file'});
      }

      callback(null);
    });
  };

  fs.readdir(reqDir, function(err, files){
    if (files){
      async.each(files, filter, function(err){
        if (err){
          return cb('error with listing files');
        }

        return cb(null, filteredFiles);
      });
    } else {
      return cb('folder does not exist');
    }
  });

}

module.exports = NodeWiki;
