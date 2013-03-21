var fs = require('fs');

var withMeta = exports.withMeta = function(directory, cb){
  var metaPath = directory + "index.json";
  fs.readFile(metaPath, 'utf-8', function(err,meta){
    var metaChanged = false;
    if (err){
      meta = {index:"index.md",aliases:{}};
      metaChanged = true;
    } else {
      try{
        meta = JSON.parse(meta);
      } catch(e){
        meta = {index:"index.md",aliases:{}};
        metaChanged = true;
      }
    }
    if (!meta.hasOwnProperty('index') || typeof meta.index !== 'string'){
      meta.index = 'index.md';
      metaChanged = true;
    }
    if (!meta.hasOwnProperty('aliases') || typeof meta.aliases !== 'object'){
      meta.aliases = {};
      metaChanged = true;
    }
    cb(meta);
    if (metaChanged){
      var metaString = JSON.stringify(meta, null, 2);
      fs.writeFile(metaPath, metaString, function(err,res){});
    }
  });
}
