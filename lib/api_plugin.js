register = function(plugin, options, next){

  if (!options.wiki){
    return next('need a nodewiki object at options.wiki');
  } 

  select = plugin.select('api');

  /* POST /api/dir */
  select.route({
    method: 'POST',
    path: '/api/dir',
    config: {
      payload: {
        allow: 'application/json'
      }
    },
    handler: function(req, rep){
      var dir = req.payload.dir;

      if (!dir) return rep({});

      options.wiki.listFiles(dir, function(err, files){
        if (err){
          return rep({});
        } else {
          return rep(files)
        }
      });
    }
  });


  /* GET /api/raw */
  select.route({
    method: 'GET',
    path: '/api/raw/{path*}',
    config: {
      validate: {
        params: function(value, validationOptions, next){

          var path = value.path;

          if (!path || path.indexOf('.') == -1) return next('err');

          var ext = path.substr(path.lastIndexOf('.'));
          var allowedExtensions = options.wiki.allowedExtensions;

          if (allowedExtensions.indexOf(ext) > -1){
            return next(null, path);
          } else {
            return next('err');
          }
        }
      }
    },
    handler: {
      directory: {
        path: options.wiki.rootDir,
        index: false,
        listing: false
      }
    }
  });

  return next();

};

register.attributes = {
  name: 'nodewiki-api',
  version: '1.0.0'
}

exports.register = register;
