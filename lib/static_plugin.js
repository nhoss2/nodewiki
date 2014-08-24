var path = require('path');

/*
 * This plugin in only for static stuff like html views and 
 * for the public directory. This plugin could be replaced
 * by any webserver.
 */

register = function(plugin, options, next){

  select = plugin.select('static');

  /* GET index */
  select.route({
    method: 'GET',
    path: '/',
    handler: {
      file: path.join(__dirname, '..', 'views', 'index.html')
    }
  });

  /* GET public directory */
  select.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '..', 'public'),
        index: false,
        listing: false
      }
    }
  });



  return next();
};

register.attributes = {
  name: 'nodewiki-static',
  version: '1.0.0'
};

exports.register = register;
