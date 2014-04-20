#!/usr/bin/env node

var http = require('http');
var NodeWiki = require('../nodewiki');

var wiki = new NodeWiki();

wiki.app.set('port', process.env.PORT || 3000);

var server = http.createServer(wiki.app);

server.listen(wiki.app.get('port'), function(){
  console.log('Node Wiki started');
});
