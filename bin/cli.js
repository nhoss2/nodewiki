#!/usr/bin/env node

var Hapi = require('hapi');
var NodeWiki = require('../nodewiki');

var wiki = new NodeWiki();

var server = new Hapi.Server(process.env.PORT || 3000, {
  labels: ['api', 'static']
});

server.pack.register([
  {
    plugin: require('good'),
    options: {
      subscribers: {
        console: ['request', 'log', 'error'],
      }
    }
  },
  {
    plugin: require('../lib/api_plugin'),
    options: {
      wiki: wiki
    }
  },

  {
    plugin: require('../lib/static_plugin'),
  }
], function(err){
  if (err){
    throw new Error('Problem with registering plugins ' + err);
  }
});

server.start(function(){
  console.log('Nodewiki started at', server.info.uri);
});
